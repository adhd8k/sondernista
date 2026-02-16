terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # Remote state — uncomment and configure for team use:
  # backend "gcs" {
  #   bucket = "sondernista-tfstate"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ---------------------------------------------------------------------------
# GCS bucket for static site
# ---------------------------------------------------------------------------
resource "google_storage_bucket" "site" {
  name     = var.bucket_name
  location = var.region

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  # Optional: lifecycle rule to clean up old versions
  versioning {
    enabled = false
  }

  force_destroy = true
}

# Make the bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ---------------------------------------------------------------------------
# Load balancer + CDN (only when custom domain is set)
# ---------------------------------------------------------------------------
resource "google_compute_backend_bucket" "site" {
  count = var.domain != "" ? 1 : 0

  name        = "sondernista-backend"
  bucket_name = google_storage_bucket.site.name
  enable_cdn  = true

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    max_ttl                      = 86400
    serve_while_stale            = 86400
    signed_url_cache_max_age_sec = 0
  }
}

resource "google_compute_url_map" "site" {
  count = var.domain != "" ? 1 : 0

  name            = "sondernista-url-map"
  default_service = google_compute_backend_bucket.site[0].self_link
}

# Reserve a global static IP
resource "google_compute_global_address" "site" {
  count = var.domain != "" ? 1 : 0

  name = "sondernista-ip"
}

# Managed SSL certificate
resource "google_compute_managed_ssl_certificate" "site" {
  count = var.domain != "" ? 1 : 0

  name = "sondernista-cert"

  managed {
    domains = [var.domain]
  }
}

# HTTPS proxy
resource "google_compute_target_https_proxy" "site" {
  count = var.domain != "" ? 1 : 0

  name             = "sondernista-https-proxy"
  url_map          = google_compute_url_map.site[0].self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.site[0].self_link]
}

# HTTPS forwarding rule
resource "google_compute_global_forwarding_rule" "https" {
  count = var.domain != "" ? 1 : 0

  name                  = "sondernista-https"
  target                = google_compute_target_https_proxy.site[0].self_link
  port_range            = "443"
  ip_address            = google_compute_global_address.site[0].address
  load_balancing_scheme = "EXTERNAL"
}

# HTTP → HTTPS redirect
resource "google_compute_url_map" "http_redirect" {
  count = var.domain != "" ? 1 : 0

  name = "sondernista-http-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "redirect" {
  count = var.domain != "" ? 1 : 0

  name    = "sondernista-http-redirect-proxy"
  url_map = google_compute_url_map.http_redirect[0].self_link
}

resource "google_compute_global_forwarding_rule" "http" {
  count = var.domain != "" ? 1 : 0

  name                  = "sondernista-http"
  target                = google_compute_target_http_proxy.redirect[0].self_link
  port_range            = "80"
  ip_address            = google_compute_global_address.site[0].address
  load_balancing_scheme = "EXTERNAL"
}

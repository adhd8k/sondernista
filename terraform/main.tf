terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure for remote state:
  # backend "gcs" {
  #   bucket = "your-tf-state-bucket"
  #   prefix = "sondernista"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ─── GCS Bucket (Static Site) ───────────────────────────────

resource "google_storage_bucket" "site" {
  name          = local.bucket_name
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }
}

# Make bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ─── Cloud CDN + HTTPS Load Balancer ────────────────────────

# Backend bucket for CDN
resource "google_compute_backend_bucket" "site" {
  name        = "${local.bucket_name}-backend"
  bucket_name = google_storage_bucket.site.name
  enable_cdn  = true

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    max_ttl                      = 86400
    client_ttl                   = 3600
    serve_while_stale            = 86400
    negative_caching             = true
  }
}

# Reserve a global static IP
resource "google_compute_global_address" "site" {
  name = "${local.bucket_name}-ip"
}

# URL map
resource "google_compute_url_map" "site" {
  name            = "${local.bucket_name}-url-map"
  default_service = google_compute_backend_bucket.site.id
}

# Managed SSL certificate
resource "google_compute_managed_ssl_certificate" "site" {
  name = "${local.bucket_name}-cert"

  managed {
    domains = [var.domain]
  }
}

# HTTPS proxy
resource "google_compute_target_https_proxy" "site" {
  name             = "${local.bucket_name}-https-proxy"
  url_map          = google_compute_url_map.site.id
  ssl_certificates = [google_compute_managed_ssl_certificate.site.id]
}

# HTTPS forwarding rule
resource "google_compute_global_forwarding_rule" "https" {
  name       = "${local.bucket_name}-https"
  target     = google_compute_target_https_proxy.site.id
  port_range = "443"
  ip_address = google_compute_global_address.site.address
}

# HTTP → HTTPS redirect
resource "google_compute_url_map" "http_redirect" {
  name = "${local.bucket_name}-http-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "redirect" {
  name    = "${local.bucket_name}-http-proxy"
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name       = "${local.bucket_name}-http"
  target     = google_compute_target_http_proxy.redirect.id
  port_range = "80"
  ip_address = google_compute_global_address.site.address
}

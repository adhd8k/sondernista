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
# Served via Cloudflare for HTTPS, CDN, and DNS.

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

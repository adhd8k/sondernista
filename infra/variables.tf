variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-east1"
}

variable "domain" {
  description = "Custom domain for the site (optional, leave empty to use GCS URL only)"
  type        = string
  default     = ""
}

variable "bucket_name" {
  description = "GCS bucket name (must be globally unique; use domain name for custom domain hosting)"
  type        = string
  default     = "sondernista-site"
}

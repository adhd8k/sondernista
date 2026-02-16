variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-east1"
}

variable "domain" {
  description = "Primary domain for the site — also used as the GCS bucket name (required for GCS website hosting)"
  type        = string
  default     = "sondernista.com"
}

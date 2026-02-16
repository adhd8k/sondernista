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
  description = "Primary domain for the site (e.g. sondernista.com)"
  type        = string
  default     = "sondernista.com"
}

variable "bucket_name" {
  description = "GCS bucket name (must be globally unique, typically the domain)"
  type        = string
  default     = ""
}

locals {
  bucket_name = var.bucket_name != "" ? var.bucket_name : replace(var.domain, ".", "-")
}

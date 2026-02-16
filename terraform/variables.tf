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

# ─── Cloudflare ──────────────────────────────────────────────

variable "cloudflare_api_token" {
  description = "Cloudflare API token (Zone:DNS:Edit, Zone:Zone:Read, Account:Access:Edit)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

# ─── Access (Protected Galleries) ────────────────────────────

variable "protected_paths" {
  description = "URL paths to protect with Cloudflare Access (e.g. [\"/work/private/*\", \"/assignments/bme/*\"]). Empty list disables Access."
  type        = list(string)
  default     = []
}

variable "access_allowed_emails" {
  description = "Email addresses allowed to access protected galleries (OTP will be sent to these)"
  type        = list(string)
  default     = []
}

variable "access_session_duration" {
  description = "How long an Access session lasts before re-auth"
  type        = string
  default     = "24h"
}

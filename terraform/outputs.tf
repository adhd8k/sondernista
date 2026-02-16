output "bucket_name" {
  description = "GCS bucket name"
  value       = google_storage_bucket.site.name
}

output "bucket_url" {
  description = "Direct GCS website URL"
  value       = "https://storage.googleapis.com/${google_storage_bucket.site.name}/index.html"
}

output "site_url" {
  description = "Live site URL (via Cloudflare)"
  value       = "https://${var.domain}"
}

output "cloudflare_dns_target" {
  description = "Set Cloudflare CNAME record to this value"
  value       = "c.storage.googleapis.com"
}

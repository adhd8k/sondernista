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

output "nameservers" {
  description = "Cloudflare nameservers for this zone"
  value       = data.cloudflare_zone.site.name_servers
}

output "protected_paths" {
  description = "Paths protected by Cloudflare Access"
  value       = var.protected_paths
}

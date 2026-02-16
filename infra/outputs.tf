output "bucket_name" {
  description = "GCS bucket name"
  value       = google_storage_bucket.site.name
}

output "bucket_url" {
  description = "Direct GCS website URL"
  value       = "https://storage.googleapis.com/${google_storage_bucket.site.name}/index.html"
}

output "site_url" {
  description = "Public site URL (custom domain or GCS)"
  value       = var.domain != "" ? "https://${var.domain}" : "http://${google_storage_bucket.site.name}.storage.googleapis.com"
}

output "load_balancer_ip" {
  description = "Load balancer IP (set DNS A record to this)"
  value       = var.domain != "" ? google_compute_global_address.site[0].address : null
}

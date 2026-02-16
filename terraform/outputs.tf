output "bucket_name" {
  description = "GCS bucket name"
  value       = google_storage_bucket.site.name
}

output "bucket_url" {
  description = "Direct GCS website URL"
  value       = "https://storage.googleapis.com/${google_storage_bucket.site.name}/index.html"
}

output "load_balancer_ip" {
  description = "Static IP for DNS A record"
  value       = google_compute_global_address.site.address
}

output "site_url" {
  description = "Live site URL"
  value       = "https://${var.domain}"
}

output "dns_instructions" {
  description = "DNS configuration required"
  value       = "Point ${var.domain} A record to ${google_compute_global_address.site.address}"
}

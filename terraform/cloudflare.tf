# ─── Cloudflare Provider ─────────────────────────────────────
# API token needs: Zone:DNS:Edit, Zone:Zone:Read, Account:Access:Edit

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Look up the zone
data "cloudflare_zone" "site" {
  filter = {
    name = var.domain
  }
}

# ─── DNS Records ─────────────────────────────────────────────

# Apex domain → GCS
resource "cloudflare_dns_record" "apex" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "CNAME"
  content = "c.storage.googleapis.com"
  proxied = true
  ttl     = 1
}

# www → apex (proxied so redirect rule can fire)
resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = var.domain
  proxied = true
  ttl     = 1
}


# ─── Cloudflare Access (Protected Galleries) ─────────────────
# One Access application + inline policy per protected path.
# Uses email OTP (one-time PIN) — no IdP setup required.
# Set protected_paths = [] to skip Access entirely.

resource "cloudflare_zero_trust_access_application" "protected" {
  for_each = toset(var.protected_paths)

  zone_id          = data.cloudflare_zone.site.zone_id
  name             = "Protected: ${each.value}"
  domain           = "${var.domain}${each.value}"
  type             = "self_hosted"
  session_duration = var.access_session_duration

  destinations = [
    {
      type = "public"
      uri  = "${var.domain}${each.value}"
    }
  ]

  # Inline policy: allow specific emails via OTP
  policies = [
    {
      name       = "Allowed emails"
      decision   = "allow"
      precedence = 1
      include = [
        for email in var.access_allowed_emails : {
          email = {
            email = email
          }
        }
      ]
    }
  ]
}

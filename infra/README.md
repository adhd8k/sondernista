# Sondernista — Deployment Scripts

Deployment tooling for the Sondernista static site hosted on GCS (via Cloudflare).

Terraform infrastructure lives in [`../terraform/`](../terraform/).

## Deploy Site Content

```bash
# Build the site first
cd .. && npm run build

# Upload to GCS
./deploy.sh
```

The deploy script reads the bucket name from Terraform output (`../terraform/`), or you can pass it directly:

```bash
./deploy.sh sondernista.com
```

## Cache Strategy

- **HTML**: 5 min TTL (quick updates)
- **`_astro/` assets**: 1 year, immutable (content-hashed by Astro)

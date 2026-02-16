# Sondernista — GCS Static Hosting (Terraform)

Infrastructure for hosting Sondernista as a static site on Google Cloud Storage.

## Architecture

**Basic (no custom domain):**
- GCS bucket with public read access + website configuration

**With custom domain:**
- GCS bucket + Cloud CDN + HTTPS load balancer + managed SSL certificate
- HTTP → HTTPS redirect

## Setup

### Prerequisites
- [Terraform](https://www.terraform.io/downloads) ≥ 1.5
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) authenticated
- A GCP project with billing enabled

### Required GCP APIs
```bash
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com  # only for custom domain
```

### Deploy Infrastructure
```bash
cd infra/
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project ID and settings

terraform init
terraform plan
terraform apply
```

### Deploy Site Content
```bash
# Build the site first
cd .. && npm run build

# Upload to GCS
cd infra/ && ./deploy.sh
```

### Custom Domain (optional)
1. Set `domain` in `terraform.tfvars`
2. Run `terraform apply`
3. Point your domain's DNS A record to the `load_balancer_ip` output
4. Wait for SSL certificate provisioning (~15-30 min)

## Files
| File | Purpose |
|------|---------|
| `main.tf` | GCS bucket, CDN, load balancer, SSL |
| `variables.tf` | Input variables |
| `outputs.tf` | Useful outputs (URLs, IPs) |
| `deploy.sh` | Upload `dist/` to GCS bucket |
| `terraform.tfvars.example` | Template for your config |

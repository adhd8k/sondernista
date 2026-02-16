#!/usr/bin/env bash
# Deploy Sondernista static site to GCS
# Usage: ./deploy.sh [bucket-name]
#
# Requires: gcloud CLI authenticated, gsutil available
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST_DIR="${PROJECT_ROOT}/dist"

# Get bucket name from arg, tfvars, or default
BUCKET="${1:-$(cd "$SCRIPT_DIR" && terraform output -raw bucket_name 2>/dev/null || echo "sondernista-site")}"

if [ ! -d "$DIST_DIR" ]; then
  echo "❌ No dist/ directory. Run 'npm run build' first."
  exit 1
fi

echo "🚀 Deploying to gs://${BUCKET}..."

# Sync with correct cache headers
# HTML: short cache (5 min) for quick updates
gsutil -m rsync -r -d \
  -x '\.git|node_modules' \
  "$DIST_DIR" "gs://${BUCKET}"

# Set cache headers: HTML gets short TTL, assets get long TTL
gsutil -m setmeta -h "Cache-Control:public, max-age=300" "gs://${BUCKET}/**.html" 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" "gs://${BUCKET}/_astro/**" 2>/dev/null || true

echo "✅ Deployed to gs://${BUCKET}"
echo "   URL: https://storage.googleapis.com/${BUCKET}/index.html"

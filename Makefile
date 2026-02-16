# ─── SONDERNISTA Makefile ────────────────────────────────────
#
# Usage:
#   make init       — Initialize Terraform
#   make plan       — Preview infrastructure changes
#   make apply      — Create/update infrastructure
#   make destroy    — Tear down infrastructure
#   make build      — Build Astro site
#   make deploy     — Build + push to GCS
#   make push       — Push dist/ to GCS (without rebuilding)
#   make preview    — Build + serve locally
#   make invalidate — Invalidate CDN cache
#
# ─────────────────────────────────────────────────────────────

SHELL := /bin/bash
.DEFAULT_GOAL := help

# Config
TF_DIR       := terraform
DIST_DIR     := dist
BUCKET_NAME  := $(shell cd $(TF_DIR) && terraform output -raw bucket_name 2>/dev/null)

# ─── Help ────────────────────────────────────────────────────

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ─── Terraform ───────────────────────────────────────────────

.PHONY: init plan apply destroy

init: ## Initialize Terraform
	cd $(TF_DIR) && terraform init

plan: ## Preview infrastructure changes
	cd $(TF_DIR) && terraform plan

apply: ## Create/update infrastructure
	cd $(TF_DIR) && terraform apply

destroy: ## Tear down all infrastructure
	cd $(TF_DIR) && terraform destroy

# ─── Build ───────────────────────────────────────────────────

.PHONY: build dev preview

build: ## Build Astro site to dist/
	npm run build

dev: ## Start dev server
	npm run dev

preview: build ## Build + serve locally
	npm run preview

clean: ## Clean dist/ directory
	rm -rf $(DIST_DIR)/*

# ─── Deploy ──────────────────────────────────────────────────

.PHONY: push deploy invalidate

push: ## Sync dist/ to GCS bucket
	@if [ -z "$(BUCKET_NAME)" ]; then \
		echo "Error: Could not determine bucket name. Run 'make apply' first."; \
		exit 1; \
	fi
	@echo "Deploying to gs://$(BUCKET_NAME)..."
	gsutil -m rsync -r -d -c $(DIST_DIR)/ gs://$(BUCKET_NAME)/
	@echo "Setting cache headers..."
	gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://$(BUCKET_NAME)/**
	gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" gs://$(BUCKET_NAME)/_astro/**
	@echo "✓ Deployed to gs://$(BUCKET_NAME)"

deploy: build push ## Build + deploy to GCS

invalidate: ## Invalidate CDN cache
	@if [ -z "$(BUCKET_NAME)" ]; then \
		echo "Error: Could not determine bucket name."; \
		exit 1; \
	fi
	gcloud compute url-maps invalidate-cdn-cache $(BUCKET_NAME)-url-map --path "/*" --async
	@echo "✓ CDN cache invalidation started"

# ─── Full Setup ──────────────────────────────────────────────

.PHONY: setup

setup: init apply build push invalidate ## Full setup: infra + build + deploy
	@echo ""
	@echo "✓ Site deployed! Run 'cd $(TF_DIR) && terraform output' for details."

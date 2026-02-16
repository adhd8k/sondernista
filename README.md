# SONDERNISTA

A photographic practice based in Ontario, Canada. Street photography, candid portraiture, and documentation of the body modification subculture.

**[sondernista.com](https://sondernista.com)**

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — styling
- [Google Cloud Storage](https://cloud.google.com/storage) — hosting
- [Cloudflare](https://cloudflare.com) — DNS, HTTPS, CDN, Access
- [Terraform](https://terraform.io) — infrastructure as code

## Project Structure

```
├── src/
│   ├── assets/images/       # Source images (optimized at build time)
│   ├── components/          # Astro components (Header, Footer, ProjectCard, etc.)
│   ├── data/projects.ts     # Project + assignment data
│   ├── integrations/        # Custom Astro integrations
│   ├── layouts/Layout.astro # Base layout
│   ├── pages/               # Routes
│   │   ├── index.astro      # Home (featured project)
│   │   ├── work/            # Gallery pages
│   │   ├── assignments.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   └── styles/global.css    # Global styles + theme tokens
├── public/                  # Static assets (favicon, signature)
├── terraform/               # GCS bucket + Cloudflare DNS/Access
├── infra/                   # Deploy scripts
└── Makefile                 # Build + deploy commands
```

## Development

```bash
npm install
npm run dev        # Dev server at localhost:4321
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```

## Infrastructure

Terraform manages GCS hosting and Cloudflare (DNS, www redirect, Access-protected galleries).

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Edit with your GCP project ID, Cloudflare API token, etc.

make init          # terraform init
make plan          # Preview changes
make apply         # Apply infrastructure
```

## Deploy

```bash
make deploy        # Build + sync to GCS
# or separately:
make build         # Build only
make push          # Sync dist/ to GCS only
```

## Make Targets

| Command          | Action                                |
| :--------------- | :------------------------------------ |
| `make help`      | Show all available targets            |
| `make dev`       | Start dev server                      |
| `make build`     | Build site to `dist/`                 |
| `make deploy`    | Build + push to GCS                   |
| `make push`      | Push `dist/` to GCS (no rebuild)      |
| `make init`      | Initialize Terraform                  |
| `make plan`      | Preview infrastructure changes        |
| `make apply`     | Create/update infrastructure          |
| `make setup`     | Full setup: infra + build + deploy    |

## Theme

Dark brutalist photography portfolio.

- Background: `#0a0a0a`
- Text: `#e5e5e5`
- Font: Zalando Sans Expanded
- Brand name always in caps: **SONDERNISTA**

## License

All photographs © SONDERNISTA. All rights reserved.

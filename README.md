# SONDERNISTA

A photographic practice based in Ontario, Canada. Street photography, candid portraiture, and documentation of the body modification subculture.

**[sondernista.com](https://sondernista.com)**

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — styling
- [sharp](https://sharp.pixelplumbing.com) — one-off image optimisation (`npm run images`)
- [GitHub Pages](https://pages.github.com) — hosting, built and deployed by GitHub Actions on every push to `main`
- [Cloudflare](https://cloudflare.com) — DNS, HTTPS, CDN, Access
- [Terraform](https://terraform.io) — Cloudflare + legacy GCS bucket (see "Infrastructure")

## Project Structure

```
├── .github/workflows/deploy.yml  # Build + deploy to GitHub Pages
├── scripts/optimize-images.mjs   # original-images/ → images/ (web-sized)
├── src/
│   ├── assets/
│   │   ├── original-images/ # Full-resolution archive — GITIGNORED, never deployed
│   │   └── images/          # Web-sized derivatives — COMMITTED, built by Astro
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
npm run images     # Regenerate src/assets/images/ from src/assets/original-images/
```

## Images

Two trees live under `src/assets/`:

| Directory          | Contents                                    | In git | Deployed |
| :----------------- | :------------------------------------------ | :----- | :------- |
| `original-images/` | Full-resolution archive, sidecars, scans    | no     | never    |
| `images/`          | Web-sized derivatives, one per original     | yes    | via Astro `<Image>` |

`npm run images` mirrors `original-images/` into `images/` one-to-one: same
directory layout, same filenames, so `img()` / `galleryFrom()` keys in
`src/data/projects.ts` never change. Each raster is resized to at most 2400px on
the long edge, re-encoded (mozjpeg, quality 86, 4:4:4), converted to sRGB and
stripped of EXIF/ICC/GPS. SVGs are copied. Dotfiles, `.AppleDouble/`, and `.pp3`
sidecars are ignored. Only missing or stale derivatives are rebuilt, so a re-run
on an unchanged archive writes nothing.

```bash
npm run images              # build what is missing or out of date
npm run images -- --force   # rebuild everything (after changing size/quality)
npm run images -- --prune   # also delete derivatives whose original is gone
```

Workflow for new frames: drop the originals into
`src/assets/original-images/work/<dir>/`, run `npm run images`, reference them
from `projects.ts`, commit `src/assets/images/work/<dir>/` alongside the data
change. GitHub Actions builds from the committed derivatives; it never needs the
archive.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` runs `npm ci && npm run build`
and publishes `dist/` to GitHub Pages (it enables Pages on the first run).
Trigger a rebuild without a code change from the Actions tab (`workflow_dispatch`).

One-time setup for the custom domain, after the first successful run:

```bash
# Tell Pages which hostname it serves (the CNAME file is ignored for
# Actions-based deploys, so this is set on the repo instead).
gh api -X PUT repos/adhd8k/sondernista/pages -f cname=sondernista.com -F https_enforced=true
```

Then point DNS at Pages: `sondernista.com` → the four GitHub Pages apex A
records (or `www` → `adhd8k.github.io` CNAME). With the Cloudflare proxy on,
set SSL mode to Full so GitHub's certificate is honoured, and Cloudflare Access
rules keep working in front of Pages exactly as they did in front of GCS.

Until the custom domain is set, the `*.github.io/sondernista/` preview URL has
broken navigation: the site links with root-absolute paths (`/work/...`).

## Infrastructure

Terraform manages Cloudflare (DNS, www redirect, Access-protected galleries)
and the original GCS bucket. The `make deploy` / `make push` targets still
sync `dist/` to that bucket if you need to; they are not used by the GitHub
Pages pipeline.

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

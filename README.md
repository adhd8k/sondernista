# SONDERNISTA

Static photographic portfolio for Jonathon W. Marshall.

## Repository layout

```text
site/
├── index.html       # Single-page portfolio
├── 404.html         # GitHub Pages fallback
├── style.css        # Site styles
├── gallery.js       # Accessible full-screen gallery viewer
├── favicon.svg
└── assets/          # Web-ready WebP photographs
.github/workflows/
└── deploy.yml       # Publishes site/ to GitHub Pages
terraform/           # Cloudflare configuration; managed separately
```

The site has no build step, package manager, framework, or runtime dependency.
The files in `site/` are the deployable artifact and can be previewed with any
static web server, for example:

```bash
python3 -m http.server 8000 --directory site
```

Push to `main` to publish through GitHub Pages. The workflow uploads `site/`
directly and does not run npm, Astro, image processing, or infrastructure
commands.

All photographs © SONDERNISTA. All rights reserved.

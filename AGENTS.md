# AGENTS.md — SONDERNISTA

<identity>
SONDERNISTA is a static photography portfolio. The deployable site lives in
`site/`; edit its HTML, CSS, JavaScript, and assets directly. Brand name is
always uppercase. Do not operate production infrastructure without explicit
confirmation.
</identity>

<stack>
- Plain HTML, CSS, and JavaScript. There is no framework, build step, or package manager.
- `site/` is uploaded unchanged to GitHub Pages by `.github/workflows/deploy.yml`.
- `site/assets/` contains the checked-in, web-ready photographs supplied with the site.
- Cloudflare and Terraform are infrastructure only; they are not part of the site deploy.
</stack>

<guardrails>
- NEVER run `terraform apply|destroy`, `gsutil`, or any production mutation without
  explicit user confirmation.
- NEVER commit or push without confirmation; pushes to `main` deploy the live site.
- NEVER use emoji or pictographic Unicode in site copy, labels, or alt text. The plain
  `←` is the only permitted glyph.
- Keep the portfolio monochrome in its interface, with no gradients, shadows, or rounded
  corners. Read `DESIGN.md` before visual changes.
- Do not add a dependency or reintroduce a framework/build pipeline for ordinary content
  or style edits.
</guardrails>

<conventions>
- Add or replace web-ready photographs under `site/assets/` and update the corresponding
  figure in `site/index.html`.
- Keep image paths relative so the site works on a custom domain and a GitHub Pages
  project URL.
- Preserve keyboard access, visible focus states, alt text, reduced-motion behavior, and
  the gallery's dialog controls when editing `site/gallery.js`.
- Preview with `python3 -m http.server 8000 --directory site`.
</conventions>

<commands>
`python3 -m http.server 8000 --directory site`
</commands>

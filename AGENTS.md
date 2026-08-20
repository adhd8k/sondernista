# AGENTS.md — SONDERNISTA

<identity>
Static photography portfolio. You edit content, components, and styles. You do not
operate infrastructure: treat the GCS bucket, Cloudflare, and Terraform state as
production — off-limits without explicit user confirmation. Brand name is always
uppercase: SONDERNISTA.
</identity>

<stack>
- Astro 5, static output (`astro build` → `dist/`). Dev server: `localhost:4321`.
- Tailwind CSS 4 via `@tailwindcss/vite`. Theme is CSS-first in `src/styles/global.css`
  under `@theme`. There is NO `tailwind.config.js`.
- TypeScript. Content model lives in `src/data/projects.ts` (`projects[]`, plus the CV
  lists `exhibitions[]`, `assignments[]`, `publications[]`).
- Images: source in `src/assets/images/`, optimized at build by `astro:assets` `<Image>`.
  Originals are gitignored.
- Hosting: Google Cloud Storage + Cloudflare, provisioned by Terraform (`terraform/`),
  driven by `Makefile`.
</stack>

<guardrails>
- NEVER run deploy or infra commands (`make deploy|push|apply|destroy|invalidate`,
  `gsutil`, `terraform apply|destroy`) without explicit user confirmation. They mutate
  live production.
- NEVER `git add` paths under `src/assets/images/` or `src/assets/original-images/`.
  Gitignored large binaries.
- NEVER create `tailwind.config.js`. Edit theme tokens in `src/styles/global.css` `@theme`.
- NEVER add color, gradients, shadows, or rounded corners. Palette is monochrome;
  `--radius: 0`. Read DESIGN.md before any visual change.
- NEVER use emoji or pictographic Unicode (`↗`, `✓`, `★`, `→`) in site copy,
  labels, or alt text. They render in colour and break the monochrome page. The
  plain `←` on back links is the only permitted glyph. See DESIGN.md §1.
- NEVER write bare element rules outside `@layer base` in `global.css`. Unlayered
  CSS outranks Tailwind's layered utilities, so a stray `h2 { font-size }` at the
  top level silently defeats every `text-*` class on the site.
- ALWAYS size frames with `height={LONG_EDGE}` on `<Image>`. NEVER read
  `image.width`/`.height` in frontmatter to compute a width — it defeats Vite's
  tree-shaking and emits every full-resolution original into `dist/`.
- Reference build-optimized images ONLY through the `img()` / `galleryFrom()` helpers in
  `projects.ts` plus `<Image>`. Never hardcode `/images/...` paths for them.
</guardrails>

<conventions>
Add a project by appending to `projects[]` in `src/data/projects.ts`; drop frames into
`src/assets/images/work/<dir>/`. Use the glob helpers, never raw `import`:

```ts
{
  slug: "klakstein",                          // → /work/klakstein
  image: img('work/2022-klakstein/05.jpg'),   // card + hero frame
  title: "KLAKSTEIN",                         // uppercase display
  year: "2022",
  description: "…",                           // one or two sentences, for the card
  longDescription: ["…", "…"],                // paragraphs, for the project page
  gallery: galleryFrom('work/2022-klakstein', {
    '05.jpg': {                               // per-frame metadata, keyed by filename
      caption: 'Stone folding against grey sky.',   // also becomes the alt text
      place: 'Vienna, AT',
      stock: 'ACROS +R', camera: 'FUJIFILM X-T2', exposure: '1/250 f/8',
    },
  }),
  tags: ['architecture', 'monochrome', 'digital'],
  recipe: { camera: 'FUJIFILM X-T2', simulation: 'ACROS +R', settings: ['Grain Strong'] },
}
```

`galleryFrom` takes the whole directory sorted alphabetically and returns `Plate[]`.
The metadata argument is optional and partial — naming a file that does not exist is
a build error. It also sets the running order: frames appear in the order they are
written there, and anything unlisted follows alphabetically. Reorder the block to
reorder the gallery. Every frame gets a `<PlateLabel>` beneath it: caption and place on one
line, then the technical line prefixed with `#NN`. A frame with no metadata shows just
its index.

Everything in `projects[]` renders. To retire a project, move its entry to
`archivedProjects[]` — drop `image`/`gallery`, add `imageDir` — and add that
directory to `EXCLUDED_IMAGE_DIRS` and to the glob's `!` patterns. The writing
and the frames are kept; nothing is built or deployed.

The image glob is EAGER, so anything it matches ships whether or not a page
renders it. Any directory under `src/assets/images/` that no live entry
references must be excluded, or its originals land in `dist/`.

The `/cv` page renders `exhibitions[]`, `assignments[]`, and `publications[]` —
all `CVEntry[]` — as ruled sections. Empty sections hide themselves. No images
are shown there. `/assignments` is a redirect to `/cv` (see `astro.config.mjs`).
</conventions>

<routing>
- Build / deploy / infra steps → README.md + `Makefile` (run `make help`).
- Design, voice, color, typography, layout → DESIGN.md is authoritative. Do not restate
  its rules here.
- Infrastructure edits → `terraform/`, README "Infrastructure".
</routing>

<commands>
`npm run dev` · `npm run build` · `npm run preview` · `make help`
</commands>

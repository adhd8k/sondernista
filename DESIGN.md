# SONDERNISTA — Design Specification

> A design brief for developers and AI agents extending **sondernista.com** —
> the documentary practice of Jonathon W. Marshall, photographing the body
> modification community and the modern era of body suspension.
>
> Values here are read from source (`src/styles/global.css`, the components, and
> `src/data/projects.ts`). When you change one, change it here too.

---

## 1. Brand voice & philosophy

The site is a documentary portfolio. It behaves like a gallery wall, not a
website: the work is the interface, and everything around it recedes.

**Core principles**

- **Photographs first, chrome last.** The interface exists only to frame the
  images. UI never competes with the work — it stays dark, small, and quiet.
- **Record, not decoration.** The pictures are evidence as much as art. Metadata
  is part of the work: where a frame was made and on what. Show it plainly.
- **Slow looking.** One image at a time, generous vertical breathing room, no
  dense grids or thumbnails competing for attention.
- **Deliberate, not decorative.** No gradients, no rounded-corner cards, no drop
  shadows, no illustration. Every element is flat, sharp, and intentional.
- **The method matches the subject.** Push-processed black-and-white film,
  direct flash, high-ISO digital — inky blacks, blown speculars, grain that will
  not settle. Nothing softened, nothing staged. The chrome should feel the same.

**Voice & tone (copywriting)**

- Interface labels are terse and lowercase (`work`, `cv`, `contact`).
- Project titles are loud and uppercase (`BLEED LIKE ME`).
- Descriptive copy is spare, sensory, and unsentimental — short declarative
  sentences, concrete nouns, no press-release register. Avoid "visceral",
  "powerful", "stunning", and any sentence that praises the work rather than
  describing it.
- Plate captions are one sentence, sentence case, present tense.
- No italics in the UI; italics belong only inside editorial prose.

---

## 2. Color palette

A monochrome, near-black system. No accent hue — the black-and-white photography
is the only color in the experience. Defined in `src/styles/global.css` `:root`
and exposed to Tailwind through `@theme`.

| Token                | Role                                             | Value     |
| -------------------- | ------------------------------------------------ | --------- |
| `--background`       | Page background                                  | `#0a0a0a` |
| `--foreground`       | Body text                                        | `#e5e5e5` |
| `--primary`          | Wordmark, headings, active nav                   | `#e5e5e5` |
| `--primary-foreground` | Text on an inverted surface (button hover)     | `#0a0a0a` |
| `--secondary`        | Meta, labels, years, inactive nav, footer        | `#737373` |
| `--muted`            | Reserved; currently unused                       | `#1a1a1a` |
| `--muted-foreground` | Descriptions and prose                           | `#737373` |
| `--border`           | Hairlines, tag chips, image frames               | `#262626` |
| `--radius`           | Corner radius — always zero                      | `0`       |

**Rules**

- Backgrounds stay near-black everywhere; never introduce a lighter surface or
  panel color. Depth comes from the photographs, not from UI elevation.
- Off-white, not pure white, for foreground text — keeps the page feeling like a
  print, not a screen.
- No saturated color anywhere in the chrome, including state and link colors.
- `#737373` on `#0a0a0a` is roughly 4.7:1 — it clears WCAG AA for body text, but
  do not darken it further.

---

## 3. Typography

A single family in two roles: **Zalando Sans Expanded**, loaded from Google
Fonts, falling back to Arial. Weights 400/500/600/700.

Headings are styled once, in `@layer base`, and pages do not repeat the
treatment: `h1`–`h3` are uppercase, `0.15em` tracking, `--primary`.

| Role         | Element / usage                    | Treatment                                    |
| ------------ | ---------------------------------- | -------------------------------------------- |
| **Wordmark** | `SONDERNISTA` in header            | Uppercase, 600, `0.2em` tracking, `text-lg`  |
| **Display**  | `h1` — page and project titles     | Uppercase, 600, `2.25rem` → `4rem` at `md`   |
| **Section**  | `h2` — project titles in lists     | Uppercase, 600, `2rem` → `2.5rem` at `md`    |
| **Nav / labels / tags** | Nav, tag chips, footer  | Uppercase, small, `0.15em` tracking          |
| **Meta**     | Years, plate numbers, CV columns   | Uppercase, `--secondary`, `0.2`–`0.25em`     |
| **Body**     | Descriptions, About prose          | Sentence case, `--muted-foreground`, 1.5     |
| **Technical**| Plate technical line, camera recipe| `font-mono`, `text-xs`, `--secondary`        |

**Rules**

- Uppercase + letter-spacing is the signature of all UI text. Body and caption
  copy is the only sentence-case text.
- **Never write bare element rules outside `@layer base`.** Unlayered CSS
  outranks Tailwind's layered utilities, so a stray `h2 { font-size }` at the top
  level silently defeats every `text-*` class in the codebase.
- Override a heading's size with a utility only where it genuinely deviates —
  e.g. the small tracked section labels on `/cv`.

---

## 4. Layout & grid

Single-column, vertically stacked, image-led. The page reads like scrolling
through a portfolio print set.

**Rules**

- **Content column** is `max-w-[1400px]`, centered, `px-8`. `/work` is narrower
  at `max-w-[1200px]`, `px-6`.
- **Vertical rhythm** is generous: `gap-20` between projects and between gallery
  plates, `gap-28` at `md` and up. Only one image should live on screen at once.
- **Header** is fixed, `py-8`, hairline bottom border, wordmark left and nav
  right, matching the content margins. Below `md` (768px) the nav collapses to a
  hamburger toggle.
- **Footer** mirrors the header: copyright left, `about` and `contact` right, in
  `--secondary`.
- **Caption block** below each work card is a two-column split: title, year, and
  tags on the left; description on the right, top-aligned. It stacks on narrow
  viewports.

---

## 5. Imagery / photo treatment

The photography is the entire product. Everything else is a frame.

**Rules**

- **Black & white only.** Preserve grain and full tonal range — deep blacks,
  bright highlights.
- **Large and dominant.** Images span the full content column; never thumbnailed.
- **Never crop to a uniform ratio in the plate gallery.** The gallery is where
  the work is actually read, so respect each frame's native ratio there:
  `object-contain` with a height cap, never `object-cover` with a fixed
  `aspect-[…]`. The work mixes 2:3 portrait, panoramic film, and everything
  between; a rigid grid destroys it.
- **The home hero and the work cards are navigation, not presentation.** They
  may crop to fill their box, and should — dead letterboxing around a portrait
  frame reads as broken, not as restraint. The hero is full-bleed `object-cover`;
  work cards are a uniform `aspect-[3/2]` crop.
- **No filters, overlays, rounded corners, or shadows.** Gallery frames carry a
  single `--border` hairline and nothing else.
- **Size frames with `height={LONG_EDGE}`**, never a hand-computed `width`.
  Frames render `object-contain` under a viewport-height cap, so height is the
  binding constraint; capping the long edge lets Astro derive each frame's width
  from its own ratio. Reading `image.width` in frontmatter to do that maths
  yourself defeats Vite's tree-shaking and dumps every full-resolution original
  into `dist/`.
- **Alt text** comes from the plate caption when there is one, and is otherwise
  `<TITLE> — plate N`.

**Project metadata model** (`src/data/projects.ts`)

- `title` — uppercase display · `year` — when the work was made, e.g. `2025-26`
- `description` — one or two sentences for the work card
- `longDescription` — the project-page statement, as an array of paragraphs
- `tags` — a deliberately small controlled vocabulary, rendered as outlined
  chips. Current set: `suspension`, `street`, `architecture`, `monochrome`,
  `film`, `digital`. Do not let it proliferate.
- `link` — optional `{ label, href }`, rendered under the statement as a quiet
  underlined external link. For an exhibition or publication page.
- `recipe` — optional; only for single-camera projects. A project shot across
  several bodies leaves this off and lets the plates carry the detail.

**Plate metadata model** — per-frame, keyed by filename, all fields optional:
`caption`, `place`, `stock`, `camera`, `lens`, `exposure`. Rendered by
`PlateLabel.astro` beneath each frame as a hairline-ruled block: the caption and
place on one line, then the technical line prefixed with the frame's index.

```
Hooks set. Second suspension of the night.          TORONTO, ON
#02 · ISO 800 · FUJIFILM X-T2 · XF 10-24MM F4 @ 12MM · 1/250 f/4
```

Every frame gets a label, because every frame has an index — a frame with no
other metadata shows `#02` alone. Pull what you can from EXIF; `place` and
`caption` are never in EXIF and must be supplied. Dates are deliberately not
shown.

**Gallery order** is the order the frames are written in that metadata block.
Anything not listed there follows, alphabetically. Reordering the block
reorders the gallery and renumbers the plates — no file renaming required.

**Tag chip:** rectangular (no radius), thin `--border` outline, transparent
fill, uppercase `--secondary` label, small letter-spaced text, snug padding.

---

## 6. Navigation & interaction

**Global nav** — **work · cv · contact**, top-right. Active section renders in
`--primary`, inactive in `--secondary`. The wordmark links home. The footer
carries the secondary links, **about · contact**.

**Page types**

- **Home** — the first entry in `projects[]`, full-bleed, with its title and year.
- **Work** — stacked project list.
- **Project detail** — `/work/<slug>`; statement, tags, then the plate gallery.
- **CV** — exhibitions, assignments, and publications as ruled sections. No
  images. Empty sections hide themselves. `/assignments` redirects here.
- **About** — the practice statement.
- **Contact** — a form, posting to Formspree.

**Interaction principles**

- Keep interactions minimal and quiet: a shift toward `--primary`, or
  `opacity-60`, on hover. Nothing bouncy, nothing fast.
- Transitions are opacity and color only, at Tailwind's default timing. Avoid
  parallax, autoplay, carousels, and attention-grabbing animation.
- **No modals, tooltips, or popovers.**
- No social embeds, share buttons, or Open Graph cards — the practice keeps no
  social accounts, and the pages carry only a description and a canonical link.

---

## 7. Do / Don't quick reference

**Do**

- Let photographs dominate; keep chrome dark, small, quiet.
- Use uppercase + letter-spacing for all UI labels.
- Keep the palette strictly near-black + off-white + muted gray.
- Write spare, concrete, unsentimental copy.
- Say where and when and on what. The metadata is the documentary claim.

**Don't**

- Add color, gradients, rounded cards, shadows, or illustration.
- Crop images to a uniform ratio or thumbnail them on main views.
- Write bare element selectors outside `@layer base`.
- Introduce loud motion, carousels, autoplay, or social chrome.
- Let the tag vocabulary or the nav sprawl.

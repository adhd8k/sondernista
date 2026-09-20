# SONDERNISTA — Design specification

SONDERNISTA is a documentary photography portfolio by Jonathon W. Marshall.
The photographs are the interface: the surrounding chrome is quiet, direct, and
functional.

## Voice

- Brand and series titles are uppercase: `SONDERNISTA`, `BLEED LIKE ME`.
- Navigation and labels are terse and uppercase.
- Descriptions are spare, concrete, and unsentimental.
- No emoji or pictographic symbols in copy. Use words for actions.

## Visual system

- Near-white paper background: `#f7f7f5`.
- Near-black text: `#161616`.
- Muted metadata: `#555` to `#666`.
- Hairline rules define sections; no gradients, shadows, or rounded corners.
- Arial/Helvetica and monospace metadata keep the interface plain and archival.

## Layout

- The header contains the wordmark and links to Work, About, and CV.
- The masthead gives the practice, location, medium, and edition.
- Work is presented as numbered series with a ruled heading, location, short
  description, and a masonry-style photograph column.
- Photographs retain their native ratio and are large enough to read while
  remaining responsive on small screens.
- About, CV, and Contact follow the work in the same single-page document.
- Footer provides copyright and a text-only return link.

## Interaction and accessibility

- Photograph buttons open a full-screen native dialog with previous/next controls.
- The viewer supports keyboard arrows, touch swipes, focus restoration, and an
  explicit close control.
- Links and controls have visible focus states.
- Reduced-motion preferences disable transitions and smooth scrolling.
- Images have descriptive alt text; lazy loading is used after the first frames.

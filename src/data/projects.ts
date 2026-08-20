import type { ImageMetadata } from 'astro'
import type { Recipe } from '../components/CameraRecipe.astro'

/**
 * Per-frame documentary metadata, keyed by filename in `galleryFrom`.
 * Every field is optional — a frame with none renders bare, as before.
 */
export interface PlateMeta {
  /** One sentence, sentence case. Doubles as the image's alt text. */
  caption?: string
  /** Where it was made, e.g. 'Toronto, ON'. */
  place?: string
  /** Film stock and rating, or sensor equivalent, e.g. 'ILFORD HP5+ @ EI 1600'. */
  stock?: string
  camera?: string
  lens?: string
  /** Shutter and aperture, e.g. '1/60 f/2.8'. */
  exposure?: string
}

/** A gallery frame: the built image plus whatever metadata is known about it. */
export interface Plate extends PlateMeta {
  image: ImageMetadata
  /** Filename relative to the project's image directory — the metadata key. */
  file: string
}

interface ProjectText {
  slug: string
  title: string
  year: string
  description: string
  longDescription: string[]
  recipe?: Recipe
  tags?: string[]
  /** Optional external reference — an exhibition page, a publication. */
  link?: { label: string; href: string }
}

/** A project shown on the site. Everything in `projects` renders. */
export interface Project extends ProjectText {
  image: ImageMetadata
  gallery: Plate[]
}

/**
 * Retired work. The writing is kept here and the frames are kept on disk, but
 * `imageDir` is excluded from the image glob below, so not one byte of it is
 * built or deployed. To bring a project back: delete its exclusion from
 * `EXCLUDED_IMAGE_DIRS`, then move the entry into `projects` with `image` and
 * `gallery` restored.
 */
export interface ArchivedProject extends ProjectText {
  /** Where the frames still live, relative to src/assets/images/. */
  imageDir: string
}

/**
 * Directories under src/assets/images/ that no live entry references.
 *
 * The glob below is eager, so anything it matches is bundled and deployed even
 * if nothing renders it. These three held ~690MB of originals. Excluding them
 * keeps the files on disk and out of `dist/`.
 */
const EXCLUDED_IMAGE_DIRS = [
  'work/2014-2016-street', // archived — see archivedProjects
  'work/2017-capital', // archived — see archivedProjects
  'work/2022-klakstein', // archived — see archivedProjects
  'dsc-2026', // archived — an older project, not currently shown
  'assignments', // the CV is text-only, so these frames are not built
]

const images = import.meta.glob<{ default: ImageMetadata }>(
  [
    '../assets/images/**/*.{jpg,jpeg,png,webp,avif,tiff}',
    '!../assets/images/work/2014-2016-street/**',
    '!../assets/images/work/2017-capital/**',
    '!../assets/images/work/2022-klakstein/**',
    '!../assets/images/dsc-2026/**',
    '!../assets/images/assignments/**',
  ],
  { eager: true }
)

/**
 * Get an image by its path relative to src/assets/images/
 * e.g. img('osc/hero.jpg') loads src/assets/images/osc/hero.jpg
 */
function img(path: string): ImageMetadata {
  const key = `../assets/images/${path}`
  const image = images[key]
  if (!image) {
    throw new Error(
      `Image not found: ${path}\nLooked for: ${key}\nAvailable: ${Object.keys(images).join(', ')}`
    )
  }
  return image.default
}

/**
 * Get all images from a subdirectory, sorted alphabetically, as plates.
 * e.g. galleryFrom('osc') loads all images in src/assets/images/osc/
 *
 * Pass a second argument to attach per-frame metadata, keyed by filename:
 *   galleryFrom('work/2026-bleed-like-me', {
 *     '04.jpg': { caption: 'Hooks set.', place: 'Toronto, ON' },
 *   })
 * Filenames with no entry simply carry no metadata.
 */
function galleryFrom(
  dir: string,
  plates: Record<string, PlateMeta> = {}
): Plate[] {
  const prefix = `../assets/images/${dir}/`
  const byFile = new Map(
    Object.entries(images)
      .filter(([key]) => key.startsWith(prefix))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, mod]) => [key.slice(prefix.length), mod] as const)
  )

  for (const file of Object.keys(plates)) {
    if (!byFile.has(file)) {
      throw new Error(
        `Plate metadata for a missing frame: ${dir}/${file}\n` +
        `Frames present: ${[...byFile.keys()].join(', ')}`
      )
    }
  }

  // The metadata block IS the running order — frames appear in the order they
  // are written there. Anything not listed follows, alphabetically. (Every
  // filename carries an extension, so no key is integer-like and JS preserves
  // the literal's insertion order.)
  const order = [
    ...Object.keys(plates),
    ...[...byFile.keys()].filter((file) => !Object.hasOwn(plates, file)),
  ]

  return order.map((file) => ({
    image: byFile.get(file)!.default,
    file,
    ...plates[file],
  }))
}

/**
 * The longest edge, in pixels, of any frame in a PLATE GALLERY.
 *
 * Gallery frames render `object-contain` under a viewport-height cap, so HEIGHT
 * is the binding constraint, not width. Capping the long edge stops a 1:2.7
 * panoramic from shipping several times the pixels it can ever display.
 *
 * The home hero and the work cards do NOT use this — they crop to fill with
 * `object-cover`, so their binding constraint is width and they pass a literal
 * `width` instead.
 * Nothing visible is lost — the browser was going to scale those rows away.
 *
 * Keep originals full-resolution on disk: they are the archive, they are
 * gitignored, and they are never deployed. This is the only cap that matters.
 *
 * Pass it as `<Image height={LONG_EDGE}>`: Astro derives the width from the
 * frame's own ratio. Do NOT compute the width yourself from `image.width` —
 * reading those properties in frontmatter defeats Vite's tree-shaking and
 * emits every full-resolution original into `dist/`.
 */
export const LONG_EDGE = 1600

export const projects: Project[] = [
  {
    slug: 'bleed-like-me-2026',
    image: img('work/bleed-like-me-2026/DSCF6540.jpg'),
    title: 'BLEED LIKE ME',
    year: '2026',
    description: 'The body as canvas and material — connection, joy, ecstasy, altered states. Twelve artists at 465 Collective, San Francisco.',
    longDescription: [
      'BLEED LIKE ME gathers photography, performance, installation, and video from twelve practitioners working with the body as canvas and material. For centuries people have used the body to create and to share: to build, hold, shape, dance, adorn and revere; to shed grief, hold joy, express affection, and be in community. Curated by Lindsey Kincaid, produced by Queerly Complex. 465 Collective, San Francisco, 5—26 September 2026.',
      'These six frames were collected from the Ontario and Denver Suspension Conventions. Made on 35mm film and digital',
    ],
    // Metadata below is read from each file's EXIF. Places and captions are not
    // in EXIF and still need to be supplied.
    gallery: galleryFrom('work/bleed-like-me-2026', {
      '005022680012.jpg': {
        stock: 'ILFORD HP5+ @ EI 1600',
        camera: 'HASSELBLAD XPAN',
        exposure: '1/100',
      },
      'DSCF6540.jpg': {
        camera: 'FUJIFILM X-T2',
        lens: 'XF 10-24MM F4 @ 12MM',
        stock: 'ISO 800',
        exposure: '1/250 f/4',
      },
      'SDIM3289.jpg': {
        camera: 'SIGMA FP L',
        // Adapted manual lens: the body records no aperture, so this is the
        // photographer's recollection rather than EXIF.
        lens: 'CARL ZEISS 85MM ZF-IR',
        stock: 'ISO 800',
        exposure: '1/125',
      },
      'DSCF7155.jpg': {
        camera: 'FUJIFILM X-T2',
        lens: 'XF 10-24MM F4 @ 24MM',
        stock: 'ISO 800',
        exposure: '1/250 f/4',
      },
      'SDIM2983.jpg': {
        camera: 'SIGMA FP L',
        // Adapted manual lens: the body records no aperture, so this is the
        // photographer's recollection rather than EXIF.
        lens: 'CARL ZEISS 85MM ZF-IR',
        stock: 'ISO 800',
        exposure: '1/100',
      },
      'SDIM3103.jpg': {
        camera: 'SIGMA FP L',
        // Adapted manual lens: the body records no aperture, so this is the
        // photographer's recollection rather than EXIF.
        lens: 'CARL ZEISS 85MM ZF-IR',
        stock: 'ISO 800',
        exposure: '1/160',
      },
    }),
    tags: ['suspension', 'monochrome', 'film', 'digital'],
    link: {
      label: 'Exhibition page',
      href: 'https://www.queerlycomplex.com/bleed2026',
    },
    // No `recipe`: the frames span three cameras, so the technical detail lives
    // on each plate label instead.
  },
]

/**
 * Retired work — rendered nowhere. See `ArchivedProject` above.
 */
export const archivedProjects: ArchivedProject[] = [
  {
    slug: 'klakstein',
    imageDir: 'work/2022-klakstein',
    title: 'KLAKSTEIN',
    year: '2022',
    description: "Angular facades and shifting planes in Vienna's university district. Architecture rendered as tone, weight, and void.",
    longDescription: [
      'Vienna, Christmas 2022. Stone and glass folding against grey sky. Acros film simulation through a red filter, grain pushed until the surfaces hum.',
    ],
    tags: ['architecture', 'monochrome', 'digital'],
    recipe: {
      camera: 'FUJIFILM X-T2',
      simulation: 'ACROS +R',
      settings: [
        'Grain Strong',
        'NR -4',
        'Highlight +1',
        'Shadow +3',
        'Sharpness +2',
        'WB Daylight',
        'R -3',
        'B -6',
      ],
    },
  },
  {
    slug: 'early-street',
    imageDir: 'work/2014-2016-street',
    title: 'EARLY STREET',
    year: '2014-16',
    description: 'Toronto streets. Learning to see in public. Shooting from the hip, finding rhythm with strangers.',
    longDescription: [
      'Before the practice had a name, there was just the impulse to look. These images trace the first years of carrying a camera through Toronto. Shooting loose, often from the hip, chasing light and gesture without fully understanding why.',
    ],
    tags: ['street', 'monochrome', 'digital'],
    recipe: {
      camera: 'FUJIFILM X-T1',
      simulation: 'MONOCHROME',
      settings: [],
    },
  },
]

// ── Curriculum vitae ─────────────────────────────────────────
//
// The /cv page renders these three lists as ruled sections, newest first.
// Entries are plain records: no images are shown, per DESIGN.md §5.

export interface CVEntry {
  /** Display year or span, e.g. '2026' or '2021—'. An empty string renders no year. */
  year: string
  /** Uppercase display name: client, exhibition title, or publication. */
  title: string
  /** Expanded name, sentence case, e.g. 'Denver Suspension Collective'. */
  subtitle?: string
  /** Nature of the engagement, e.g. 'Documentation', 'Solo', 'Feature'. */
  role?: string
  /** Where it happened — venue and city, for exhibitions. */
  venue?: string
  /** Current state, e.g. 'on assignment', 'upcoming'. */
  status?: string
  link?: string
}

export const exhibitions: CVEntry[] = [
  {
    year: '2026',
    title: 'BLEED LIKE ME',
    subtitle: 'Curated by Lindsey Kincaid',
    venue: '465 Collective, San Francisco · 5—26 September',
    role: 'Group exhibition',
    status: 'upcoming',
    link: 'https://www.queerlycomplex.com/bleed2026',
  },
]

export const assignments: CVEntry[] = [
  {
    year: '2002—PRESENT',
    title: 'BME',
    subtitle: 'Body Modification Ezine',
    role: 'Editorial & Reportage',
    status: 'Project Director',
    link: 'https://www.bme.com/',
  },
  {
    year: '2025—PRESENT',
    title: 'OSC',
    subtitle: 'Ontario Suspension Collective',
    role: 'Documentation',
    status: 'Event Photographer',
    link: 'https://www.onhooks.com/',
  },
  {
    year: '2026',
    title: 'DSC',
    subtitle: 'Denver Suspension Collective',
    role: 'Documentation',
    status: 'Event Photographer',
    link: 'https://www.denversuspension.com/',
  },
  {
    year: '2026',
    title: "BOOTS N' HOOKS",
    subtitle: 'Private indoor/outdoor suspension events',
    role: 'Documentation',
    status: 'Event Photographer',
  },
]

export const publications: CVEntry[] = [
  // TODO: features, interviews, or print credits. Section hides itself if empty.
]

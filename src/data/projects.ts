import type { ImageMetadata } from 'astro'
import type { Recipe } from '../components/CameraRecipe.astro'

export interface Project {
  slug: string
  image: ImageMetadata
  title: string
  year: string
  description: string
  longDescription: string
  gallery: ImageMetadata[]
  recipe?: Recipe
}

// Helper to load all images from assets
const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif,tiff}',
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
 * Get all images from a subdirectory, sorted alphabetically.
 * e.g. galleryFrom('osc') loads all images in src/assets/images/osc/
 */
function galleryFrom(dir: string): ImageMetadata[] {
  const prefix = `../assets/images/${dir}/`
  return Object.entries(images)
    .filter(([key]) => key.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default)
}

export const projects: Project[] = [
  {
    slug: "2022-klakstein",
    image: img('2022-klakstein/05.jpg'),
    title: "KLAKSTEIN",
    year: "2022",
    description: "Angular facades and shifting planes in Vienna's university district. Architecture rendered as tone, weight, and void.",
    longDescription: "Vienna, Christmas 2022. Stone and glass folding against grey sky. Acros film simulation through a red filter, grain pushed until the surfaces hum.",
    gallery: galleryFrom('2022-klakstein'),
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
  //  {
  //    slug: "hollow-spaces",
  //    image: img('hollow-spaces/cover.jpg'),
  //    title: "Hollow Spaces",
  //    year: "2025",
  //    description: "An exploration of abandoned industrial architecture and the poetry found in decay. Light transforms emptiness into something sacred.",
  //    longDescription: "This ongoing series documents the quiet beauty of abandoned industrial spaces across the American Midwest. Each location tells a story of human ambition, labor, and eventual departure. Through careful observation of light and shadow, these photographs seek to honor the dignity of forgotten places.",
  //    gallery: galleryFrom('hollow-spaces'),
  //  },
  //  {
  //    slug: "solitude",
  //    image: img('solitude/cover.jpg'),
  //    title: "Solitude",
  //    year: "2024",
  //    description: "Landscapes that speak to isolation and quiet contemplation. Finding beauty in the space between presence and absence.",
  //    longDescription: "Solitude is a meditation on the emotional landscape of isolation. Shot over the course of a year in remote locations, these images explore the profound stillness found in nature when human presence recedes. The work invites viewers to sit with silence.",
  //    gallery: galleryFrom('solitude'),
  //  },
  //  {
  //    slug: "concrete-dreams",
  //    image: img('concrete-dreams/cover.jpg'),
  //    title: "Concrete Dreams",
  //    year: "2024",
  //    description: "Brutalist architecture through the lens of shadow and form. Geometric meditations on urban structures.",
  //    longDescription: "Concrete Dreams examines the bold geometries of brutalist architecture. These monolithic structures, often maligned, reveal an unexpected poetry when observed through the interplay of light and shadow. The series celebrates the uncompromising vision of mid-century architects.",
  //    gallery: galleryFrom('concrete-dreams'),
  //  },
  //  {
  //    slug: "tidal",
  //    image: img('tidal/cover.jpg'),
  //    title: "Tidal",
  //    year: "2023",
  //    description: "Long exposure seascapes capturing the eternal conversation between water and stone. Time made visible.",
  //    longDescription: "Tidal captures the endless dialogue between ocean and shore. Using extended exposures, the turbulent motion of water transforms into silk, revealing the patience of stone. These images speak to permanence and change, the eternal rhythm of the natural world.",
  //    gallery: galleryFrom('tidal'),
  //  },
  //  {
  //    slug: "obscured",
  //    image: img('obscured/cover.jpg'),
  //    title: "Obscured",
  //    year: "2023",
  //    description: "Figure studies through frosted glass and translucent barriers. The human form abstracted and reimagined.",
  //    longDescription: "Obscured explores the tension between visibility and concealment. Through frosted glass and translucent barriers, the human form becomes abstracted, inviting viewers to project their own narratives onto ambiguous shapes. The work questions how we see and are seen.",
  //    gallery: galleryFrom('obscured'),
  //  },
  //  {
  //    slug: "objects-in-repose",
  //    image: img('objects-in-repose/cover.jpg'),
  //    title: "Objects in Repose",
  //    year: "2022",
  //    description: "Still life compositions exploring the dramatic interplay of light and shadow on everyday forms.",
  //    longDescription: "Objects in Repose returns to the classical tradition of still life, finding drama in the ordinary. Simple objects—vessels, spheres, geometric forms—become stages for the theater of light. The series is an exercise in seeing the extraordinary within the mundane.",
  //    gallery: galleryFrom('objects-in-repose'),
  //  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

// ── Assignments ──────────────────────────────────────────────

export interface Assignment {
  client: string
  subtitle: string
  image: ImageMetadata
  type: string
  status: 'on assignment' | 'coming soon'
}

export const assignments: Assignment[] = [
  {
    client: 'OSC',
    subtitle: 'Ontario Suspension Collective',
    image: img('assignments/assignment-osc.jpg'),
    type: 'Documentation',
    status: 'on assignment',
  },
  {
    client: 'BME',
    subtitle: 'Body Modification Ezine',
    image: img('assignments/assignment-bme.jpg'),
    type: 'Editorial',
    status: 'on assignment',
  },
  {
    client: 'PATINA',
    subtitle: 'Texture & Time',
    image: img('assignments/assignment-patina.jpg'),
    type: 'Aesthetic',
    status: 'coming soon',
  },
  {
    client: 'IR',
    subtitle: 'Infrared Studies',
    image: img('assignments/assignment-ir.jpg'),
    type: 'Exploration',
    status: 'coming soon',
  },
]

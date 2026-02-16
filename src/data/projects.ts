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
  tags?: string[]
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
    slug: "klakstein",
    image: img('work/2022-klakstein/05.jpg'),
    title: "KLAKSTEIN",
    year: "2022",
    description: "Angular facades and shifting planes in Vienna's university district. Architecture rendered as tone, weight, and void.",
    longDescription: "Vienna, Christmas 2022. Stone and glass folding against grey sky. Acros film simulation through a red filter, grain pushed until the surfaces hum.",
    gallery: galleryFrom('work/2022-klakstein'),
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
    slug: "early-street",
    image: img('work/2014-2016-street/01.jpg'),
    title: "EARLY STREET",
    year: "2014-16",
    description: "Toronto streets. Learning to see in public. Shooting from the hip, finding rhythm with strangers.",
    longDescription: "Before the practice had a name, there was just the impulse to look. These images trace the first years of carrying a camera through Toronto. Shooting loose, often from the hip, chasing light and gesture without fully understanding why.",
    gallery: galleryFrom('work/2014-2016-street'),
    tags: ['street', 'monochrome', 'digital'],
    recipe: {
      camera: 'FUJIFILM X-T1',
      simulation: 'MONOCHROME',
      settings: []
    },
  },
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
    client: 'BME',
    subtitle: 'Body Modification Ezine',
    image: img('assignments/assignment-ir.jpg'),
    type: 'Editorial',
    status: 'on assignment',
  },
  {
    client: 'OSC',
    subtitle: 'Ontario Suspension Collective',
    image: img('assignments/assignment-patina.jpg'),
    type: 'Documentation',
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

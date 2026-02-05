export interface Project {
  slug: string
  image: string
  title: string
  year: string
  description: string
  longDescription: string
  gallery: string[]
}

export const projects: Project[] = [
  {
    slug: "hollow-spaces",
    image: "/images/project-1.jpg",
    title: "Hollow Spaces",
    year: "2025",
    description: "An exploration of abandoned industrial architecture and the poetry found in decay. Light transforms emptiness into something sacred.",
    longDescription: "This ongoing series documents the quiet beauty of abandoned industrial spaces across the American Midwest. Each location tells a story of human ambition, labor, and eventual departure. Through careful observation of light and shadow, these photographs seek to honor the dignity of forgotten places.",
    gallery: [
      "/images/project-1.jpg",
      "/images/project-1-2.jpg",
      "/images/project-1-3.jpg",
    ],
  },
  {
    slug: "solitude",
    image: "/images/project-2.jpg",
    title: "Solitude",
    year: "2024",
    description: "Landscapes that speak to isolation and quiet contemplation. Finding beauty in the space between presence and absence.",
    longDescription: "Solitude is a meditation on the emotional landscape of isolation. Shot over the course of a year in remote locations, these images explore the profound stillness found in nature when human presence recedes. The work invites viewers to sit with silence.",
    gallery: [
      "/images/project-2.jpg",
      "/images/project-2-2.jpg",
      "/images/project-2-3.jpg",
    ],
  },
  {
    slug: "concrete-dreams",
    image: "/images/project-3.jpg",
    title: "Concrete Dreams",
    year: "2024",
    description: "Brutalist architecture through the lens of shadow and form. Geometric meditations on urban structures.",
    longDescription: "Concrete Dreams examines the bold geometries of brutalist architecture. These monolithic structures, often maligned, reveal an unexpected poetry when observed through the interplay of light and shadow. The series celebrates the uncompromising vision of mid-century architects.",
    gallery: [
      "/images/project-3.jpg",
      "/images/project-3-2.jpg",
      "/images/project-3-3.jpg",
    ],
  },
  {
    slug: "tidal",
    image: "/images/project-4.jpg",
    title: "Tidal",
    year: "2023",
    description: "Long exposure seascapes capturing the eternal conversation between water and stone. Time made visible.",
    longDescription: "Tidal captures the endless dialogue between ocean and shore. Using extended exposures, the turbulent motion of water transforms into silk, revealing the patience of stone. These images speak to permanence and change, the eternal rhythm of the natural world.",
    gallery: [
      "/images/project-4.jpg",
      "/images/project-4-2.jpg",
      "/images/project-4-3.jpg",
    ],
  },
  {
    slug: "obscured",
    image: "/images/project-5.jpg",
    title: "Obscured",
    year: "2023",
    description: "Figure studies through frosted glass and translucent barriers. The human form abstracted and reimagined.",
    longDescription: "Obscured explores the tension between visibility and concealment. Through frosted glass and translucent barriers, the human form becomes abstracted, inviting viewers to project their own narratives onto ambiguous shapes. The work questions how we see and are seen.",
    gallery: [
      "/images/project-5.jpg",
      "/images/project-5-2.jpg",
      "/images/project-5-3.jpg",
    ],
  },
  {
    slug: "objects-in-repose",
    image: "/images/project-6.jpg",
    title: "Objects in Repose",
    year: "2022",
    description: "Still life compositions exploring the dramatic interplay of light and shadow on everyday forms.",
    longDescription: "Objects in Repose returns to the classical tradition of still life, finding drama in the ordinary. Simple objects—vessels, spheres, geometric forms—become stages for the theater of light. The series is an exercise in seeing the extraordinary within the mundane.",
    gallery: [
      "/images/project-6.jpg",
      "/images/project-6-2.jpg",
      "/images/project-6-3.jpg",
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

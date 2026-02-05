import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectBySlug, projects } from "@/lib/projects"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-secondary text-xs uppercase tracking-widest hover:text-primary transition-colors mb-12 border border-border px-4 py-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Work
        </Link>

        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary uppercase tracking-widest mb-2">
            {project.title}
          </h1>
          <span className="text-secondary text-xs uppercase tracking-widest">{project.year}</span>
          <p className="text-secondary text-sm mt-6 max-w-2xl leading-relaxed">
            {project.longDescription}
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {project.gallery.map((image, index) => (
            <div key={index} className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${project.title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

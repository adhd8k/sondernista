import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  slug: string
  image: string
  title: string
  year: string
  description: string
}

export function ProjectCard({ slug, image, title, year, description }: ProjectCardProps) {
  return (
    <Link href={`/work/${slug}`}>
      <article className="group cursor-pointer">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-80"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <h3 className="text-primary font-bold text-sm uppercase tracking-widest">{title}</h3>
          <span className="text-secondary text-xs uppercase tracking-widest">{year}</span>
          <p className="text-secondary text-xs mt-3 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </article>
    </Link>
  )
}

import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/projects"

export default function WorkPage() {
  return (
    <div className="pt-24">
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col gap-20 md:gap-28">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                image={project.image}
                title={project.title}
                year={project.year}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Assignments — Sondernista",
  description: "New projects and collaborations by Sondernista",
}

const assignments = [
  {
    title: "Vogue Italia",
    type: "Editorial",
    date: "February 2026",
    description: "A six-page editorial exploring themes of solitude and urban isolation in Milan's modernist architecture.",
    image: "/images/assignment-vogue.jpg",
  },
  {
    title: "Leica Camera AG",
    type: "Campaign",
    date: "January 2026",
    description: "Global brand campaign celebrating the art of monochrome photography with the new M11 Monochrom.",
    image: "/images/assignment-leica.jpg",
  },
  {
    title: "The New York Times Magazine",
    type: "Feature",
    date: "December 2025",
    description: "Visual essay documenting the disappearing industrial landscapes of the American Midwest.",
    image: "/images/assignment-nytimes.jpg",
  },
  {
    title: "Acne Studios",
    type: "Collaboration",
    date: "November 2025",
    description: "Limited edition print series and exhibition at the Stockholm flagship store.",
    image: "/images/assignment-acne.jpg",
  },
]

export default function AssignmentsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1000px] mx-auto px-6">
        <h1 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">Assignments</h1>
        <p className="text-secondary text-sm mb-16 max-w-[600px] border-b border-border pb-8">
          Selected commercial and editorial projects. For inquiries regarding new assignments, please get in touch.
        </p>

        <div className="space-y-1">
          {assignments.map((assignment, index) => (
            <article key={index} className="relative overflow-hidden aspect-[16/7]">
              <Image
                src={assignment.image || "/placeholder.svg"}
                alt={assignment.title}
                fill
                className="object-cover blur-sm brightness-[0.25] grayscale"
                sizes="(max-width: 1000px) 100vw, 1000px"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 border border-border">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <span className="text-primary/60 text-xs uppercase tracking-widest mb-2 block">
                      {assignment.type} — {assignment.date}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-primary mb-3 uppercase tracking-widest">
                      {assignment.title}
                    </h2>
                    <p className="text-primary/70 leading-relaxed max-w-[500px] text-xs">
                      {assignment.description}
                    </p>
                  </div>
                  <span className="text-primary/40 text-xs uppercase tracking-widest whitespace-nowrap border border-border px-3 py-2">
                    Coming Soon
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

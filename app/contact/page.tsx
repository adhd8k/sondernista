import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — Sondernista",
  description: "Get in touch with Sondernista for inquiries, collaborations, or print purchases.",
}

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-[80vh] flex items-center justify-center">
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <a 
            href="mailto:hello@sondernista.com"
            className="text-primary text-lg md:text-xl font-bold uppercase tracking-widest hover:opacity-60 transition-opacity border border-border px-8 py-4 inline-block"
          >
            hello@sondernista.com
          </a>
          <p className="text-secondary text-xs uppercase tracking-widest mt-8">
            Berlin, Germany
          </p>
        </div>
      </section>
    </div>
  )
}

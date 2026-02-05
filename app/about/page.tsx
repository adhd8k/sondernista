import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — Sondernista",
  description: "Learn about Sondernista, a fine art photographer exploring light, form, and the poetry of the everyday.",
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-12">
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Portrait */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/portrait.jpg"
                alt="Portrait of the photographer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-8">
              <h1 className="text-primary text-xl font-bold uppercase tracking-widest">
                Sondernista
              </h1>
              
              <div className="flex flex-col gap-6 text-secondary text-sm leading-relaxed">
                <p>
                  I am a fine art photographer based in Berlin, working primarily in black and white. My practice centers on finding the extraordinary within the mundane—the way light falls through a cracked window, the geometry of urban decay, the stillness of landscapes at dawn.
                </p>
                <p>
                  For over fifteen years, I have been documenting spaces and moments that exist on the threshold between presence and absence. My work is influenced by the brutalist movement, Japanese wabi-sabi philosophy, and the meditative quality of long-exposure photography. I believe that limitation breeds creativity, and I often return to the same locations across seasons and years, watching how time transforms what we see.
                </p>
                <p>
                  My photographs have been exhibited in galleries across Europe and are held in several private collections. I shoot exclusively on medium and large format film, developing and printing all work by hand in my darkroom studio.
                </p>
              </div>

              <a 
                href="mailto:hello@sondernista.com"
                className="text-primary text-xs uppercase tracking-widest hover:opacity-60 transition-opacity mt-4 border border-border inline-block px-4 py-3 w-fit"
              >
                hello@sondernista.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

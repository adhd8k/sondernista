import Image from "next/image"

export default function HomePage() {
  return (
    <div className="h-screen w-full pt-[72px] bg-background/90">
      <div className="relative h-full w-full bg-background/90">
        <Image
          src="/images/hero.jpg"
          alt="Misty mountain range at dawn"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute bottom-8 left-8 bg-background/90 px-4 py-3">
          <p className="text-primary text-xs uppercase tracking-widest font-bold">
            Dawn Over The Range, 2025
          </p>
        </div>
      </div>
    </div>
  )
}

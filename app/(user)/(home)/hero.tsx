import Image from "next/image"

const HeroSection = () => {
  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh]">
      <Image
        src="/hero.png"
        alt="Hero Image"
        fill
        priority
        className="object-cover"
      />
    </section>
  )
}

export default HeroSection
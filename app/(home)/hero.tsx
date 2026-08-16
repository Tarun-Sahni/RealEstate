import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lightbulb, ReceiptIndianRupee, Store, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    icon: Store,
    title: "Find Your Dream Home",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Unlock Property Value",
  },
  {
    icon: Building2,
    title: "Effortless Property Management",
  },
  {
    icon: Lightbulb,
    title: "Smart Investments, Informed Decisions",
  },
]

const HeroSection = () => {
  return (
    <section className="relative w-full flex flex-col">
      <div className="w-full h-dvh min-h-125 flex flex-col justify-center items-center relative group overflow-hidden">
        <Image
          src="/hero.png"
          alt="Hero Image"
          fill
          priority
          className="object-cover absolute top-0 left-0 right-0 bottom-0 group-hover:scale-120 transition-transform duration-20000 ease-linear"
        />
        <div className="w-full h-full bg-black/40 absolute top-0 left-0 right-0 bottom-0 z-10"></div>
        <div className="flex flex-col gap-4 z-20 items-center px-4 sm:px-6">
          <h1 className="font-playfair text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold capitalize text-center text-wrap tracking-wide leading-tight">
            Discover Your<br />
            Dream Property with<br />
            <span className="text-yellow-500">
              Gurgaon Elite Estate
            </span>
          </h1>
          <p className="max-w-xs sm:max-w-sm font-inter text-white text-center tracking-widest text-sm md:text-base leading-relaxed">Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision</p>
          <Link href="/properties" className="bg-yellow-500 rounded-full px-6 sm:px-8 py-3 mt-4 text-lg tracking-wider">
            Browse Properties
          </Link>
        </div>
      </div>
      <div className="w-full border-y bg-muted/40 px-4 py-10 md:py-12">
        <div className="container mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {features.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="flex w-full flex-col items-center gap-4 rounded-2xl border bg-card px-4 py-8 text-center shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/10">
                <Icon size={26} className="text-yellow-500" />
              </div>
              <p className="font-inter text-sm tracking-wide sm:text-base">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
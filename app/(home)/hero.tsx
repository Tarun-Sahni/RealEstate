import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, Lightbulb, ReceiptIndianRupee, Store, Building2 } from "lucide-react"
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
      <div className="w-full h-dvh min-h-125 flex flex-col justify-center items-center relative group overflow-hidden mb-2">
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
              Gurgoan Elite Estate
            </span>
          </h1>
          <p className="max-w-xs sm:max-w-sm font-inter text-white text-center tracking-widest text-sm md:text-base leading-relaxed">Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision</p>
          <Link href="/properties" className="bg-yellow-500 rounded px-6 sm:px-8 py-2 mt-4">
            Browse Properties
          </Link>
        </div>
      </div>
      <div className="w-full border-t-4 border-t-slate-500/50 border-b-4 border-b-slate-500/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {features.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="w-full bg-slate-500/20 rounded relative flex flex-col justify-center items-center gap-4 py-8 px-4"
          >
            <ArrowUpRight
              size={20}
              className="absolute top-4 right-4 text-slate-400"
            />
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-yellow-500 bg-yellow-500/20 inset-shadow-yellow-500 shadow-md flex justify-center items-center">
              <Icon size={24} color="#fff" />
            </div>
            <p className="tracking-wider text-center text-sm sm:text-base">{title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
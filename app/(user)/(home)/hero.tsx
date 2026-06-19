import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { House, MapPinHouse, ReceiptIndianRupee } from "lucide-react"
import Image from "next/image"

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen md:h-[90vh] flex flex-col gap-16">
      <div className="w-full h-full flex flex-col justify-center items-center relative">
        <Image
          src="/hero.png"
          alt="Hero Image"
          fill
          priority
          className="object-cover absolute top-0 left-0 right-0 bottom-0"
        />
        <div className="w-full h-full bg-black/40 absolute top-0 left-0 right-0 bottom-0 z-10"></div>
        <div className="flex flex-col gap-4 z-20 items-center px-4">
          <p className="font-playfair text-white text-xl md:text-2xl tracking-widest uppercase text-center">The Best Way to</p>
          <h1 className="font-playfair text-white text-4xl md:text-7xl font-bold capitalize text-center text-wrap tracking-wide">Find Your Dream Home</h1>
          <p className="max-w-sm font-inter text-white text-center tracking-widest text-sm md:text-base leading-relaxed">Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision</p>
        </div>
      </div>
      <div className="px-4 max-w-7xl w-full m-auto lg:absolute left-0 right-0 bottom-0 lg:translate-y-1/2 z-30">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8 lg:p-16 gap-4 bg-white dark:bg-black rounded-2xl shadow-2xl">
          <div className="bg-muted dark:bg-muted rounded-full h-12 w-full flex flex-row items-center px-4 gap-2">
            <Input
              placeholder="Property Type"
              className="border-none outline-none rounded-md bg-muted dark:bg-muted w-full focus:border-0 focus:outline-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <MapPinHouse size={22} color="#eab308" />
          </div>
          <div className="bg-muted dark:bg-muted rounded-full h-12 w-full flex flex-row items-center px-4 gap-2">
            <Input
              placeholder="Location"
              className="border-none outline-none rounded-md bg-muted dark:bg-muted w-full focus:border-0 focus:outline-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <House size={22} color="#eab308" />
          </div>
          <div className="bg-muted dark:bg-muted h-12 w-full flex flex-row items-center px-4 gap-2 rounded-full">
            <Input
              placeholder="Price Range"
              className="border-none outline-none rounded-md bg-muted dark:bg-muted w-full focus:border-0 focus:outline-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <ReceiptIndianRupee size={22} color="#eab308" />
          </div>
          <Button className="h-12 px-6 rounded-full tracking-widest bg-yellow-500 hover:bg-yellow-500/80 cursor-pointer text-black">
            Find
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
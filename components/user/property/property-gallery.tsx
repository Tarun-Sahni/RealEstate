"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  title: string
  images: string[]
}

const GalleryArrows = () => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <>
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous image"
        className="absolute top-1/2 left-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60 disabled:opacity-0"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next image"
        className="absolute top-1/2 right-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60 disabled:opacity-0"
      >
        <ChevronRight size={18} />
      </button>
    </>
  )
}

const PropertyGallery = ({ title, images }: PropertyGalleryProps) => {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const slides = images.length > 0 ? images : ["/placeholder.svg"]

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowRight") setSelected((s) => (s + 1) % slides.length)
      if (e.key === "ArrowLeft") setSelected((s) => (s - 1 + slides.length) % slides.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, slides.length])

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-muted">
        <Carousel
          className="h-full"
          opts={{ startIndex: selected, loop: true }}
          setApi={(api) => {
            if (!api) return
            api.on("select", () => setSelected(api.selectedScrollSnap()))
          }}
        >
          <CarouselContent className="ml-0 h-full">
            {slides.map((src, i) => (
              <CarouselItem key={i} className="relative h-full basis-full pl-0">
                <Image
                  src={src}
                  alt={`${title} - photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <GalleryArrows />
        </Carousel>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="View fullscreen"
          className="absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Expand size={14} />
          {selected + 1} / {slides.length}
        </button>
      </div>

      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all",
                selected === i ? "ring-yellow-500" : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => setSelected((s) => (s - 1 + slides.length) % slides.length)}
            aria-label="Previous image"
            className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl">
            <Image src={slides[selected]} alt={`${title} - photo ${selected + 1}`} fill sizes="90vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setSelected((s) => (s + 1) % slides.length)}
            aria-label="Next image"
            className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  )
}

export default PropertyGallery

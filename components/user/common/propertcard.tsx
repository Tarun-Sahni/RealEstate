"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Building2,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"

export interface PropertyCardProps {
  slug: string
  title: string
  coverImage?: string
  images?: string[]
  price: number
  priceLabel?: string
  city?: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  area?: { value?: number; unit?: string }
  listingType?: string
  propertyType?: string
  // isFeatured?: boolean
  className?: string
}

const formatPrice = (price: number) => {
  if (price >= 1_00_00_000) return `₹${(price / 1_00_00_000).toFixed(price % 1_00_00_000 === 0 ? 0 : 2)} Cr`
  if (price >= 1_00_000) return `₹${(price / 1_00_000).toFixed(price % 1_00_000 === 0 ? 0 : 2)} L`
  return `₹${price.toLocaleString("en-IN")}`
}

const CarouselArrows = () => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          scrollPrev()
        }}
        disabled={!canScrollPrev}
        aria-label="Previous image"
        className="absolute top-1/2 left-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 disabled:hidden"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          scrollNext()
        }}
        disabled={!canScrollNext}
        aria-label="Next image"
        className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 disabled:hidden"
      >
        <ChevronRight size={14} />
      </button>
    </>
  )
}

const CarouselDots = ({ count }: { count: number }) => {
  const { api } = useCarousel()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (count <= 1) return null

  return (
    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-200",
            i === selected ? "w-4 bg-yellow-500" : "w-1.5 bg-white/60"
          )}
        />
      ))}
    </div>
  )
}

const StatPill = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
    <Icon size={13} className="shrink-0 text-yellow-500" />
    {children}
  </span>
)

const PropertyCard = ({
  slug,
  title,
  coverImage,
  images,
  price,
  priceLabel,
  city,
  state,
  bedrooms,
  bathrooms,
  area,
  listingType,
  propertyType,
  // isFeatured,
  className,
}: PropertyCardProps) => {
  const [isSaved, setIsSaved] = useState(false)
  const location = [city, state].filter(Boolean).join(", ")
  const slides = images && images.length > 0 ? images : coverImage ? [coverImage] : []

  return (
    <Link
      href={`/properties/${slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl bg-card p-3 ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30",
        className
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
        {slides.length > 0 ? (
          <Carousel className="h-full" opts={{ loop: true }}>
            <CarouselContent className="ml-0 h-full">
              {slides.map((src, i) => (
                <CarouselItem key={i} className="relative h-full basis-full pl-0">
                  <Image
                    src={src}
                    alt={`${title} - photo ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {slides.length > 1 && (
              <>
                <CarouselArrows />
                <CarouselDots count={slides.length} />
              </>
            )}
          </Carousel>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            No Image Available
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {/* {isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-[11px] font-semibold text-black">
              <Star size={11} className="fill-black" />
              Featured
            </span>
          )} */}
          {listingType && (
            <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {listingType}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsSaved((prev) => !prev)
          }}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              isSaved ? "fill-yellow-500 text-yellow-500" : "fill-transparent"
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-1 pb-1">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 font-playfair text-lg font-bold text-foreground transition-colors group-hover:text-yellow-500">
            {title}
          </h3>
          {location && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} className="shrink-0 text-yellow-500" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>

        {(bedrooms || bathrooms || area?.value || propertyType) && (
          <div className="flex flex-wrap items-center gap-2">
            {typeof bedrooms === "number" && bedrooms > 0 && (
              <StatPill icon={BedDouble}>{bedrooms}-Bedroom</StatPill>
            )}
            {typeof bathrooms === "number" && bathrooms > 0 && (
              <StatPill icon={Bath}>{bathrooms}-Bathroom</StatPill>
            )}
            {area?.value && (
              <StatPill icon={Maximize}>{area.value} {area.unit ?? "sqft"}</StatPill>
            )}
            {propertyType && <StatPill icon={Building2}>{propertyType}</StatPill>}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Price{priceLabel ? ` · ${priceLabel}` : ""}
            </span>
            <span className="font-playfair text-lg font-bold text-foreground">
              {formatPrice(price)}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-yellow-500 px-4 py-2 text-xs font-semibold text-black transition-colors group-hover:bg-yellow-400 sm:px-5 sm:text-sm">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard

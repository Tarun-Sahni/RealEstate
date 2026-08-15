"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/store/favoritesStore"
import { PublicPropertyListItem } from "@/lib/queries/properties"
import PropertyGrid from "./property-grid"

interface WishlistGridProps {
  properties: PublicPropertyListItem[]
}

const WishlistGrid = ({ properties }: WishlistGridProps) => {
  const loaded = useFavorites((state) => state.loaded)
  const ids = useFavorites((state) => state.ids)

  // Server-rendered list is the source of truth on first paint; once the client
  // store hydrates, un-hearting a card here drops it from view immediately.
  const visible = useMemo(() => {
    if (!loaded) return properties
    return properties.filter((property) => ids.includes(property._id))
  }, [properties, ids, loaded])

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Heart size={28} className="text-muted-foreground" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-playfair text-xl font-medium">Your wishlist is empty</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tap the heart icon on any property to save it here for later.
          </p>
        </div>
        <Button
          asChild
          className="mt-2 rounded-full bg-yellow-500 text-black hover:bg-yellow-400"
        >
          <Link href="/properties">Browse Properties</Link>
        </Button>
      </div>
    )
  }

  return <PropertyGrid properties={visible} className="lg:grid-cols-4 xl:grid-cols-4" />
}

export default WishlistGrid

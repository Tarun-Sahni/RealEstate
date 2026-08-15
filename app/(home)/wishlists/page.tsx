import { Heart } from "lucide-react"
import { verifyUserSession } from "@/lib/dal"
import { getWishlistProperties } from "@/lib/queries/properties"
import WishlistGrid from "@/components/user/property/wishlist-grid"

export const metadata = {
  title: "My Wishlist | Gurgaon Elite Estate",
  description: "Properties you've saved for later.",
}

const WishlistsPage = async () => {
  const session = await verifyUserSession()
  const properties = await getWishlistProperties(session.userId)

  return (
    <main className="min-h-screen px-4 pt-24 pb-16 md:pt-28">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-yellow-500/10">
            <Heart size={22} className="fill-yellow-500 text-yellow-500" />
          </span>
          <h1 className="font-playfair text-3xl font-bold md:text-4xl">My Wishlist</h1>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            {properties.length > 0
              ? `${properties.length} propert${properties.length === 1 ? "y" : "ies"} you've saved for later`
              : "Properties you save will show up here"}
          </p>
        </div>

        <WishlistGrid properties={properties} />
      </div>
    </main>
  )
}

export default WishlistsPage

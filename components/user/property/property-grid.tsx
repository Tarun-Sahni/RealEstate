import { SearchX } from "lucide-react"
import PropertyCard from "@/components/user/common/propertcard"
import { PublicPropertyListItem } from "@/lib/queries/properties"
import { cn } from "@/lib/utils"

interface PropertyGridProps {
  properties: PublicPropertyListItem[]
  className?: string
}

const PropertyGrid = ({ properties, className }: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
        <SearchX size={32} className="text-muted-foreground" />
        <p className="font-playfair text-xl font-medium">No properties found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting or clearing your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          slug={property.slug}
          title={property.title}
          coverImage={property.coverImage}
          images={property.images}
          price={property.price}
          priceLabel={property.priceLabel}
          city={property.address?.city}
          state={property.address?.state}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          area={property.area}
          listingType={property.listingType?.name}
          propertyType={property.propertyType?.name}
        />
      ))}
    </div>
  )
}

export default PropertyGrid

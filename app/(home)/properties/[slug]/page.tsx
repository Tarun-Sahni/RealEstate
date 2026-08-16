import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import PropertyGallery from "@/components/user/property/property-gallery"
import PropertyDetailInfo from "@/components/user/property/property-detail-info"
import PropertyTourForm from "@/components/user/property/property-tour-form"
import { getPropertyBySlug } from "@/lib/queries/properties"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) return { title: "Property Not Found | Gurgaon Elite Estate" }

  return {
    title: property.metaTitle || `${property.title} | Gurgaon Elite Estate`,
    description: property.metaDescription || property.shortDescription || property.description?.slice(0, 160),
  }
}

// Always render fresh from the database — admin-managed content (properties)
// should never be served from a stale build-time cache.
export const dynamic = "force-dynamic"

const PropertyDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) notFound()

  const images = property.images && property.images.length > 0
    ? property.images
    : property.coverImage
      ? [property.coverImage]
      : []

  return (
    <main className="min-h-screen px-4 pt-24 pb-16 md:pt-28">
      <div className="container mx-auto flex max-w-5xl flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/properties">Properties</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {property.category?.slug && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/properties/category/${property.category.slug}`}>
                      {property.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-52">{property.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PropertyGallery title={property.title} images={images} />
        <PropertyDetailInfo property={property} />
        <PropertyTourForm propertyId={property._id} propertyTitle={property.title} />
      </div>
    </main>
  )
}

export default PropertyDetailPage

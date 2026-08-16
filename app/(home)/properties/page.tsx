import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CategoryNav from "@/components/user/property/category-nav"
import PropertyFilters from "@/components/user/property/property-filters"
import PropertyGrid from "@/components/user/property/property-grid"
import PropertyPagination from "@/components/user/property/property-pagination"
import {
  getAllPublicSubcategories,
  getPublicCategories,
  getPublicListingTypes,
  getPublicProperties,
  getPublicPropertyTypes,
} from "@/lib/queries/properties"

export const metadata = {
  title: "Properties | Gurgaon Elite Estate",
  description: "Browse apartments, villas, plots and commercial spaces across Gurgaon.",
}

// Always render fresh from the database — admin-managed content (properties)
// should never be served from a stale build-time cache.
export const dynamic = "force-dynamic"

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const PropertiesPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams
  const filters = {
    category: first(params.category),
    subcategory: first(params.subcategory),
    listingType: first(params.listingType),
    propertyType: first(params.propertyType),
    city: first(params.city),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
    search: first(params.search),
    page: first(params.page),
  }

  const [{ properties, pagination }, categories, subcategories, listingTypes, propertyTypes] = await Promise.all([
    getPublicProperties(filters),
    getPublicCategories(),
    getAllPublicSubcategories(),
    getPublicListingTypes(),
    getPublicPropertyTypes(),
  ])

  const currentSearchParams: Record<string, string | undefined> = {
    category: filters.category,
    subcategory: filters.subcategory,
    listingType: filters.listingType,
    propertyType: filters.propertyType,
    city: filters.city,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search,
  }

  return (
    <main className="min-h-screen px-4 pt-24 pb-16 md:pt-28">
      <div className="container mx-auto flex flex-col gap-6">
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Properties</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="font-playfair text-3xl font-bold md:text-4xl">
            Explore Properties
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {pagination.total} propert{pagination.total === 1 ? "y" : "ies"} available
          </p>
        </div>

        <CategoryNav categories={categories} />

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-72 lg:shrink-0">
            <PropertyFilters
              categories={categories}
              subcategories={subcategories}
              listingTypes={listingTypes}
              propertyTypes={propertyTypes}
            />
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <PropertyGrid properties={properties} />
            <div className="flex justify-center">
              <PropertyPagination
                pagination={pagination}
                basePath="/properties"
                searchParams={currentSearchParams}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PropertiesPage

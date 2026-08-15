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
import CategoryNav from "@/components/user/property/category-nav"
import PropertyFilters from "@/components/user/property/property-filters"
import PropertyGrid from "@/components/user/property/property-grid"
import PropertyPagination from "@/components/user/property/property-pagination"
import {
  getPublicCategories,
  getPublicListingTypes,
  getPublicProperties,
  getPublicPropertyTypes,
  getPublicSubcategories,
} from "@/lib/queries/properties"

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  const result = await getPublicSubcategories(categorySlug)
  if (!result) return { title: "Category Not Found | Gurgaon Elite Estate" }

  return {
    title: `${result.category.name} Properties | Gurgaon Elite Estate`,
    description: `Browse ${result.category.name.toLowerCase()} properties for sale and rent in Gurgaon.`,
  }
}

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<SearchParams>
}) => {
  const { categorySlug } = await params
  const query = await searchParams

  const categoryResult = await getPublicSubcategories(categorySlug)
  if (!categoryResult) notFound()

  const filters = {
    category: categorySlug,
    subcategory: first(query.subcategory),
    listingType: first(query.listingType),
    propertyType: first(query.propertyType),
    city: first(query.city),
    minPrice: first(query.minPrice),
    maxPrice: first(query.maxPrice),
    search: first(query.search),
    page: first(query.page),
  }

  const [{ properties, pagination }, categories, listingTypes, propertyTypes] = await Promise.all([
    getPublicProperties(filters),
    getPublicCategories(),
    getPublicListingTypes(),
    getPublicPropertyTypes(),
  ])

  const currentSearchParams: Record<string, string | undefined> = {
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryResult.category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <h1 className="font-playfair text-3xl font-bold capitalize md:text-4xl">
            {categoryResult.category.name}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {pagination.total} propert{pagination.total === 1 ? "y" : "ies"} in {categoryResult.category.name}
          </p>
        </div>

        <CategoryNav categories={categories} />

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-72 lg:shrink-0">
            <PropertyFilters
              categories={categories}
              subcategories={categoryResult.subcategories}
              listingTypes={listingTypes}
              propertyTypes={propertyTypes}
              showCategory={false}
              showSubcategory={categoryResult.subcategories.length > 0}
            />
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <PropertyGrid properties={properties} />
            <div className="flex justify-center">
              <PropertyPagination
                pagination={pagination}
                basePath={`/properties/category/${categorySlug}`}
                searchParams={currentSearchParams}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CategoryPage

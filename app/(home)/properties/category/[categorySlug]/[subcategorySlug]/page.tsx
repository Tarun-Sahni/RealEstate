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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>
}) {
  const { categorySlug, subcategorySlug } = await params
  const result = await getPublicSubcategories(categorySlug)
  const subcategory = result?.subcategories.find((s) => s.slug === subcategorySlug)
  if (!result || !subcategory) return { title: "Not Found | Gurgaon Elite Estate" }

  return {
    title: `${subcategory.name} in ${result.category.name} | Gurgaon Elite Estate`,
    description: `Browse ${subcategory.name.toLowerCase()} properties for sale and rent in Gurgaon.`,
  }
}

const SubcategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>
  searchParams: Promise<SearchParams>
}) => {
  const { categorySlug, subcategorySlug } = await params
  const query = await searchParams

  const categoryResult = await getPublicSubcategories(categorySlug)
  if (!categoryResult) notFound()

  const subcategory = categoryResult.subcategories.find((s) => s.slug === subcategorySlug)
  if (!subcategory) notFound()

  const filters = {
    category: categorySlug,
    subcategory: subcategorySlug,
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
              <BreadcrumbLink asChild>
                <Link href={`/properties/category/${categorySlug}`}>{categoryResult.category.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subcategory.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <h1 className="font-playfair text-3xl font-bold capitalize md:text-4xl">
            {subcategory.name}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {pagination.total} propert{pagination.total === 1 ? "y" : "ies"} in {categoryResult.category.name} &rsaquo; {subcategory.name}
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
              showSubcategory={false}
            />
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <PropertyGrid properties={properties} />
            <div className="flex justify-center">
              <PropertyPagination
                pagination={pagination}
                basePath={`/properties/category/${categorySlug}/${subcategorySlug}`}
                searchParams={currentSearchParams}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SubcategoryPage

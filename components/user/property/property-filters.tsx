"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ListFilter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Option {
  _id: string
  name: string
  slug?: string
}

interface SubcategoryOption extends Option {
  category?: { _id: string; slug: string } | string
}

interface PropertyFiltersProps {
  categories: Option[]
  subcategories: SubcategoryOption[]
  listingTypes: Option[]
  propertyTypes: Option[]
  showCategory?: boolean
  showSubcategory?: boolean
}

const ALL = "__all__"

const PropertyFilters = ({
  categories,
  subcategories,
  listingTypes,
  propertyTypes,
  showCategory = true,
  showSubcategory = true,
}: PropertyFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [category, setCategory] = useState(searchParams.get("category") ?? ALL)
  const [subcategory, setSubcategory] = useState(searchParams.get("subcategory") ?? ALL)
  const [listingType, setListingType] = useState(searchParams.get("listingType") ?? ALL)
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") ?? ALL)
  const [city, setCity] = useState(searchParams.get("city") ?? "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")
  const [sheetOpen, setSheetOpen] = useState(false)

  const filteredSubcategories = useMemo(() => {
    if (!showCategory) return subcategories
    if (category === ALL) return subcategories
    return subcategories.filter((s) => {
      const categorySlug = typeof s.category === "string" ? undefined : s.category?.slug
      return categorySlug === category
    })
  }, [subcategories, category, showCategory])

  const buildUrl = (overrides: Partial<Record<"search" | "category" | "subcategory" | "listingType" | "propertyType" | "city" | "minPrice" | "maxPrice", string>>) => {
    const params = new URLSearchParams(searchParams.toString())
    const next: Record<string, string> = {
      search,
      ...(showCategory ? { category } : {}),
      ...(showSubcategory ? { subcategory } : {}),
      listingType,
      propertyType,
      city,
      minPrice,
      maxPrice,
      ...overrides,
    }
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === ALL) params.delete(key)
      else params.set(key, value)
    })
    params.delete("page")
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const apply = (overrides: Parameters<typeof buildUrl>[0] = {}) => {
    router.push(buildUrl(overrides))
    setSheetOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apply()
  }

  const activeCount =
    (search ? 1 : 0) +
    (showCategory && category !== ALL ? 1 : 0) +
    (showSubcategory && subcategory !== ALL ? 1 : 0) +
    (listingType !== ALL ? 1 : 0) +
    (propertyType !== ALL ? 1 : 0) +
    (city ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0)

  const clearAll = () => {
    setSearch("")
    setCategory(ALL)
    setSubcategory(ALL)
    setListingType(ALL)
    setPropertyType(ALL)
    setCity("")
    setMinPrice("")
    setMaxPrice("")
    router.push(pathname)
    setSheetOpen(false)
  }

  const fields = (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pf-search">Search</Label>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="pf-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Project, locality, title..."
            className="pl-9"
          />
        </div>
      </div>

      {showCategory && (
        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value)
              setSubcategory(ALL)
              apply({ category: value, subcategory: ALL })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c.slug ?? c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showSubcategory && (
        <div className="flex flex-col gap-2">
          <Label>Subcategory</Label>
          <Select
            value={subcategory}
            onValueChange={(value) => {
              setSubcategory(value)
              apply({ subcategory: value })
            }}
            disabled={filteredSubcategories.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All subcategories</SelectItem>
              {filteredSubcategories.map((s) => (
                <SelectItem key={s._id} value={s.slug ?? s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Listing Type</Label>
        <Select
          value={listingType}
          onValueChange={(value) => {
            setListingType(value)
            apply({ listingType: value })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any</SelectItem>
            {listingTypes.map((l) => (
              <SelectItem key={l._id} value={l.name}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Property Type</Label>
        <Select
          value={propertyType}
          onValueChange={(value) => {
            setPropertyType(value)
            apply({ propertyType: value })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any</SelectItem>
            {propertyTypes.map((p) => (
              <SelectItem key={p._id} value={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pf-city">City</Label>
        <Input
          id="pf-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Gurgaon"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Price Range (₹)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center justify-between gap-2 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ListFilter size={16} />
              Filters
              {activeCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-semibold text-black">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
              {fields}
            </form>
            <SheetFooter className="flex-row">
              <Button type="button" variant="outline" className="flex-1" onClick={clearAll}>
                Clear
              </Button>
              <SheetClose asChild>
                <Button type="button" className="flex-1" onClick={() => apply()}>
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-muted-foreground">
            <X size={14} />
            Clear
          </Button>
        )}
      </div>

      {/* Desktop sidebar */}
      <form
        onSubmit={handleSubmit}
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] flex-col gap-5 overflow-y-auto rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:flex"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-playfair text-lg font-semibold">Filters</h3>
          {activeCount > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-muted-foreground">
              <X size={14} />
              Clear
            </Button>
          )}
        </div>
        {fields}
        <Button type="submit" className="mt-1">
          Apply Filters
        </Button>
      </form>
    </>
  )
}

export default PropertyFilters

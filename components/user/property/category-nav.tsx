"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface CategoryNavProps {
  categories: { _id: string; name: string; slug: string }[]
}

const CategoryNav = ({ categories }: CategoryNavProps) => {
  const pathname = usePathname()

  return (
    <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <nav className="scrollbar-none flex items-center gap-2 overflow-x-auto">
        <Link
          href="/properties"
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors",
            pathname === "/properties"
              ? "bg-yellow-500 text-black"
              : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          All Properties
        </Link>
        {categories.map((category) => {
          const href = `/properties/category/${category.slug}`
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={category._id}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors",
                active
                  ? "bg-yellow-500 text-black"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {category.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default CategoryNav

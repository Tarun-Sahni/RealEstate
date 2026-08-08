"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  users: "Users",
  category: "Category",
  subcategory: "Subcategory",
  property: "Property",
  listingtype: "Listing Type",
  propertytype: "Property Type",
  propertylisting: "Property Listing",
  inquiry: "Inquiry",
  add: "Add Property",
}

// Segments that don't have their own page (sidebar-only groupings) shouldn't be links.
const nonNavigableSegments = new Set(["property"])

const isObjectId = (segment: string) => /^[0-9a-f]{24}$/i.test(segment);

const humanize = (segment: string) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  let href = "";

  return segments.map((segment, index) => {
    href += `/${segment}`;
    return {
      href,
      label: routeLabels[segment] ?? (isObjectId(segment) ? "Edit Property" : humanize(segment)),
      isLast: index === segments.length - 1,
      isNavigable: !nonNavigableSegments.has(segment),
    }
  })
}

export function SiteHeader({ username }: { username?: string }) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap text-sm">
            {crumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {crumb.isLast || !crumb.isNavigable ? (
                    <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="default" size="sm" className="hidden sm:flex capitalize tracking-wider">
            {username ?? "Admin"}
          </Button>
        </div>
      </div>
    </header>
  )
}

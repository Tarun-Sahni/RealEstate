import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { Pagination as PaginationInfo } from "@/lib/queries/properties"

interface PropertyPaginationProps {
  pagination: PaginationInfo
  basePath: string
  searchParams: Record<string, string | undefined>
}

// Builds a windowed page list, e.g. [1, "...", 4, 5, 6, "...", 10], so the pager
// stays usable even with a large number of pages.
const getPageWindow = (current: number, totalPages: number) => {
  const pages: (number | "ellipsis")[] = [];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  pages.push(1);
  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

// Server-rendered — real anchors, no client JS required to paginate.
const PropertyPagination = ({ pagination, basePath, searchParams }: PropertyPaginationProps) => {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
    );
    params.set("page", String(target));
    return `${basePath}?${params.toString()}`;
  }

  const pageWindow = getPageWindow(page, totalPages);

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          {page <= 1 ? (
            <span className={cn(buttonVariants({ variant: "outline", size: "default" }), "pl-1.5! pointer-events-none opacity-50")}>
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </span>
          ) : (
            <Link href={hrefFor(page - 1)} className={cn(buttonVariants({ variant: "outline", size: "default" }), "pl-1.5!")}>
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Link>
          )}
        </PaginationItem>
        {pageWindow.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span className="flex size-8 items-center justify-center">
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(buttonVariants({ variant: item === page ? "outline" : "ghost", size: "icon" }))}
              >
                {item}
              </Link>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          {page >= totalPages ? (
            <span className={cn(buttonVariants({ variant: "outline", size: "default" }), "pr-1.5! pointer-events-none opacity-50")}>
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </span>
          ) : (
            <Link href={hrefFor(page + 1)} className={cn(buttonVariants({ variant: "outline", size: "default" }), "pr-1.5!")}>
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PropertyPagination

"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddSubCategory from "./add"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import DeleteSubCategory from "./delete"
import UpdateSubCategory from "./update"
import { PlusCircle } from "lucide-react"
import axios, { AxiosError } from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface SubCategoryItem {
  _id: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: string;
}

const LIMIT = 10;

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

const SubCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [loading, setLoading] = useState(true);
  const [subcategories, setSubCategories] = useState<SubCategoryItem[]>([])
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getAllSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/subcategory", {
        params: { page, limit: LIMIT },
        withCredentials: true,
      })
      if (response?.data?.success) {
        setSubCategories(response.data.subcategories)
        setTotal(response.data.pagination?.total ?? 0)
        setTotalPages(response.data.pagination?.totalPages ?? 1)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page])

  useEffect(() => {
    getAllSubCategories();
  }, [getAllSubCategories])

  const goToPage = (target: number) => {
    const clamped = Math.min(Math.max(1, target), totalPages);
    router.push(`/admin/subcategory?page=${clamped}`);
  }

  const pageWindow = getPageWindow(page, totalPages);
  const startRow = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endRow = Math.min(page * LIMIT, total);

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle />
              Add SubCategory</Button>
          </DialogTrigger>
          <AddSubCategory onSuccess={getAllSubCategories} />
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Slug</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : subcategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No subcategories yet.
              </TableCell>
            </TableRow>
          ) : (
            subcategories.map((subcategory, index) => (
              <TableRow key={subcategory._id}>
                <TableCell className="text-left">{startRow + index}</TableCell>
                <TableCell className="font-medium text-center">{subcategory.name}</TableCell>
                <TableCell className="text-center">{subcategory.slug}</TableCell>
                <TableCell className="text-center">{subcategory.category?.name ?? "—"}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={subcategory?.isActive ? "default" : "secondary"} className="tracking-wider">
                    {subcategory.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(subcategory.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <UpdateSubCategory
                      subcategory={subcategory}
                      onSuccess={getAllSubCategories}
                    />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteSubCategory subcategoryid={subcategory._id} onSuccess={getAllSubCategories} />
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!loading && total > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startRow}-{endRow} of {total}
          </p>
          <Pagination className="mx-0 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page - 1);
                  }}
                />
              </PaginationItem>
              {pageWindow.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>

  )
}

export default SubCategory

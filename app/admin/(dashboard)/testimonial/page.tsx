"use client"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
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
import axios, { AxiosError } from "axios"
import { PlusCircle, Star } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import AddTestimonial from "./add"
import DeleteTestimonial from "./delete"
import UpdateTestimonial from "./update"

interface TestimonialItem {
  _id: string;
  name: string;
  designation: string;
  photo: string;
  rating: number;
  message: string;
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

const Testimonials = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getAllTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/testimonial", {
        params: { page, limit: LIMIT },
        withCredentials: true,
      })
      if (response?.data?.success) {
        setTestimonials(response.data.testimonials)
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
    getAllTestimonials();
  }, [getAllTestimonials])

  const goToPage = (target: number) => {
    const clamped = Math.min(Math.max(1, target), totalPages);
    router.push(`/admin/testimonial?page=${clamped}`);
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
              Add Testimonial
            </Button>
          </DialogTrigger>
          <AddTestimonial onSuccess={getAllTestimonials} />
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Photo</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Designation</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Testimonial</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No testimonials yet.
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((testimonial, index) => (
              <TableRow key={testimonial._id}>
                <TableCell className="text-left">{startRow + index}</TableCell>
                <TableCell className="flex justify-center">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-center">{testimonial.name}</TableCell>
                <TableCell className="text-center">{testimonial.designation}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={cn(
                          "size-3.5",
                          value <= testimonial.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-64 text-center">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{testimonial.message}</p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={testimonial.isActive ? "default" : "secondary"} className="tracking-wider">
                    {testimonial.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <UpdateTestimonial testimonial={testimonial} onSuccess={getAllTestimonials} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteTestimonial testimonialId={testimonial._id} onSuccess={getAllTestimonials} />
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

export default Testimonials

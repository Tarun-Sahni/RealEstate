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
import { PlusCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AddUser from "./add"
import DeleteUser from "./delete"
import UpdateUser from "./update"

interface UserItem {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: "USER" | "ADMIN";
  isVerified: boolean;
  isActive: boolean;
  loginAttempts?: number;
  lockOutExpires?: string | null;
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

const Users = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([])
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users", {
        params: { page, limit: LIMIT },
        withCredentials: true,
      })
      if (response?.data?.success) {
        setUsers(response.data.users)
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
    getAllUsers();
  }, [getAllUsers])

  const goToPage = (target: number) => {
    const clamped = Math.min(Math.max(1, target), totalPages);
    router.push(`/admin/users?page=${clamped}`);
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
              Add User</Button>
          </DialogTrigger>
          <AddUser onSuccess={getAllUsers} />
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Verified</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Lockout</TableHead>
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
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No users yet.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell className="text-left">{startRow + index}</TableCell>
                <TableCell className="font-medium text-center capitalize">{user.username}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.isVerified ? "default" : "secondary"} className="tracking-wider">
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.isActive ? "default" : "secondary"} className="tracking-wider">
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {user.lockOutExpires && new Date(user.lockOutExpires) > new Date() ? (
                    <Badge variant="destructive" className="tracking-wider">
                      Locked until {new Date(user.lockOutExpires).toLocaleString()}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="tracking-wider">Not locked</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <UpdateUser user={user} onSuccess={getAllUsers} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteUser userid={user._id} onSuccess={getAllUsers} />
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

export default Users

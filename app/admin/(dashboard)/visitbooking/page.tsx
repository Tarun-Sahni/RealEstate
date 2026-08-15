"use client"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios, { AxiosError } from "axios"
import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import DeleteVisitBooking from "./delete"
import ViewVisitBooking from "./view"

interface VisitBookingItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  status: "PENDING" | "COMPLETED";
  property?: { _id: string; title: string; slug: string };
  createdAt: string;
}

const VisitBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<VisitBookingItem[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/visitbooking", { withCredentials: true })
      if (response?.data?.success) {
        setBookings(response.data.bookings)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [])

  const markCompleted = async (bookingid: string) => {
    try {
      setUpdatingId(bookingid);
      const response = await axios.patch(
        `/api/admin/visitbooking/${bookingid}`,
        { status: "COMPLETED" },
        { withCredentials: true }
      )
      if (response?.data?.success) {
        toast.success(response.data.message)
        setBookings((prev) =>
          prev.map((booking) => (booking._id === bookingid ? { ...booking, status: "COMPLETED" } : booking))
        )
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    getAllBookings();
  }, [getAllBookings])

  return (
    <div className="w-full h-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Property</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Requested At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No tour requests yet.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking, index) => (
              <TableRow key={booking._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-center capitalize">{booking.fullName}</TableCell>
                <TableCell className="text-center">{booking.property?.title ?? "—"}</TableCell>
                <TableCell className="text-center">{booking.email}</TableCell>
                <TableCell className="text-center">{booking.phone}</TableCell>
                <TableCell className="text-center">
                  {booking.status === "COMPLETED" ? (
                    <Badge variant="default" className="tracking-wider">
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="animate-pending-glow gap-1.5 border-amber-500/40 bg-amber-500/15 tracking-wider text-amber-600 dark:text-amber-400">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(booking.createdAt).toLocaleDateString()}{" "}
                  {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {booking.status === "PENDING" && (
                    <Button
                      variant="outline"
                      onClick={() => markCompleted(booking._id)}
                      disabled={updatingId === booking._id}
                    >
                      {updatingId === booking._id ? (
                        <>
                          <Loader2 className="animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 /> Mark Completed
                        </>
                      )}
                    </Button>
                  )}
                  {booking.property ? (
                    <Button variant="outline" asChild>
                      <Link href={`/admin/property/propertylisting/${booking.property._id}/view`}>
                        View Property
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      View Property
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View</Button>
                    </DialogTrigger>
                    <ViewVisitBooking booking={booking} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteVisitBooking bookingid={booking._id} onSuccess={getAllBookings} />
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default VisitBookingPage

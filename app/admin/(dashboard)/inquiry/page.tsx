"use client"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
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
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import DeleteInquiry from "./delete"
import ViewInquiry from "./view"

interface InquiryItem {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const Inquiry = () => {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])

  const getAllInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/inquiry", { withCredentials: true })
      if (response?.data?.success) {
        setInquiries(response.data.inquiries)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    getAllInquiries();
  }, [getAllInquiries])

  return (
    <div className="w-full h-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-right">Received At</TableHead>
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
          ) : inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No inquiries yet.
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map((inquiry, index) => (
              <TableRow key={inquiry._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-center capitalize">
                  {inquiry.firstname} {inquiry.lastname}
                </TableCell>
                <TableCell className="text-center">{inquiry.email}</TableCell>
                <TableCell className="text-center">{inquiry.phone}</TableCell>
               
                <TableCell className="text-right">
                  {new Date(inquiry.createdAt).toLocaleDateString()}{" "}
                  {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View</Button>
                    </DialogTrigger>
                    <ViewInquiry inquiry={inquiry} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteInquiry inquiryid={inquiry._id} onSuccess={getAllInquiries} />
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

export default Inquiry

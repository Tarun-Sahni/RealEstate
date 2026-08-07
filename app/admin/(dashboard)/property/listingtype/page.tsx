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
import { PlusCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AddListingType from "./add"
import DeleteListingType from "./delete"
import UpdateListingType from "./update"

interface ListingTypeItem {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

const ListingType = () => {
  const [loading, setLoading] = useState(true);
  const [listingTypes, setListingTypes] = useState<ListingTypeItem[]>([])

  const getAllListingTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/listingtype", { withCredentials: true })
      if (response?.data?.success) {
        setListingTypes(response.data.listingTypes)
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
    getAllListingTypes();
  }, [getAllListingTypes])

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle />
              Add Listing Type</Button>
          </DialogTrigger>
          <AddListingType onSuccess={getAllListingTypes} />
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : listingTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No listing types yet.
              </TableCell>
            </TableRow>
          ) : (
            listingTypes.map((listingType, index) => (
              <TableRow key={listingType._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-center">{listingType.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={listingType.isActive ? "default" : "secondary"} className="tracking-wider">
                    {listingType.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(listingType.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <UpdateListingType listingType={listingType} onSuccess={getAllListingTypes} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteListingType listingtypeid={listingType._id} onSuccess={getAllListingTypes} />
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

export default ListingType

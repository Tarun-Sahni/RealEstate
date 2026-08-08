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
import AddPropertyType from "./add"
import DeletePropertyType from "./delete"
import UpdatePropertyType from "./update"

interface PropertyTypeItem {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

const PropertyType = () => {
  const [loading, setLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeItem[]>([])

  const getAllPropertyTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/propertytype", { withCredentials: true })
      if (response?.data?.success) {
        setPropertyTypes(response.data.propertyTypes)
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
    getAllPropertyTypes();
  }, [getAllPropertyTypes])

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle />
              Add Property Type</Button>
          </DialogTrigger>
          <AddPropertyType onSuccess={getAllPropertyTypes} />
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
          ) : propertyTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No property types yet.
              </TableCell>
            </TableRow>
          ) : (
            propertyTypes.map((propertyType, index) => (
              <TableRow key={propertyType._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-center">{propertyType.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={propertyType.isActive ? "default" : "secondary"} className="tracking-wider">
                    {propertyType.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(propertyType.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <UpdatePropertyType propertyType={propertyType} onSuccess={getAllPropertyTypes} />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeletePropertyType propertytypeid={propertyType._id} onSuccess={getAllPropertyTypes} />
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

export default PropertyType

"use client"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import DeleteProperty from "./delete"

interface PropertyItem {
  _id: string;
  title: string;
  category?: { name: string };
  listingType?: { name: string };
  propertyType?: { name: string };
  price: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

const PropertyListing = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyItem[]>([])

  const getAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/property", { withCredentials: true })
      if (response?.data?.success) {
        setProperties(response.data.properties)
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
    getAllProperties();
  }, [getAllProperties])

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-end items-center">
        <Button variant="default" asChild>
          <Link href="/admin/property/propertylisting/add">
            <PlusCircle />
            Add Property
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">S.No.</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Listing Type</TableHead>
            <TableHead className="text-center">Property Type</TableHead>
            <TableHead className="text-center">Price</TableHead>
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
          ) : properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No properties yet.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property, index) => (
              <TableRow key={property._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-center">{property.title}</TableCell>
                <TableCell className="text-center">{property.category?.name ?? "-"}</TableCell>
                <TableCell className="text-center">{property.listingType?.name ?? "-"}</TableCell>
                <TableCell className="text-center">{property.propertyType?.name ?? "-"}</TableCell>
                <TableCell className="text-center">{property.price?.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-center space-x-1">
                  <Badge variant={property.isActive ? "default" : "secondary"} className="tracking-wider">
                    {property.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {property.isFeatured && (
                    <Badge variant="outline" className="tracking-wider">Featured</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(property.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/property/propertylisting/${property._id}`}>Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <DeleteProperty propertyid={property._id} onSuccess={getAllProperties} />
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

export default PropertyListing

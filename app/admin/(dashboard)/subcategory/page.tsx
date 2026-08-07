"use client"
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
import AddSubCategory from "./add"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import DeleteSubCategory from "./delete"
import UpdateSubCategory from "./update"
import { PlusCircle } from "lucide-react"
import axios, { AxiosError } from "axios"
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

const SubCategory = () => {
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubCategories] = useState<SubCategoryItem[]>([])

  const getAllSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/subcategory", { withCredentials: true })
      if (response?.data?.success) {
        setSubCategories(response.data.subcategories)
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
    getAllSubCategories();
  }, [getAllSubCategories])

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
                <TableCell className="text-left">{index + 1}</TableCell>
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
    </div>

  )
}

export default SubCategory

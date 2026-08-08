"use client"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const DeletePropertyType = ({ propertytypeid, onSuccess }: { propertytypeid: string; onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/propertytype/${propertytypeid}`, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        onSuccess?.()
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="font-inter">Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this property type from the server.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={loading}>
          {loading ?
            <>
              <Loader2 className="animate-spin" />
              Deleting...
            </> :
            "Delete"
          }
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeletePropertyType

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
import { useRef, useState } from "react"
import { toast } from "sonner"

const DeleteCategory = ({ categoryid, onSuccess }: { categoryid: string; onSuccess?: () => void }) => {
//   const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/category/${categoryid}`, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        onSuccess?.()
        // closeRef.current?.click()
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
          This action cannot be undone. This will permanently delete this category, along with every subcategory and property under it.
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
        {/* <AlertDialogCancel ref={closeRef} className="hidden" /> */}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeleteCategory

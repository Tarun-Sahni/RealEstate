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

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([])

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users", { withCredentials: true })
      if (response?.data?.success) {
        setUsers(response.data.users)
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
    getAllUsers();
  }, [getAllUsers])

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
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No users yet.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell className="text-left">{index + 1}</TableCell>
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
    </div>
  )
}

export default Users

"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface ListingTypeProp {
    _id: string;
    name: string;
    isActive?: boolean;
}

const UpdateListingType = ({ listingType, onSuccess }: { listingType: ListingTypeProp; onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: listingType.name ?? "",
        isActive: listingType.isActive ?? true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await axios.patch(`/api/admin/listingtype/${listingType._id}`, form, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                onSuccess?.()
                closeRef.current?.click()
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
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-inter">Update Listing Type</DialogTitle>
                <DialogDescription>
                    Edit this listing type&apos;s details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={60}
                            placeholder="e.g. Sale"
                            required
                        />
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked === true }))}
                        />
                        <Label htmlFor="isActive">{form.isActive ? "Active" : "Inactive"}</Label>
                    </Field>
                </FieldGroup>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading}>
                        {loading ?
                            <>
                                <Loader2 className="animate-spin" />
                                Editing...
                            </> :
                            "Edit"
                        }
                    </Button>
                    <DialogClose ref={closeRef} className="hidden" type="button" />
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default UpdateListingType

"use client"
import { Button } from "@/components/ui/button"
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
import { Loader2, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

const initialForm = { name: "", designation: "" }

const AddTeamMember = ({ onSuccess }: { onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name: field, value } = e.target;
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setPhotoFile(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    }

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview("");
        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    }

    const resetForm = () => {
        setForm(initialForm);
        removePhoto();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!photoFile) {
            toast.error("Please upload a photo.")
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("data", JSON.stringify(form));
            formData.append("photoFile", photoFile);

            const response = await axios.post("/api/admin/teammember", formData, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                resetForm();
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
                <DialogTitle className="font-inter">Add Team Member</DialogTitle>
                <DialogDescription>
                    Add a team member to show in the "Meet Our Team" section of the About page.
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
                            maxLength={80}
                            placeholder="e.g. Rohan Mehta"
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="designation">Designation<span className="text-red-500">*</span></Label>
                        <Input
                            id="designation"
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            maxLength={80}
                            placeholder="e.g. Founder & CEO"
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="photo">Photo<span className="text-red-500">*</span></Label>
                        <Input
                            id="photo"
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        {photoPreview ? (
                            <div className="relative w-fit">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photoPreview} alt="Photo preview" className="size-24 rounded-full border object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon-sm"
                                    className="absolute -top-1 -right-1 rounded-full"
                                    onClick={removePhoto}
                                >
                                    <X />
                                </Button>
                            </div>
                        ) : (
                            <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}>
                                <Upload /> Upload Photo
                            </Button>
                        )}
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
                                Adding...
                            </> :
                            "Add"
                        }
                    </Button>
                    <DialogClose ref={closeRef} className="hidden" type="button" />
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default AddTeamMember

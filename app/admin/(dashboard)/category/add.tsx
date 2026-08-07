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
import { Textarea } from "@/components/ui/textarea"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

const slugify = (value: string) =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const initialForm = {
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
}

const AddCategory = ({ onSuccess }: { onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [slugEdited, setSlugEdited] = useState(false);
    const [form, setForm] = useState(initialForm)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target;

        if (field === "name") {
            setForm((prev) => ({
                ...prev,
                name: value,
                slug: slugEdited ? prev.slug : slugify(value),
            }))
            return;
        }

        if (field === "slug") {
            setSlugEdited(true);
        }

        setForm((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await axios.post("/api/admin/category", form, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                setForm(initialForm)
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
                <DialogTitle className="font-inter">Add Category</DialogTitle>
                <DialogDescription>
                    Create a new property category. Fields left blank will fall back to sensible defaults.
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
                            placeholder="e.g. Villas"
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="slug">Slug<span className="text-red-500">*</span></Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            placeholder="auto-generated-from-name"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            maxLength={500}
                            placeholder="Short description shown on the category page"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                            id="metaTitle"
                            name="metaTitle"
                            value={form.metaTitle}
                            onChange={handleChange}
                            maxLength={70}
                            placeholder="Defaults to the category name"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                            id="metaDescription"
                            name="metaDescription"
                            value={form.metaDescription}
                            onChange={handleChange}
                            maxLength={160}
                            placeholder="Defaults to the description"
                        />
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
                                Saving...
                            </> :
                            "Save changes"
                        }
                    </Button>
                    <DialogClose ref={closeRef} className="hidden" type="button" />
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default AddCategory

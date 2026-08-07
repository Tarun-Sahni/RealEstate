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

interface CategoryProp {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    isActive?: boolean;
}

const UpdateCategory = ({ category, onSuccess }: { category: CategoryProp; onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    // Slug already exists on the category being edited, so name edits shouldn't
    // silently regenerate/overwrite it — only an explicit edit to slug itself should.
    const [slugEdited, setSlugEdited] = useState(true);
    const [form, setForm] = useState({
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
        metaTitle: category.metaTitle ?? "",
        metaDescription: category.metaDescription ?? "",
        isActive: category.isActive ?? true,
    })

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
            const response = await axios.patch(`/api/admin/category/${category._id}`, form, { withCredentials: true })
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
                <DialogTitle className="font-inter">Update Category</DialogTitle>
                <DialogDescription>
                    Edit the property category details below.
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
                            required
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

export default UpdateCategory

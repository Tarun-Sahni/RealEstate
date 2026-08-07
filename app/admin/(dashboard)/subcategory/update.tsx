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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const slugify = (value: string) =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

interface CategoryOption {
    _id: string;
    name: string;
    isActive: boolean;
}

interface SubCategoryProp {
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
    isActive?: boolean;
}

const UpdateSubCategory = ({ subcategory, onSuccess }: { subcategory: SubCategoryProp; onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    // Slug already exists on the subcategory being edited, so name edits shouldn't
    // silently regenerate/overwrite it — only an explicit edit to slug itself should.
    const [slugEdited, setSlugEdited] = useState(true);
    const [form, setForm] = useState({
        category: subcategory.category?._id ?? "",
        name: subcategory.name ?? "",
        slug: subcategory.slug ?? "",
        description: subcategory.description ?? "",
        metaTitle: subcategory.metaTitle ?? "",
        metaDescription: subcategory.metaDescription ?? "",
        isActive: subcategory.isActive ?? true,
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await axios.get("/api/admin/category", { withCredentials: true })
                if (response?.data?.success) {
                    const allCategories = response.data.categories as CategoryOption[];
                    const activeCategories = allCategories.filter((category) => category.isActive);
                    const current = subcategory.category;
                    const hasCurrent = current && activeCategories.some((category) => category._id === current._id);
                    // The subcategory's current category may have since been deactivated —
                    // keep it selectable so the dropdown doesn't show a blank/invalid value.
                    setCategories(
                        current && !hasCurrent
                            ? [{ _id: current._id, name: current.name, isActive: false }, ...activeCategories]
                            : activeCategories
                    )
                }
            } catch (error) {
                const err = error as AxiosError<{ message?: string }>;
                const message = err.response?.data?.message || err.message || "Something went wrong";
                toast.error(message);
            } finally {
                setCategoriesLoading(false);
            }
        }

        fetchCategories();
    }, [subcategory.category])

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
            const response = await axios.patch(`/api/admin/subcategory/${subcategory._id}`, form, { withCredentials: true })
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
                <DialogTitle className="font-inter">Update Subcategory</DialogTitle>
                <DialogDescription>
                    Edit the subcategory details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="category">Category<span className="text-red-500">*</span></Label>
                        <Select
                            value={form.category}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                        >
                            <SelectTrigger id="category" className="w-full">
                                <SelectValue
                                    placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length === 0 ? (
                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                        {categoriesLoading ? "Loading..." : "No active categories found."}
                                    </div>
                                ) : (
                                    categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}{!category.isActive ? " (Inactive)" : ""}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="category" value={form.category} required />
                    </Field>
                    <Field>
                        <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={60}
                            placeholder="e.g. Studio Apartments"
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
                            placeholder="Short description shown on the subcategory page"
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
                            placeholder="Defaults to the subcategory name"
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
                    <Button type="submit" disabled={loading || !form.category}>
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

export default UpdateSubCategory

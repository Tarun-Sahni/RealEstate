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
import { Loader2, Star, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TestimonialProp {
    _id: string;
    name: string;
    designation: string;
    photo: string;
    rating: number;
    message: string;
    isActive?: boolean;
}

const UpdateTestimonial = ({ testimonial, onSuccess }: { testimonial: TestimonialProp; onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: testimonial.name ?? "",
        designation: testimonial.designation ?? "",
        message: testimonial.message ?? "",
        isActive: testimonial.isActive ?? true,
    })
    const [rating, setRating] = useState(testimonial.rating ?? 5);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState(testimonial.photo ?? "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("data", JSON.stringify({ ...form, rating }));
            if (photoFile) {
                formData.append("photoFile", photoFile);
            }

            const response = await axios.patch(`/api/admin/testimonial/${testimonial._id}`, formData, { withCredentials: true })
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
                <DialogTitle className="font-inter">Update Testimonial</DialogTitle>
                <DialogDescription>
                    Edit this testimonial's details below.
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
                            placeholder="e.g. Ankit Sharma"
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
                            maxLength={100}
                            placeholder="e.g. Homeowner, DLF Phase 3"
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="message">Testimonial<span className="text-red-500">*</span></Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            maxLength={600}
                            rows={4}
                            placeholder="Share what the client said about their experience..."
                            required
                        />
                    </Field>
                    <Field>
                        <Label>Rating<span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    aria-label={`${value} star`}
                                    className="p-0.5"
                                >
                                    <Star
                                        className={cn(
                                            "size-6 transition-colors",
                                            value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field>
                        <Label htmlFor="photo">Photo <span className="text-muted-foreground text-xs">(optional)</span></Label>
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

export default UpdateTestimonial

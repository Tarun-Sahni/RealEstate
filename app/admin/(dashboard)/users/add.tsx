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
import { Eye, EyeClosed, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

const initialForm = {
    username: "",
    email: "",
    password: "",
    isVerified: false,
    isActive: true,
}

const AddUser = ({ onSuccess }: { onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState(initialForm)
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setAvatarFile(file);
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    }

    const resetForm = () => {
        setForm(initialForm);
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("username", form.username);
            payload.append("email", form.email);
            payload.append("password", form.password);
            payload.append("isVerified", String(form.isVerified));
            payload.append("isActive", String(form.isActive));
            if (avatarFile) {
                payload.append("avatar", avatarFile);
            }

            const response = await axios.post("/api/admin/users", payload, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                resetForm()
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
                <DialogTitle className="font-inter">Add User</DialogTitle>
                <DialogDescription>
                    Create a new user account.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="username">Username<span className="text-red-500">*</span></Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            minLength={3}
                            maxLength={30}
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                placeholder="**************"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute top-1/2 right-1 -translate-y-1/2"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <Eye /> : <EyeClosed />}
                            </Button>
                        </div>
                    </Field>
                    <Field>
                        <Label htmlFor="avatar">Avatar</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                        />
                        {avatarPreview && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="mt-2 size-16 rounded-full object-cover"
                            />
                        )}
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox
                            id="isVerified"
                            checked={form.isVerified}
                            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isVerified: checked === true }))}
                        />
                        <Label htmlFor="isVerified">{form.isVerified ? "Verified" : "Unverified"}</Label>
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

export default AddUser

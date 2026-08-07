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
import axios, { AxiosError } from "axios"
import { Eye, EyeClosed, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface UserProp {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    role?: "USER" | "ADMIN";
    isVerified?: boolean;
    isActive?: boolean;
    loginAttempts?: number;
    lockOutExpires?: string | null;
}

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time, not an ISO/UTC string.
const toDatetimeLocal = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

const UpdateUser = ({ user, onSuccess }: { user: UserProp; onSuccess?: () => void }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar ?? null);
    const [form, setForm] = useState({
        username: user.username ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? "USER",
        isVerified: user.isVerified ?? false,
        isActive: user.isActive ?? false,
        loginAttempts: user.loginAttempts ?? 0,
        lockOutExpires: toDatetimeLocal(user.lockOutExpires),
    })

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
        setAvatarPreview(file ? URL.createObjectURL(file) : (user.avatar ?? null));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("username", form.username);
            payload.append("email", form.email);
            payload.append("role", form.role);
            payload.append("isVerified", String(form.isVerified));
            payload.append("isActive", String(form.isActive));
            payload.append("loginAttempts", String(form.loginAttempts));
            payload.append("lockOutExpires", form.lockOutExpires);
            payload.append("avatar", user.avatar ?? "");
            if (form.password) {
                payload.append("password", form.password);
            }
            if (avatarFile) {
                payload.append("avatarFile", avatarFile);
            }

            const response = await axios.patch(`/api/admin/users/${user._id}`, payload, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                setForm((prev) => ({ ...prev, password: "" }))
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
                <DialogTitle className="font-inter">Update User</DialogTitle>
                <DialogDescription>
                    Edit this user&apos;s account details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="username">Username<span className="text-red-500">*</span></Label>
                        <Input
                            id="username"
                            name="username"
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
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                placeholder="Leave blank to keep current password"
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
                        <Label htmlFor="avatarFile">Avatar</Label>
                        <Input
                            id="avatarFile"
                            name="avatarFile"
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
                    <Field>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={form.role}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as "USER" | "ADMIN" }))}
                        >
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.role === "ADMIN" && (
                            <p className="text-xs text-amber-600">
                                Promoting to Admin removes this user from this list (only non-admins are shown here).
                            </p>
                        )}
                    </Field>
                    <Field>
                        <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                        <Input
                            id="loginAttempts"
                            name="loginAttempts"
                            type="number"
                            min={0}
                            value={form.loginAttempts}
                            onChange={handleChange}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="lockOutExpires">Locked Until</Label>
                        <Input
                            id="lockOutExpires"
                            name="lockOutExpires"
                            type="datetime-local"
                            value={form.lockOutExpires}
                            onChange={handleChange}
                        />
                        {form.lockOutExpires && (
                            <Button
                                type="button"
                                variant="link"
                                className="w-fit px-0"
                                onClick={() => setForm((prev) => ({ ...prev, lockOutExpires: "" }))}
                            >
                                Clear (unlock now)
                            </Button>
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

export default UpdateUser

"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

const initialForm = {
    phone: "",
    email: "",
    supportEmail: "",
    officeAddress: "",
    mapEmbedUrl: "",
    officeHours: "",
    whatsappNumber: "",
    facebook: "",
    youtube: "",
    instagram: "",
}

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(initialForm);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/admin/settings", { withCredentials: true })
            if (response?.data?.success) {
                const settings = response.data.settings ?? {};
                setForm({
                    phone: settings.phone ?? "",
                    email: settings.email ?? "",
                    supportEmail: settings.supportEmail ?? "",
                    officeAddress: settings.officeAddress ?? "",
                    mapEmbedUrl: settings.mapEmbedUrl ?? "",
                    officeHours: settings.officeHours ?? "",
                    whatsappNumber: settings.whatsappNumber ?? "",
                    facebook: settings.facebook ?? "",
                    youtube: settings.youtube ?? "",
                    instagram: settings.instagram ?? "",
                })
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
        fetchSettings();
    }, [fetchSettings])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target;
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSaving(true);
            const response = await axios.patch("/api/admin/settings", form, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
            }
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-center text-muted-foreground py-10">Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Contact Details</CardTitle>
                        <CardDescription>Shown across the website's footer and Contact Us page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
                            </Field>
                            <Field>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. contact@estate.com" />
                            </Field>
                            <Field>
                                <Label htmlFor="supportEmail">Support Email<span className="text-red-500">*</span></Label>
                                <Input
                                    id="supportEmail"
                                    name="supportEmail"
                                    type="email"
                                    value={form.supportEmail}
                                    onChange={handleChange}
                                    placeholder="e.g. support@estate.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                <Input
                                    id="whatsappNumber"
                                    name="whatsappNumber"
                                    value={form.whatsappNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. 919876543210 (with country code, no + or spaces)"
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Office & Hours</CardTitle>
                        <CardDescription>Your office address, map, and working hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="officeAddress">Office Address</Label>
                                <Textarea id="officeAddress" name="officeAddress" value={form.officeAddress} onChange={handleChange} placeholder="e.g. Plot 12, Sector 110, Gurgaon, Haryana" />
                            </Field>
                            <Field>
                                <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                                <Input
                                    id="mapEmbedUrl"
                                    name="mapEmbedUrl"
                                    value={form.mapEmbedUrl}
                                    onChange={handleChange}
                                    placeholder="Google Maps > Share > Embed a map > copy the src URL"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="officeHours">Office Hours</Label>
                                <Input id="officeHours" name="officeHours" value={form.officeHours} onChange={handleChange} placeholder="e.g. Mon-Fri, 9:00 AM - 6:00 PM" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Social Media</CardTitle>
                        <CardDescription>Links shown in the footer's social icons.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field>
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input id="facebook" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
                            </Field>
                            <Field>
                                <Label htmlFor="youtube">YouTube</Label>
                                <Input id="youtube" name="youtube" value={form.youtube} onChange={handleChange} placeholder="https://youtube.com/..." />
                            </Field>
                            <Field>
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input id="instagram" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={saving}>
                    {saving ?
                        <>
                            <Loader2 className="animate-spin" />
                            Saving...
                        </> :
                        "Save Changes"
                    }
                </Button>
            </div>
        </form>
    )
}

export default Settings

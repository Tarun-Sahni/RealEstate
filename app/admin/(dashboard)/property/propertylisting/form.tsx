"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
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
import { FileText, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const slugify = (value: string) =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

interface Option {
    _id: string;
    name: string;
    isActive?: boolean;
}

interface SubCategoryOption extends Option {
    category?: { _id: string } | string;
}

interface ConfigurationRow {
    type: string;
    superArea: string;
    carpetArea: string;
    price: string;
}

interface FaqRow {
    question: string;
    answer: string;
}

interface GalleryImage {
    id: string;
    url: string;
    file?: File;
}

const emptyConfiguration: ConfigurationRow = { type: "", superArea: "", carpetArea: "", price: "" };
const emptyFaq: FaqRow = { question: "", answer: "" };

const initialForm = {
    title: "",
    slug: "",
    category: "",
    subcategory: "",
    description: "",
    shortDescription: "",
    metaTitle: "",
    metaDescription: "",
    listingType: "",
    propertyType: "",
    propertyStatus: "",
    price: "",
    pricePerUnitArea: "",
    priceLabel: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    garages: "",
    areaValue: "",
    areaUnit: "sqft",
    address: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    longitude: "",
    latitude: "",
    developer: "",
    reraNumber: "",
    projectArea: "",
    totalUnits: "",
    totalTowers: "",
    possessionDate: "",
    videoUrl: "",
    amenities: "",
    highlights: "",
    contactName: "",
    contactPhone: "",
    isFeatured: false,
    isActive: true,
}

type FormState = typeof initialForm;

const toNumberOrUndefined = (value: string) => (value === "" ? undefined : Number(value));
const linesToArray = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
const arrayToLines = (value?: string[]) => (value ?? []).join("\n");

const PropertyForm = ({ propertyId }: { propertyId?: string }) => {
    const router = useRouter();
    const isEdit = Boolean(propertyId);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const [form, setForm] = useState<FormState>(initialForm);
    const [configurations, setConfigurations] = useState<ConfigurationRow[]>([]);
    const [faqs, setFaqs] = useState<FaqRow[]>([]);

    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>("");
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<GalleryImage[]>([]);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    const [floorPlanImages, setFloorPlanImages] = useState<GalleryImage[]>([]);
    const floorPlanImagesInputRef = useRef<HTMLInputElement>(null);

    const [brochureFile, setBrochureFile] = useState<File | null>(null);
    const [brochureName, setBrochureName] = useState<string>("");
    const brochureInputRef = useRef<HTMLInputElement>(null);

    const [optionsLoading, setOptionsLoading] = useState(true);
    const [categories, setCategories] = useState<Option[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategoryOption[]>([]);
    const [listingTypes, setListingTypes] = useState<Option[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<Option[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setOptionsLoading(true);
                const [categoryRes, subcategoryRes, listingTypeRes, propertyTypeRes] = await Promise.all([
                    axios.get("/api/admin/category", { withCredentials: true }),
                    axios.get("/api/admin/subcategory", { withCredentials: true }),
                    axios.get("/api/admin/listingtype", { withCredentials: true }),
                    axios.get("/api/admin/propertytype", { withCredentials: true }),
                ]);
                if (categoryRes?.data?.success) {
                    setCategories((categoryRes.data.categories as Option[]).filter((item) => item.isActive));
                }
                if (subcategoryRes?.data?.success) {
                    setSubcategories(subcategoryRes.data.subcategories as SubCategoryOption[]);
                }
                if (listingTypeRes?.data?.success) {
                    setListingTypes((listingTypeRes.data.listingTypes as Option[]).filter((item) => item.isActive));
                }
                if (propertyTypeRes?.data?.success) {
                    setPropertyTypes((propertyTypeRes.data.propertyTypes as Option[]).filter((item) => item.isActive));
                }
            } catch (error) {
                const err = error as AxiosError<{ message?: string }>;
                const message = err.response?.data?.message || err.message || "Something went wrong";
                toast.error(message);
            } finally {
                setOptionsLoading(false);
            }
        }

        fetchOptions();
    }, [])

    useEffect(() => {
        if (!propertyId) return;

        const fetchProperty = async () => {
            try {
                setInitialLoading(true);
                const response = await axios.get(`/api/admin/property/${propertyId}`, { withCredentials: true })
                if (response?.data?.success) {
                    const property = response.data.property;
                    setForm({
                        title: property.title ?? "",
                        slug: property.slug ?? "",
                        category: property.category?._id ?? property.category ?? "",
                        subcategory: property.subcategory?._id ?? property.subcategory ?? "",
                        description: property.description ?? "",
                        shortDescription: property.shortDescription ?? "",
                        metaTitle: property.metaTitle ?? "",
                        metaDescription: property.metaDescription ?? "",
                        listingType: property.listingType?._id ?? property.listingType ?? "",
                        propertyType: property.propertyType?._id ?? property.propertyType ?? "",
                        propertyStatus: property.propertyStatus ?? "",
                        price: property.price?.toString() ?? "",
                        pricePerUnitArea: property.pricePerUnitArea?.toString() ?? "",
                        priceLabel: property.priceLabel ?? "",
                        bedrooms: property.bedrooms?.toString() ?? "",
                        bathrooms: property.bathrooms?.toString() ?? "",
                        balconies: property.balconies?.toString() ?? "",
                        garages: property.garages?.toString() ?? "",
                        areaValue: property.area?.value?.toString() ?? "",
                        areaUnit: property.area?.unit ?? "sqft",
                        address: property.address?.address ?? "",
                        landmark: property.address?.landmark ?? "",
                        city: property.address?.city ?? "",
                        state: property.address?.state ?? "",
                        country: property.address?.country ?? "India",
                        pincode: property.address?.pincode ?? "",
                        longitude: property.location?.coordinates?.[0]?.toString() ?? "",
                        latitude: property.location?.coordinates?.[1]?.toString() ?? "",
                        developer: property.developer ?? "",
                        reraNumber: property.reraNumber ?? "",
                        projectArea: property.projectArea ?? "",
                        totalUnits: property.totalUnits?.toString() ?? "",
                        totalTowers: property.totalTowers?.toString() ?? "",
                        possessionDate: property.possessionDate ? property.possessionDate.slice(0, 10) : "",
                        videoUrl: property.videoUrl ?? "",
                        amenities: arrayToLines(property.amenities),
                        highlights: arrayToLines(property.highlights),
                        contactName: property.contactName ?? "",
                        contactPhone: property.contactPhone ?? "",
                        isFeatured: property.isFeatured ?? false,
                        isActive: property.isActive ?? true,
                    })
                    setCoverImagePreview(property.coverImage ?? "");
                    setImages(
                        (property.images ?? []).map((url: string, index: number) => ({ id: `existing-${index}-${url}`, url }))
                    )
                    setFloorPlanImages(
                        (property.floorPlanImages ?? []).map((url: string, index: number) => ({ id: `existing-${index}-${url}`, url }))
                    )
                    setBrochureName(property.brochureUrl ?? "");
                    setConfigurations(
                        (property.configurations ?? []).map((configuration: { type?: string; superArea?: number; carpetArea?: number; price?: number }) => ({
                            type: configuration.type ?? "",
                            superArea: configuration.superArea?.toString() ?? "",
                            carpetArea: configuration.carpetArea?.toString() ?? "",
                            price: configuration.price?.toString() ?? "",
                        }))
                    )
                    setFaqs(
                        (property.faqs ?? []).map((faq: { question?: string; answer?: string }) => ({
                            question: faq.question ?? "",
                            answer: faq.answer ?? "",
                        }))
                    )
                }
            } catch (error) {
                const err = error as AxiosError<{ message?: string }>;
                const message = err.response?.data?.message || err.message || "Something went wrong";
                toast.error(message);
            } finally {
                setInitialLoading(false);
            }
        }

        fetchProperty();
    }, [propertyId])

    const filteredSubcategories = subcategories.filter((subcategory) => {
        const subcategoryCategoryId = typeof subcategory.category === "string" ? subcategory.category : subcategory.category?._id;
        return subcategoryCategoryId === form.category;
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target;

        if (field === "title") {
            setForm((prev) => ({
                ...prev,
                title: value,
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

    const handleConfigurationChange = (index: number, field: keyof ConfigurationRow, value: string) => {
        setConfigurations((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
    }

    const handleFaqChange = (index: number, field: keyof FaqRow, value: string) => {
        setFaqs((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
    }

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setCoverImageFile(file);
        if (file) {
            setCoverImagePreview(URL.createObjectURL(file));
        }
    }

    const removeCoverImage = () => {
        setCoverImageFile(null);
        setCoverImagePreview("");
        if (coverImageInputRef.current) {
            coverImageInputRef.current.value = "";
        }
    }

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setImages((prev) => [
            ...prev,
            ...files.map((file) => ({ id: `${Date.now()}-${file.name}`, url: URL.createObjectURL(file), file })),
        ])
        e.target.value = "";
    }

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((image) => image.id !== id))
    }

    const handleFloorPlanImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setFloorPlanImages((prev) => [
            ...prev,
            ...files.map((file) => ({ id: `${Date.now()}-${file.name}`, url: URL.createObjectURL(file), file })),
        ])
        e.target.value = "";
    }

    const removeFloorPlanImage = (id: string) => {
        setFloorPlanImages((prev) => prev.filter((image) => image.id !== id))
    }

    const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setBrochureFile(file);
        if (file) {
            setBrochureName(file.name);
        }
    }

    const removeBrochure = () => {
        setBrochureFile(null);
        setBrochureName("");
        if (brochureInputRef.current) {
            brochureInputRef.current.value = "";
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);

            const payload = {
                title: form.title,
                slug: form.slug,
                category: form.category,
                subcategory: form.subcategory || undefined,
                description: form.description,
                shortDescription: form.shortDescription || undefined,
                metaTitle: form.metaTitle || undefined,
                metaDescription: form.metaDescription || undefined,
                listingType: form.listingType,
                propertyType: form.propertyType,
                propertyStatus: form.propertyStatus || undefined,
                price: toNumberOrUndefined(form.price),
                pricePerUnitArea: toNumberOrUndefined(form.pricePerUnitArea),
                priceLabel: form.priceLabel || undefined,
                bedrooms: toNumberOrUndefined(form.bedrooms),
                bathrooms: toNumberOrUndefined(form.bathrooms),
                balconies: toNumberOrUndefined(form.balconies),
                garages: toNumberOrUndefined(form.garages),
                area: form.areaValue ? { value: toNumberOrUndefined(form.areaValue), unit: form.areaUnit } : undefined,
                configurations: configurations
                    .filter((row) => row.type || row.superArea || row.carpetArea || row.price)
                    .map((row) => ({
                        type: row.type || undefined,
                        superArea: toNumberOrUndefined(row.superArea),
                        carpetArea: toNumberOrUndefined(row.carpetArea),
                        price: toNumberOrUndefined(row.price),
                    })),
                address: {
                    address: form.address || undefined,
                    landmark: form.landmark || undefined,
                    city: form.city,
                    state: form.state,
                    country: form.country || "India",
                    pincode: form.pincode || undefined,
                },
                location: form.longitude && form.latitude
                    ? { type: "Point", coordinates: [Number(form.longitude), Number(form.latitude)] }
                    : undefined,
                developer: form.developer || undefined,
                reraNumber: form.reraNumber || undefined,
                projectArea: form.projectArea || undefined,
                totalUnits: toNumberOrUndefined(form.totalUnits),
                totalTowers: toNumberOrUndefined(form.totalTowers),
                possessionDate: form.possessionDate || undefined,
                coverImage: coverImageFile ? undefined : (coverImagePreview || undefined),
                images: images.filter((image) => !image.file).map((image) => image.url),
                floorPlanImages: floorPlanImages.filter((image) => !image.file).map((image) => image.url),
                videoUrl: form.videoUrl || undefined,
                brochureUrl: brochureFile ? undefined : (brochureName || undefined),
                amenities: linesToArray(form.amenities),
                highlights: linesToArray(form.highlights),
                faqs: faqs.filter((row) => row.question || row.answer),
                contactName: form.contactName || undefined,
                contactPhone: form.contactPhone || undefined,
                isFeatured: form.isFeatured,
                isActive: form.isActive,
            }

            const formData = new FormData();
            formData.append("data", JSON.stringify(payload));
            if (coverImageFile) {
                formData.append("coverImageFile", coverImageFile);
            }
            images.filter((image) => image.file).forEach((image) => {
                formData.append("imagesFiles", image.file as File);
            })
            floorPlanImages.filter((image) => image.file).forEach((image) => {
                formData.append("floorPlanImagesFiles", image.file as File);
            })
            if (brochureFile) {
                formData.append("brochureFile", brochureFile);
            }

            const response = isEdit
                ? await axios.patch(`/api/admin/property/${propertyId}`, formData, { withCredentials: true })
                : await axios.post("/api/admin/property", formData, { withCredentials: true })

            if (response?.data?.success) {
                toast.success(response?.data?.message)
                router.push("/admin/property/propertylisting")
            }
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return <div className="text-center text-muted-foreground py-10">Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-inter font-medium text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Field>
                            <Label htmlFor="title">Title<span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" value={form.title} onChange={handleChange} maxLength={150} placeholder="e.g. Sunrise Heights 2 BHK" required />
                        </Field>
                        <Field>
                            <Label htmlFor="slug">Slug<span className="text-red-500">*</span></Label>
                            <Input id="slug" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated-from-title" required />
                        </Field>
                        <Field>
                            <Label htmlFor="category">Category<span className="text-red-500">*</span></Label>
                            <Select
                                value={form.category}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value, subcategory: "" }))}
                            >
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder={optionsLoading ? "Loading..." : "Select a category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="subcategory">Subcategory</Label>
                            <Select
                                value={form.subcategory}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, subcategory: value }))}
                                disabled={!form.category}
                            >
                                <SelectTrigger id="subcategory" className="w-full">
                                    <SelectValue placeholder={!form.category ? "Select a category first" : "Select a subcategory"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredSubcategories.map((subcategory) => (
                                        <SelectItem key={subcategory._id} value={subcategory._id}>{subcategory.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                            <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Full description of the property" required />
                        </Field>
                        <Field>
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Textarea id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} maxLength={300} placeholder="Short teaser shown on listing cards" />
                        </Field>
                        <Field>
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Textarea id="metaTitle" name="metaTitle" value={form.metaTitle} onChange={handleChange} maxLength={70} placeholder="e.g. Sunrise Heights 2 BHK Flats in Whitefield | Prestige Group" />
                        </Field>
                        <Field>
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea id="metaDescription" name="metaDescription" value={form.metaDescription} onChange={handleChange} maxLength={160} placeholder="e.g. Book a 2 BHK at Sunrise Heights, Whitefield. RERA registered, ready to move, starting at 65 lakh." />
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Classification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="listingType">Listing Type<span className="text-red-500">*</span></Label>
                                <Select value={form.listingType} onValueChange={(value) => setForm((prev) => ({ ...prev, listingType: value }))}>
                                    <SelectTrigger id="listingType" className="w-full">
                                        <SelectValue placeholder={optionsLoading ? "Loading..." : "Select listing type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {listingTypes.map((listingType) => (
                                            <SelectItem key={listingType._id} value={listingType._id}>{listingType.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <Label htmlFor="propertyType">Property Type<span className="text-red-500">*</span></Label>
                                <Select value={form.propertyType} onValueChange={(value) => setForm((prev) => ({ ...prev, propertyType: value }))}>
                                    <SelectTrigger id="propertyType" className="w-full">
                                        <SelectValue placeholder={optionsLoading ? "Loading..." : "Select property type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((propertyType) => (
                                            <SelectItem key={propertyType._id} value={propertyType._id}>{propertyType.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <Label htmlFor="propertyStatus">Property Status</Label>
                                <Input id="propertyStatus" name="propertyStatus" value={form.propertyStatus} onChange={handleChange} placeholder="e.g. Ready to Move" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="price">Price<span className="text-red-500">*</span></Label>
                                <Input id="price" name="price" type="number" min={0} value={form.price} onChange={handleChange} placeholder="e.g. 5000000" required />
                            </Field>
                            <Field>
                                <Label htmlFor="pricePerUnitArea">Price Per Unit Area</Label>
                                <Input id="pricePerUnitArea" name="pricePerUnitArea" type="number" min={0} value={form.pricePerUnitArea} onChange={handleChange} placeholder="e.g. 5500" />
                            </Field>
                            <Field>
                                <Label htmlFor="priceLabel">Price Label</Label>
                                <Input id="priceLabel" name="priceLabel" value={form.priceLabel} onChange={handleChange} placeholder="e.g. Starting from" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Unit Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                <Input id="bedrooms" placeholder="e.g. 4" name="bedrooms" type="number" min={0} value={form.bedrooms} onChange={handleChange} />
                            </Field>
                            <Field>
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <Input id="bathrooms" placeholder="e.g. 2" name="bathrooms" type="number" min={0} value={form.bathrooms} onChange={handleChange} />
                            </Field>
                            <Field>
                                <Label htmlFor="balconies">Balconies</Label>
                                <Input id="balconies" placeholder="e.g. 1" name="balconies" type="number" min={0} value={form.balconies} onChange={handleChange} />
                            </Field>
                            <Field>
                                <Label htmlFor="garages">Garages</Label>
                                <Input id="garages" placeholder="e.g. 3" name="garages" type="number" min={0} value={form.garages} onChange={handleChange} />
                            </Field>
                            <Field>
                                <Label htmlFor="areaValue">Area</Label>
                                <Input id="areaValue" name="areaValue" type="number" min={0} value={form.areaValue} onChange={handleChange} placeholder="e.g. 1200" />
                            </Field>
                            <Field>
                                <Label htmlFor="areaUnit">Area Unit</Label>
                                <Select value={form.areaUnit} onValueChange={(value) => setForm((prev) => ({ ...prev, areaUnit: value }))}>
                                    <SelectTrigger id="areaUnit" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sqft">sqft</SelectItem>
                                        <SelectItem value="sqm">sqm</SelectItem>
                                        <SelectItem value="acre">acre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Unit Configurations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            {configurations.map((configuration, index) => (
                                <div key={index} className="flex items-end gap-2 rounded-lg border p-3">
                                    <Field className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Field>
                                            <Label>Type</Label>
                                            <Input value={configuration.type} onChange={(e) => handleConfigurationChange(index, "type", e.target.value)} placeholder="e.g. 2 BHK" />
                                        </Field>
                                        <Field>
                                            <Label>Super Area</Label>
                                            <Input type="number" min={0} value={configuration.superArea} onChange={(e) => handleConfigurationChange(index, "superArea", e.target.value)} placeholder="e.g. 1450" />
                                        </Field>
                                        <Field>
                                            <Label>Carpet Area</Label>
                                            <Input type="number" min={0} value={configuration.carpetArea} onChange={(e) => handleConfigurationChange(index, "carpetArea", e.target.value)} placeholder="e.g. 1100" />
                                        </Field>
                                        <Field>
                                            <Label>Price</Label>
                                            <Input type="number" min={0} value={configuration.price} onChange={(e) => handleConfigurationChange(index, "price", e.target.value)} placeholder="e.g. 6500000" />
                                        </Field>
                                    </Field>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setConfigurations((prev) => prev.filter((_, i) => i !== index))}>
                                        <Trash2 className="text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => setConfigurations((prev) => [...prev, { ...emptyConfiguration }])}>
                                <Plus /> Add Configuration
                            </Button>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Plot 12, MG Road" />
                            </Field>
                            <Field>
                                <Label htmlFor="landmark">Landmark</Label>
                                <Input id="landmark" name="landmark" value={form.landmark} onChange={handleChange} placeholder="e.g. Near City Mall" />
                            </Field>
                            <Field>
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="e.g. 560001" />
                            </Field>
                            <Field>
                                <Label htmlFor="city">City<span className="text-red-500">*</span></Label>
                                <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bengaluru" required />
                            </Field>
                            <Field>
                                <Label htmlFor="state">State<span className="text-red-500">*</span></Label>
                                <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Karnataka" required />
                            </Field>
                            <Field>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" value={form.country} onChange={handleChange} placeholder="e.g. India" />
                            </Field>
                            <Field>
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input id="longitude" name="longitude" type="number" value={form.longitude} onChange={handleChange} placeholder="e.g. 77.5946" />
                            </Field>
                            <Field>
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input id="latitude" name="latitude" type="number" value={form.latitude} onChange={handleChange} placeholder="e.g. 12.9716" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="developer">Developer</Label>
                                <Input id="developer" name="developer" value={form.developer} onChange={handleChange} placeholder="e.g. Prestige Group" />
                            </Field>
                            <Field>
                                <Label htmlFor="reraNumber">RERA Number</Label>
                                <Input id="reraNumber" name="reraNumber" value={form.reraNumber} onChange={handleChange} placeholder="e.g. PRM/KA/RERA/1251/2024" />
                            </Field>
                            <Field>
                                <Label htmlFor="projectArea">Project Area</Label>
                                <Input id="projectArea" name="projectArea" value={form.projectArea} onChange={handleChange} placeholder="e.g. 5 Acres" />
                            </Field>
                            <Field>
                                <Label htmlFor="totalUnits">Total Units</Label>
                                <Input id="totalUnits" name="totalUnits" type="number" min={0} value={form.totalUnits} onChange={handleChange} placeholder="e.g. 240" />
                            </Field>
                            <Field>
                                <Label htmlFor="totalTowers">Total Towers</Label>
                                <Input id="totalTowers" name="totalTowers" type="number" min={0} value={form.totalTowers} onChange={handleChange} placeholder="e.g. 4" />
                            </Field>
                            <Field>
                                <Label htmlFor="possessionDate">Possession Date</Label>
                                <Input id="possessionDate" name="possessionDate" type="date" value={form.possessionDate} onChange={handleChange} className="w-fit" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field>
                                <Label htmlFor="coverImage">Cover Image</Label>
                                <Input
                                    id="coverImage"
                                    ref={coverImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="hidden"
                                />
                                {coverImagePreview ? (
                                    <div className="relative w-fit">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={coverImagePreview} alt="Cover preview" className="h-32 w-48 rounded-lg border object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon-sm"
                                            className="absolute -top-2 -right-2 rounded-full"
                                            onClick={removeCoverImage}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" onClick={() => coverImageInputRef.current?.click()}>
                                        <Upload /> Upload Cover Image
                                    </Button>
                                )}
                            </Field>
                            <Field>
                                <Label htmlFor="brochureUrl">Brochure</Label>
                                <Input
                                    id="brochureUrl"
                                    ref={brochureInputRef}
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={handleBrochureChange}
                                    className="hidden"
                                />
                                {brochureName ? (
                                    <div className="flex w-fit items-center gap-2 rounded-lg border p-2 text-sm">
                                        <FileText className="size-4 text-muted-foreground" />
                                        <span className="max-w-48 truncate">{brochureName}</span>
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={removeBrochure}>
                                            <X />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" onClick={() => brochureInputRef.current?.click()}>
                                        <Upload /> Upload Brochure
                                    </Button>
                                )}
                            </Field>
                            <Field>
                                <Label htmlFor="images">Gallery Images<span className="text-muted-foreground font-normal"> (used in listing card carousels)</span></Label>
                                <Input
                                    id="images"
                                    ref={imagesInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    className="hidden"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={image.url} alt="Gallery" className="size-20 rounded-lg border object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon-sm"
                                                className="absolute -top-2 -right-2 rounded-full"
                                                onClick={() => removeImage(image.id)}
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="size-20 flex-col"
                                        onClick={() => imagesInputRef.current?.click()}
                                    >
                                        <Upload /> Add
                                    </Button>
                                </div>
                            </Field>
                            <Field>
                                <Label htmlFor="floorPlanImages">Floor Plan Images</Label>
                                <Input
                                    id="floorPlanImages"
                                    ref={floorPlanImagesInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFloorPlanImagesChange}
                                    className="hidden"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {floorPlanImages.map((image) => (
                                        <div key={image.id} className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={image.url} alt="Floor plan" className="size-20 rounded-lg border object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon-sm"
                                                className="absolute -top-2 -right-2 rounded-full"
                                                onClick={() => removeFloorPlanImage(image.id)}
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="size-20 flex-col"
                                        onClick={() => floorPlanImagesInputRef.current?.click()}
                                    >
                                        <Upload /> Add
                                    </Button>
                                </div>
                            </Field>
                            <Field>
                                <Label htmlFor="videoUrl">Video URL</Label>
                                <Input id="videoUrl" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://..." />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Marketing Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <Label htmlFor="amenities">Amenities</Label>
                                    <Textarea id="amenities" name="amenities" value={form.amenities} onChange={handleChange} placeholder="One amenity per line" />
                                </Field>
                                <Field>
                                    <Label htmlFor="highlights">Highlights</Label>
                                    <Textarea id="highlights" name="highlights" value={form.highlights} onChange={handleChange} placeholder="One highlight per line" />
                                </Field>
                            </Field>
                            <Field>
                                <Label>FAQs</Label>
                                {faqs.map((faq, index) => (
                                    <div key={index} className="flex items-end gap-2 rounded-lg border p-3">
                                        <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field>
                                                <Label>Question</Label>
                                                <Input value={faq.question} onChange={(e) => handleFaqChange(index, "question", e.target.value)} placeholder="e.g. Is the property RERA registered?" />
                                            </Field>
                                            <Field>
                                                <Label>Answer</Label>
                                                <Input value={faq.answer} onChange={(e) => handleFaqChange(index, "answer", e.target.value)} placeholder="e.g. Yes, RERA number is listed above." />
                                            </Field>
                                        </Field>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}>
                                            <Trash2 className="text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => setFaqs((prev) => [...prev, { ...emptyFaq }])}>
                                    <Plus /> Add FAQ
                                </Button>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-inter font-medium text-lg">Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="contactName">Contact Name</Label>
                                <Input id="contactName" name="contactName" value={form.contactName} onChange={handleChange} placeholder="e.g. Rohan Mehta" />
                            </Field>
                            <Field>
                                <Label htmlFor="contactPhone">Contact Phone</Label>
                                <Input id="contactPhone" name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle  className="font-inter font-medium text-lg">Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field orientation="horizontal">
                                <Checkbox id="isFeatured" checked={form.isFeatured} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked === true }))} />
                                <Label htmlFor="isFeatured">Featured</Label>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="isActive" checked={form.isActive} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked === true }))} />
                                <Label htmlFor="isActive">{form.isActive ? "Active" : "Inactive"}</Label>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" disabled={loading} onClick={() => router.push("/admin/property/propertylisting")}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || optionsLoading}>
                    {loading ?
                        <>
                            <Loader2 className="animate-spin" />
                            {isEdit ? "Saving..." : "Adding..."}
                        </> :
                        isEdit ? "Save Changes" : "Add Property"
                    }
                </Button>
            </div>
        </form>
    )
}

export default PropertyForm

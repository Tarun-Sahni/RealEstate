import imagekit from "@/lib/imagekit";

const uploadFile = async (file: File, folder: string) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${file.name}`,
        folder,
    });
    return uploadResponse.url;
};

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

// Mutates `body` in place: replaces/extends coverImage, images, floorPlanImages and
// brochureUrl with ImageKit URLs for any files present in the request's formData.
export async function applyPropertyMediaUploads(formData: FormData, body: Record<string, unknown>) {
    const coverImageFile = formData.get("coverImageFile");
    if (isUploadedFile(coverImageFile)) {
        body.coverImage = await uploadFile(coverImageFile, "/properties/cover");
    }

    const imageFiles = formData.getAll("imagesFiles").filter(isUploadedFile);
    if (imageFiles.length) {
        const uploadedUrls = await Promise.all(imageFiles.map((file) => uploadFile(file, "/properties/gallery")));
        body.images = [...(Array.isArray(body.images) ? body.images : []), ...uploadedUrls];
    }

    const floorPlanFiles = formData.getAll("floorPlanImagesFiles").filter(isUploadedFile);
    if (floorPlanFiles.length) {
        const uploadedUrls = await Promise.all(floorPlanFiles.map((file) => uploadFile(file, "/properties/floorplans")));
        body.floorPlanImages = [...(Array.isArray(body.floorPlanImages) ? body.floorPlanImages : []), ...uploadedUrls];
    }

    const brochureFile = formData.get("brochureFile");
    if (isUploadedFile(brochureFile)) {
        body.brochureUrl = await uploadFile(brochureFile, "/properties/brochures");
    }

    return body;
}

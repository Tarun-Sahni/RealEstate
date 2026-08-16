import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { Testimonial } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

const uploadPhoto = async (file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${file.name}`,
        folder: "/testimonials",
    });
    return { url: uploadResponse.url, fileId: uploadResponse.fileId };
};

const deletePhoto = async (fileId?: string) => {
    if (!fileId) return;
    try {
        await imagekit.deleteFile(fileId);
    } catch {
        // Best-effort cleanup — don't fail the request if ImageKit deletion fails.
    }
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ testimonialid: string }> }) {
    try {
        const { testimonialid } = await params;
        if (!testimonialid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const formData = await request.formData();
        const dataRaw = formData.get("data");
        if (!dataRaw) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { name, designation, rating, message, isActive } = JSON.parse(dataRaw.toString());
        const ratingNumber = Number(rating);
        if (!name || !designation || !message || !ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();
        const admin = await getAdminUser(request);
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        const update: Record<string, unknown> = {
            name,
            designation,
            rating: ratingNumber,
            message,
            isActive: Boolean(isActive),
        };

        const photoFile = formData.get("photoFile");
        let previousPhotoFileId: string | undefined;
        if (isUploadedFile(photoFile)) {
            const existing = await Testimonial.findById(testimonialid);
            previousPhotoFileId = existing?.photoFileId;
            const { url, fileId } = await uploadPhoto(photoFile);
            update.photo = url;
            update.photoFileId = fileId;
        }

        const testimonial = await Testimonial.findByIdAndUpdate(testimonialid, update, {
            new: true,
            runValidators: true,
        });
        if (!testimonial) {
            return NextResponse.json({
                success: false,
                message: "Testimonial not found."
            }, { status: 404 })
        }

        if (previousPhotoFileId) {
            await deletePhoto(previousPhotoFileId);
        }

        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Testimonial updated successfully.",
            testimonial
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ testimonialid: string }> }) {
    try {
        const { testimonialid } = await params;
        if (!testimonialid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();
        const admin = await getAdminUser(request);
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        const testimonial = await Testimonial.findByIdAndDelete(testimonialid);
        if (!testimonial) {
            return NextResponse.json({
                success: false,
                message: "Testimonial not found."
            }, { status: 404 })
        }

        await deletePhoto(testimonial.photoFileId);

        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Testimonial deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

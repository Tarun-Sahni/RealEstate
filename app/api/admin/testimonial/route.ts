import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { Testimonial } from "@/models";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const dataRaw = formData.get("data");
        if (!dataRaw) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { name, designation, rating, message } = JSON.parse(dataRaw.toString());
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

        const photoFile = formData.get("photoFile");
        let photo = "";
        let photoFileId: string | undefined;
        if (isUploadedFile(photoFile)) {
            const uploaded = await uploadPhoto(photoFile);
            photo = uploaded.url;
            photoFileId = uploaded.fileId;
        }

        const testimonial = await Testimonial.create({
            name,
            designation,
            rating: ratingNumber,
            message,
            photo,
            photoFileId,
        });

        return NextResponse.json({
            success: true,
            message: "Testimonial added successfully.",
            testimonial
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const admin = await getAdminUser(request);
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [testimonials, total] = await Promise.all([
            Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Testimonial.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Testimonials fetched successfully.",
            testimonials,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

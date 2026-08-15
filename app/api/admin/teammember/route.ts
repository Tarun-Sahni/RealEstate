import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { TeamMember } from "@/models";
import { NextRequest, NextResponse } from "next/server";

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

const uploadPhoto = async (file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${file.name}`,
        folder: "/team",
    });
    return uploadResponse.url;
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

        const { name, designation } = JSON.parse(dataRaw.toString());
        const photoFile = formData.get("photoFile");
        if (!name || !designation || !isUploadedFile(photoFile)) {
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

        const photo = await uploadPhoto(photoFile);
        const teamMember = await TeamMember.create({ name, designation, photo });

        return NextResponse.json({
            success: true,
            message: "Team member added successfully.",
            teamMember
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

        const [teamMembers, total] = await Promise.all([
            TeamMember.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            TeamMember.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Team members fetched successfully.",
            teamMembers,
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

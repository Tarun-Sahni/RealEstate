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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ teammemberid: string }> }) {
    try {
        const { teammemberid } = await params;
        if (!teammemberid) {
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

        const { name, designation, isActive } = JSON.parse(dataRaw.toString());
        if (!name || !designation) {
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

        const update: Record<string, unknown> = { name, designation, isActive: Boolean(isActive) };

        const photoFile = formData.get("photoFile");
        if (isUploadedFile(photoFile)) {
            update.photo = await uploadPhoto(photoFile);
        }

        const teamMember = await TeamMember.findByIdAndUpdate(teammemberid, update, {
            new: true,
            runValidators: true,
        });
        if (!teamMember) {
            return NextResponse.json({
                success: false,
                message: "Team member not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Team member updated successfully.",
            teamMember
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ teammemberid: string }> }) {
    try {
        const { teammemberid } = await params;
        if (!teammemberid) {
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

        const teamMember = await TeamMember.findByIdAndDelete(teammemberid);
        if (!teamMember) {
            return NextResponse.json({
                success: false,
                message: "Team member not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Team member deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

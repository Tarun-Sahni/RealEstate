import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { TeamMember } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

const uploadPhoto = async (file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${file.name}`,
        folder: "/team",
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
        let previousPhotoFileId: string | undefined;
        if (isUploadedFile(photoFile)) {
            const existing = await TeamMember.findById(teammemberid);
            previousPhotoFileId = existing?.photoFileId;
            const { url, fileId } = await uploadPhoto(photoFile);
            update.photo = url;
            update.photoFileId = fileId;
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

        if (previousPhotoFileId) {
            await deletePhoto(previousPhotoFileId);
        }

        revalidatePath("/", "layout");

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

        await deletePhoto(teamMember.photoFileId);

        revalidatePath("/", "layout");

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

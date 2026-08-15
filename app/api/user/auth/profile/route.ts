import connectDB from "@/lib/database";
import { getAuthUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

const uploadAvatar = async (file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${file.name}`,
        folder: "/avatars",
    });
    return uploadResponse.url;
};

export async function PATCH(request: NextRequest) {
    try {
        const formData = await request.formData();
        const dataRaw = formData.get("data");
        if (!dataRaw) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { username } = JSON.parse(dataRaw.toString());
        if (!username || username.trim().length < 3) {
            return NextResponse.json({
                success: false,
                message: "Username must be at least 3 characters."
            }, { status: 400 })
        }

        await connectDB();
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        const update: Record<string, unknown> = { username: username.trim().toLowerCase() };

        const avatarFile = formData.get("avatarFile");
        if (isUploadedFile(avatarFile)) {
            if (!avatarFile.type.startsWith("image/")) {
                return NextResponse.json({
                    success: false,
                    message: "Avatar must be an image file."
                }, { status: 400 })
            }
            if (avatarFile.size > MAX_AVATAR_SIZE) {
                return NextResponse.json({
                    success: false,
                    message: "Avatar image must be smaller than 5MB."
                }, { status: 400 })
            }
            update.avatar = await uploadAvatar(avatarFile);
        }

        const updatedUser = await User.findByIdAndUpdate(authUser._id, update, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                userId: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            }
        }, { status: 200 })
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: "That username is already taken."
            }, { status: 409 })
        }
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

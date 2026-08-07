import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    try {
        const { userid } = await params;
        if (!userid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const formData = await request.formData();
        const username = formData.get("username")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const role = formData.get("role")?.toString();
        const isVerified = formData.get("isVerified")?.toString() === "true";
        const isActive = formData.get("isActive")?.toString() === "true";
        const loginAttemptsRaw = formData.get("loginAttempts")?.toString();
        const lockOutExpiresRaw = formData.get("lockOutExpires")?.toString();
        const existingAvatar = formData.get("avatar")?.toString() ?? "";
        const avatarFile = formData.get("avatarFile");

        if (!username || !email) {
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

        let avatar = existingAvatar;
        if (avatarFile instanceof File && avatarFile.size > 0) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${Date.now()}-${avatarFile.name}`,
                folder: "/users/avatars",
            });
            avatar = uploadResponse.url;
        }

        const update: Record<string, unknown> = {
            username,
            email,
            avatar,
            isVerified,
            isActive,
            loginAttempts: loginAttemptsRaw && !Number.isNaN(Number(loginAttemptsRaw)) ? Number(loginAttemptsRaw) : 0,
            lockOutExpires: lockOutExpiresRaw ? new Date(lockOutExpiresRaw) : null,
        };

        if (role === "USER" || role === "ADMIN") {
            update.role = role;
        }

        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findOneAndUpdate(
            { _id: userid, role: { $ne: "ADMIN" } },
            update,
            { new: true, runValidators: true }
        );
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found."
            }, { status: 404 })
        }

        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json({
            success: true,
            message: "User updated successfully.",
            user: userObject
        }, { status: 200 })
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: "Username or email is already in use."
            }, { status: 409 })
        }
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    try {
        const { userid } = await params;
        if (!userid) {
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

        const user = await User.findOneAndDelete({ _id: userid, role: { $ne: "ADMIN" } });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

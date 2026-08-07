import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import imagekit from "@/lib/imagekit";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const username = formData.get("username")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const isVerified = formData.get("isVerified")?.toString() === "true";
        const isActive = formData.get("isActive")?.toString() === "true";
        const avatarFile = formData.get("avatar");

        if (!username || !email || !password) {
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

        let avatar = "";
        if (avatarFile instanceof File && avatarFile.size > 0) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${Date.now()}-${avatarFile.name}`,
                folder: "/users/avatars",
            });
            avatar = uploadResponse.url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            isVerified,
            isActive,
        });

        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json({
            success: true,
            message: "User created successfully.",
            user: userObject
        }, { status: 201 })
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

        const users = await User.find({ role: { $ne: "ADMIN" } }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Users fetched successfully.",
            users
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

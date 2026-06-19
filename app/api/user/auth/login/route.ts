import connectDB from "@/lib/database";
import { createToken } from "@/lib/jwt";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { identifier, password, rememberme } = await request.json()
        if (!identifier || !password) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select("+password")
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials."
            }, { status: 400 })
        }

        if (!user?.isVerified) {
            return NextResponse.json({
                success: false,
                message: "Please verify your email first.",
            }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password)
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials."
            }, { status: 400 })
        }

        const token = createToken(user?._id, rememberme)
        const response = NextResponse.json({
            success: true,
            message: "Loggedin Successfully."
        }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: rememberme ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
        });
        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}
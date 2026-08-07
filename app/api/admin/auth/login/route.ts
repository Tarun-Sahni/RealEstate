import connectDB from "@/lib/database";
import { createToken } from "@/lib/jwt";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password")
        if (!user || user?.role !== "ADMIN") {
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials."
            }, { status: 400 })
        }

        const now = new Date();
        if (user?.lockOutExpires && user?.lockOutExpires > now) {
            return NextResponse.json({
                success: false,
                message: "Account locked due to multiple failed login attempts. Please try again later."
            }, { status: 423 })
        }

        if (user.lockOutExpires && user.lockOutExpires <= now) {
            user.loginAttempts = 0;
            user.lockOutExpires = null;
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password)
        if (!isPasswordValid) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockOutExpires = new Date(now.getTime() + LOCKOUT_DURATION_MS);
                user.loginAttempts = 0;
            }
            await user.save();
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials."
            }, { status: 400 })
        }

        user.loginAttempts = 0;
        user.lockOutExpires = null;
        await user.save();

        const token = createToken(user?._id)
        const response = NextResponse.json({
            success: true,
            message: "Loggedin Successfully."
        }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
        });
        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

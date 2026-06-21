import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import { User } from "@/models";

export async function POST(request: NextRequest) {
    try {
        const { password, token } = await request.json();
        if (!password || !token) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fiels."
            }, { status: 400 })
        }

        await connectDB();
        const user = await User.findOne({ passwordResetToken: token })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid Token"
            }, { status: 400 })
        }

        if (user.passwordResetExpires < new Date()) {
            return NextResponse.json({
                success: false,
                messae: "Token is Expired"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password Reset Successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}
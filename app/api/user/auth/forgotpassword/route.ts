import connectDB from "@/lib/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
    try {
        const { identifier } = await request.json();
        await connectDB();
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] })
        if (!user) {
            return NextResponse.json({
                success: true,
                message: "If the email or username is correct, an email will be sent to you."
            }, { status: 200 })
        }
        const passwordResetToken = crypto.randomBytes(32).toString("hex");

        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000 
        await user.save()

        await sendResetPasswordEmail(user.email, passwordResetToken);

        return NextResponse.json({
            success: true,
            message: "If the email or username is correct, an email will be sent to you."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}
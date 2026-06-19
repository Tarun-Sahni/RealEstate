import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import { User } from "@/models";
import { sendVerificationEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }
        await connectDB();
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })

        // if user exists but not verified
        if (existingUser && !existingUser?.isVerified) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString("hex");
            existingUser.password = hashedPassword;
            existingUser.verificationToken = verificationToken;
            existingUser.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
            await existingUser.save();
            await sendVerificationEmail(existingUser.email, verificationToken);
            return NextResponse.json({
                success: true,
                message: "Please check your email to verify your account.",
            }, { status: 201 });

        }

        // if user exists and also verified
        if (existingUser && existingUser?.isVerified) {
            return NextResponse.json({
                success: false,
                message: "User Already Exists with this Email or Username"
            }, { status: 400 })
        }

        // if user doesnt exists
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Save User to DB
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            isActive: true
        })

        // Send Email
        await sendVerificationEmail(newUser.email, verificationToken);
        return NextResponse.json({
            success: true,
            message: "Please check your email to verify your account.",
        }, { status: 201 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}
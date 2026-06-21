import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/models";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string; }> }) {
    try {
        const { token } = await params;
        
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Invalid Token"
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

        // user.passwordResetToken = null;
        // user.passwordResetExpires = null;
        // await user.save();
        return NextResponse.json({
            success: true,
            message: "Password Reset Successfully.",
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        },{status:500});
    }
}
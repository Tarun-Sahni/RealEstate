import connectDB from "@/lib/database";
import { getAuthUser } from "@/lib/dal";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        const { currentPassword, newPassword } = await request.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return NextResponse.json({
                success: false,
                message: "New password must be at least 8 characters."
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

        const user = await User.findById(authUser._id).select("+password");
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Current password is incorrect."
            }, { status: 400 })
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password changed successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

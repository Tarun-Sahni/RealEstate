import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { ContactUs } from "@/models";
import { NextRequest, NextResponse } from "next/server";

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

        const inquiries = await ContactUs.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Inquiries fetched successfully.",
            inquiries
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

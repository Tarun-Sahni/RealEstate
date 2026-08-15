import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { VisitBooking } from "@/models";
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

        const bookings = await VisitBooking.find()
            .populate("property", "title slug")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Tour requests fetched successfully.",
            bookings
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { VisitBooking } from "@/models";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "COMPLETED"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ bookingid: string }> }) {
    try {
        const { bookingid } = await params;
        if (!bookingid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { status } = await request.json();
        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({
                success: false,
                message: "Invalid status."
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

        const booking = await VisitBooking.findByIdAndUpdate(bookingid, { status }, {
            new: true,
            runValidators: true,
        });
        if (!booking) {
            return NextResponse.json({
                success: false,
                message: "Tour request not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: status === "COMPLETED" ? "Tour marked as completed." : "Tour marked as pending.",
            booking
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ bookingid: string }> }) {
    try {
        const { bookingid } = await params;
        if (!bookingid) {
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

        const booking = await VisitBooking.findByIdAndDelete(bookingid);
        if (!booking) {
            return NextResponse.json({
                success: false,
                message: "Tour request not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Tour request deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

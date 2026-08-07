import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { ListingType } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ listingtypeid: string }> }) {
    try {
        const { listingtypeid } = await params;
        if (!listingtypeid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { name, isActive } = await request.json()
        if (!name) {
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

        const listingType = await ListingType.findByIdAndUpdate(
            listingtypeid,
            { name, isActive: Boolean(isActive) },
            { new: true, runValidators: true }
        );
        if (!listingType) {
            return NextResponse.json({
                success: false,
                message: "Listing type not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Listing type updated successfully.",
            listingType
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ listingtypeid: string }> }) {
    try {
        const { listingtypeid } = await params;
        if (!listingtypeid) {
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

        const listingType = await ListingType.findByIdAndDelete(listingtypeid);
        if (!listingType) {
            return NextResponse.json({
                success: false,
                message: "Listing type not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Listing type deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

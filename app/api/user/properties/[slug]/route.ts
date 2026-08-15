import connectDB from "@/lib/database";
import { Property } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        if (!slug) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();

        // Atomic increment avoids a separate read-then-write round trip.
        const property = await Property.findOneAndUpdate(
            { slug, isActive: true },
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate("category", "name slug")
            .populate("subcategory", "name slug")
            .populate("listingType", "name")
            .populate("propertyType", "name")
            .lean();

        if (!property) {
            return NextResponse.json({
                success: false,
                message: "Property not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Property fetched successfully.",
            property
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

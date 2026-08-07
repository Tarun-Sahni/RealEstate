import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { ListingType } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
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

        const listingType = await ListingType.create({
            name,
            isActive,
        });

        return NextResponse.json({
            success: true,
            message: "Listing type created successfully.",
            listingType
        }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

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

        const listingTypes = await ListingType.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Listing types fetched successfully.",
            listingTypes
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

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

        // Pagination is opt-in via `page` so existing callers that need the full
        // unpaginated list (e.g. the property form's listing type dropdown) keep working.
        const searchParams = request.nextUrl.searchParams;
        const paginate = searchParams.has("page");

        if (!paginate) {
            const listingTypes = await ListingType.find().sort({ createdAt: -1 });
            return NextResponse.json({
                success: true,
                message: "Listing types fetched successfully.",
                listingTypes
            }, { status: 200 })
        }

        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [listingTypes, total] = await Promise.all([
            ListingType.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            ListingType.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Listing types fetched successfully.",
            listingTypes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

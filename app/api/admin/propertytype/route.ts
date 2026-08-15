import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { PropertyType } from "@/models";
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

        const propertyType = await PropertyType.create({
            name,
            isActive,
        });

        return NextResponse.json({
            success: true,
            message: "Property type created successfully.",
            propertyType
        }, { status: 201 })
    } catch (error) {
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
        // unpaginated list (e.g. the property form's property type dropdown) keep working.
        const searchParams = request.nextUrl.searchParams;
        const paginate = searchParams.has("page");

        if (!paginate) {
            const propertyTypes = await PropertyType.find().sort({ createdAt: -1 });
            return NextResponse.json({
                success: true,
                message: "Property types fetched successfully.",
                propertyTypes
            }, { status: 200 })
        }

        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [propertyTypes, total] = await Promise.all([
            PropertyType.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            PropertyType.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Property types fetched successfully.",
            propertyTypes,
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

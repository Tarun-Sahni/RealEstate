import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { applyPropertyMediaUploads } from "@/lib/property-media";
import { Property } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const dataRaw = formData.get("data");
        if (!dataRaw) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const body = JSON.parse(dataRaw.toString());
        const { title, slug, category, description, listingType, propertyType, price, address } = body;

        if (!title || !slug || !category || !description || !listingType || !propertyType || !price || !address?.city || !address?.state) {
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

        await applyPropertyMediaUploads(formData, body);

        const property = await Property.create(body);

        return NextResponse.json({
            success: true,
            message: "Property created successfully.",
            property
        }, { status: 201 })
    } catch (error) {
        console.error(error)
        if (error instanceof Error && "code" in error && error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: "A property with this slug already exists."
            }, { status: 409 })
        }
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

        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [properties, total] = await Promise.all([
            Property.find()
                .populate("category", "name slug")
                .populate("subcategory", "name slug")
                .populate("listingType", "name")
                .populate("propertyType", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Property.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Properties fetched successfully.",
            properties,
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

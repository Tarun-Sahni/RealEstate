import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { Property } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
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

        const property = await Property.create(body);

        return NextResponse.json({
            success: true,
            message: "Property created successfully.",
            property
        }, { status: 201 })
    } catch (error) {
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

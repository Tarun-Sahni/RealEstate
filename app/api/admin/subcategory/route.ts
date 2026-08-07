import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { category, name, slug, description, metaTitle, metaDescription } = await request.json()
        if (!category || !name || !slug) {
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

        const subcategory = await SubCategory.create({
            category,
            name,
            slug,
            description,
            metaTitle,
            metaDescription,
        });

        return NextResponse.json({
            success: true,
            message: "Subcategory created successfully.",
            subcategory
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

        const subcategories = await SubCategory.find()
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Subcategories fetched successfully.",
            subcategories
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

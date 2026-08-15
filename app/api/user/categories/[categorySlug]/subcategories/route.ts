import connectDB from "@/lib/database";
import { Category, SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ categorySlug: string }> }) {
    try {
        const { categorySlug } = await params;
        if (!categorySlug) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();

        const category = await Category.findOne({ slug: categorySlug, isActive: true })
            .select("name slug")
            .lean();

        if (!category) {
            return NextResponse.json({
                success: false,
                message: "Category not found."
            }, { status: 404 })
        }

        const subcategories = await SubCategory.find({ category: category._id, isActive: true })
            .select("name slug description metaTitle metaDescription")
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            message: "Subcategories fetched successfully.",
            category,
            subcategories
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

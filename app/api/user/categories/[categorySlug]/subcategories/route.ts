import { getPublicSubcategories } from "@/lib/queries/properties";
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

        const result = await getPublicSubcategories(categorySlug);
        if (!result) {
            return NextResponse.json({
                success: false,
                message: "Category not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Subcategories fetched successfully.",
            category: result.category,
            subcategories: result.subcategories
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

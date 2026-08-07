import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ subcategoryid: string }> }) {
    try {
        const { subcategoryid } = await params;
        if (!subcategoryid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { category, name, slug, description, metaTitle, metaDescription, isActive } = await request.json()
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

        const subcategory = await SubCategory.findByIdAndUpdate(
            subcategoryid,
            { category, name, slug, description, metaTitle, metaDescription, isActive: Boolean(isActive) },
            { new: true, runValidators: true }
        );
        if (!subcategory) {
            return NextResponse.json({
                success: false,
                message: "Subcategory not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Subcategory updated successfully.",
            subcategory
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ subcategoryid: string }> }) {
    try {
        const { subcategoryid } = await params;
        if (!subcategoryid) {
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

        const subcategory = await SubCategory.findByIdAndDelete(subcategoryid);
        if (!subcategory) {
            return NextResponse.json({
                success: false,
                message: "Subcategory not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Subcategory deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

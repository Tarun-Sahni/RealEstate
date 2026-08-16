import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { Property, SubCategory } from "@/models";
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

        // Deactivating a subcategory hides every property under it too. Reactivating it
        // does NOT auto-reactivate those properties — admins re-enable those explicitly.
        if (!subcategory.isActive) {
            await Property.updateMany({ subcategory: subcategoryid }, { isActive: false });
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

        const subcategory = await SubCategory.findById(subcategoryid);
        if (!subcategory) {
            return NextResponse.json({
                success: false,
                message: "Subcategory not found."
            }, { status: 404 })
        }

        // Cascade: every property under this subcategory goes with it.
        await Property.deleteMany({ subcategory: subcategoryid });
        await subcategory.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Subcategory deleted successfully, along with its properties."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

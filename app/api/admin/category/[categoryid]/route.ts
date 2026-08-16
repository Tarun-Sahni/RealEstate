import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { Category, Property, SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ categoryid: string }> }) {
    try {
        const { categoryid } = await params;
        if (!categoryid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const { name, slug, description, metaTitle, metaDescription, isActive } = await request.json()
        if (!name || !slug) {
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

        const category = await Category.findByIdAndUpdate(
            categoryid,
            { name, slug, description, metaTitle, metaDescription, isActive: Boolean(isActive) },
            { new: true, runValidators: true }
        );
        if (!category) {
            return NextResponse.json({
                success: false,
                message: "Category not found."
            }, { status: 404 })
        }

        // Deactivating a category hides everything under it too. Reactivating it does
        // NOT auto-reactivate children — admins re-enable those explicitly.
        if (!category.isActive) {
            await SubCategory.updateMany({ category: categoryid }, { isActive: false });
            await Property.updateMany({ category: categoryid }, { isActive: false });
        }

        return NextResponse.json({
            success: true,
            message: "Category updated successfully.",
            category
        }, { status: 200 })
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: "A category with this name already exists."
            }, { status: 409 })
        }
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ categoryid: string }> }) {
    try {
        const { categoryid } = await params;
        if (!categoryid) {
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

        const category = await Category.findById(categoryid);
        if (!category) {
            return NextResponse.json({
                success: false,
                message: "Category not found."
            }, { status: 404 })
        }

        // Cascade: every property and subcategory under this category goes with it.
        await Property.deleteMany({ category: categoryid });
        await SubCategory.deleteMany({ category: categoryid });
        await category.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully, along with its subcategories and properties."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

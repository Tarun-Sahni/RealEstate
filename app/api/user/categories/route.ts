import connectDB from "@/lib/database";
import { Category } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find({ isActive: true })
            .select("name slug description metaTitle metaDescription")
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully.",
            categories
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

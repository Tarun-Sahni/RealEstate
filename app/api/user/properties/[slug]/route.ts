import { getPropertyBySlug } from "@/lib/queries/properties";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        if (!slug) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        const property = await getPropertyBySlug(slug);
        if (!property) {
            return NextResponse.json({
                success: false,
                message: "Property not found."
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Property fetched successfully.",
            property
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

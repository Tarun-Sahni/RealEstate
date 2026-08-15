import { getPublicPropertyTypes } from "@/lib/queries/properties";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const propertyTypes = await getPublicPropertyTypes();

        return NextResponse.json({
            success: true,
            message: "Property types fetched successfully.",
            propertyTypes
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

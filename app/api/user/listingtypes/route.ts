import { getPublicListingTypes } from "@/lib/queries/properties";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listingTypes = await getPublicListingTypes();

        return NextResponse.json({
            success: true,
            message: "Listing types fetched successfully.",
            listingTypes
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

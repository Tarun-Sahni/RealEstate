import { getPublicProperties } from "@/lib/queries/properties";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { properties, pagination } = await getPublicProperties({
            category: searchParams.get("category") ?? undefined,
            subcategory: searchParams.get("subcategory") ?? undefined,
            listingType: searchParams.get("listingType") ?? undefined,
            propertyType: searchParams.get("propertyType") ?? undefined,
            city: searchParams.get("city") ?? undefined,
            minPrice: searchParams.get("minPrice") ?? undefined,
            maxPrice: searchParams.get("maxPrice") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        });

        return NextResponse.json({
            success: true,
            message: "Properties fetched successfully.",
            properties,
            pagination,
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

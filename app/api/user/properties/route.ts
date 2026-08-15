import connectDB from "@/lib/database";
import { Category, ListingType, Property, PropertyType, SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fields a property card / listing grid actually renders — keeps the payload
// and serialization cost small for a route that gets hit on every page view.
const LIST_PROJECTION =
    "title slug coverImage images price priceLabel propertyStatus bedrooms bathrooms area address.city address.state category subcategory listingType propertyType isFeatured createdAt";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit")) || 12));
        const skip = (page - 1) * limit;

        const categorySlug = searchParams.get("category");
        const subcategorySlug = searchParams.get("subcategory");
        const listingTypeName = searchParams.get("listingType");
        const propertyTypeName = searchParams.get("propertyType");
        const city = searchParams.get("city");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const search = searchParams.get("search");

        // Resolve slug/name filters to ObjectIds up front, in parallel — each is
        // independent except subcategory, which is scoped to category once known.
        const [category, listingType, propertyType] = await Promise.all([
            categorySlug ? Category.findOne({ slug: categorySlug, isActive: true }).select("_id").lean() : null,
            listingTypeName ? ListingType.findOne({ name: new RegExp(`^${escapeRegex(listingTypeName)}$`, "i"), isActive: true }).select("_id").lean() : null,
            propertyTypeName ? PropertyType.findOne({ name: new RegExp(`^${escapeRegex(propertyTypeName)}$`, "i"), isActive: true }).select("_id").lean() : null,
        ]);

        // Any named filter that failed to resolve means zero results — short-circuit
        // instead of running a query that would scan for a filter that can't match.
        if ((categorySlug && !category) || (listingTypeName && !listingType) || (propertyTypeName && !propertyType)) {
            return NextResponse.json({
                success: true,
                message: "Properties fetched successfully.",
                properties: [],
                pagination: { page, limit, total: 0, totalPages: 1 },
            }, { status: 200 })
        }

        const filter: Record<string, unknown> = { isActive: true };
        if (category) filter.category = category._id;
        if (listingType) filter.listingType = listingType._id;
        if (propertyType) filter.propertyType = propertyType._id;

        if (subcategorySlug) {
            const subcategoryFilter: Record<string, unknown> = { slug: subcategorySlug, isActive: true };
            if (category) subcategoryFilter.category = category._id;
            const subcategory = await SubCategory.findOne(subcategoryFilter).select("_id").lean();
            if (!subcategory) {
                return NextResponse.json({
                    success: true,
                    message: "Properties fetched successfully.",
                    properties: [],
                    pagination: { page, limit, total: 0, totalPages: 1 },
                }, { status: 200 })
            }
            filter.subcategory = subcategory._id;
        }

        if (city) filter["address.city"] = new RegExp(escapeRegex(city), "i");

        if (minPrice || maxPrice) {
            const priceFilter: Record<string, number> = {};
            if (minPrice) priceFilter.$gte = Number(minPrice);
            if (maxPrice) priceFilter.$lte = Number(maxPrice);
            filter.price = priceFilter;
        }

        if (search) filter.$text = { $search: search };

        const projection = search ? { score: { $meta: "textScore" } } : undefined;
        const sort: Record<string, 1 | -1 | { $meta: string }> = search
            ? { score: { $meta: "textScore" } }
            : { createdAt: -1 };

        const [properties, total] = await Promise.all([
            Property.find(filter, projection)
                .select(LIST_PROJECTION)
                .populate("category", "name slug")
                .populate("subcategory", "name slug")
                .populate("listingType", "name")
                .populate("propertyType", "name")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Property.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            message: "Properties fetched successfully.",
            properties,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

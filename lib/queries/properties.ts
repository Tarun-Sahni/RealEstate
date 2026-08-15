import { cache } from "react";
import connectDB from "@/lib/database";
import { Category, Favorite, ListingType, Property, PropertyType, SubCategory } from "@/models";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Mongoose .lean() docs still carry BSON ObjectId/Date instances, which React
// rejects when a Server Component passes them as props to a Client Component.
// This strips them down to plain JSON-safe values (ObjectId -> string, etc.).
const toPlain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// Fields a property card / listing grid actually renders — keeps the payload
// and serialization cost small for a route that gets hit on every page view.
const LIST_PROJECTION =
    "title slug coverImage images price priceLabel propertyStatus bedrooms bathrooms area address.city address.state category subcategory listingType propertyType isFeatured createdAt";

export interface PropertyListFilters {
    category?: string;
    subcategory?: string;
    listingType?: string;
    propertyType?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    page?: string;
    limit?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface RefName {
    _id: string;
    name: string;
    slug?: string;
}

// Shape returned by the trimmed list projection — used by property cards/grids.
export interface PublicPropertyListItem {
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    images?: string[];
    price: number;
    priceLabel?: string;
    propertyStatus?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: { value?: number; unit?: string };
    address?: { city?: string; state?: string };
    category?: RefName;
    subcategory?: RefName;
    listingType?: RefName;
    propertyType?: RefName;
    isFeatured?: boolean;
    createdAt?: string;
}

// Full document shape — used by the property detail page.
export interface PublicPropertyDetail extends PublicPropertyListItem {
    description: string;
    shortDescription?: string;
    metaTitle?: string;
    metaDescription?: string;
    pricePerUnitArea?: number;
    balconies?: number;
    garages?: number;
    configurations?: { type?: string; superArea?: number; carpetArea?: number; price?: number }[];
    address?: { address?: string; landmark?: string; city?: string; state?: string; country?: string; pincode?: string };
    developer?: string;
    reraNumber?: string;
    projectArea?: string;
    totalUnits?: number;
    totalTowers?: number;
    possessionDate?: string;
    floorPlanImages?: string[];
    videoUrl?: string;
    brochureUrl?: string;
    amenities?: string[];
    highlights?: string[];
    faqs?: { question?: string; answer?: string }[];
    contactName?: string;
    contactPhone?: string;
    views?: number;
}

const emptyResult = (page: number, limit: number) => ({
    properties: [],
    pagination: { page, limit, total: 0, totalPages: 1 } as Pagination,
});

// Shared by the public API route and the Server Component pages, so both hit
// the DB the same (fast) way instead of one of them looping back through HTTP.
export async function getPublicProperties(filters: PropertyListFilters) {
    await connectDB();

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(filters.limit) || 12));
    const skip = (page - 1) * limit;

    const [category, listingType, propertyType] = await Promise.all([
        filters.category ? Category.findOne({ slug: filters.category, isActive: true }).select("_id").lean() : null,
        filters.listingType ? ListingType.findOne({ name: new RegExp(`^${escapeRegex(filters.listingType)}$`, "i"), isActive: true }).select("_id").lean() : null,
        filters.propertyType ? PropertyType.findOne({ name: new RegExp(`^${escapeRegex(filters.propertyType)}$`, "i"), isActive: true }).select("_id").lean() : null,
    ]);

    if ((filters.category && !category) || (filters.listingType && !listingType) || (filters.propertyType && !propertyType)) {
        return emptyResult(page, limit);
    }

    const queryFilter: Record<string, unknown> = { isActive: true };
    if (category) queryFilter.category = category._id;
    if (listingType) queryFilter.listingType = listingType._id;
    if (propertyType) queryFilter.propertyType = propertyType._id;

    if (filters.subcategory) {
        const subcategoryFilter: Record<string, unknown> = { slug: filters.subcategory, isActive: true };
        if (category) subcategoryFilter.category = category._id;
        const subcategory = await SubCategory.findOne(subcategoryFilter).select("_id").lean();
        if (!subcategory) return emptyResult(page, limit);
        queryFilter.subcategory = subcategory._id;
    }

    if (filters.city) queryFilter["address.city"] = new RegExp(escapeRegex(filters.city), "i");

    if (filters.minPrice || filters.maxPrice) {
        const priceFilter: Record<string, number> = {};
        if (filters.minPrice) priceFilter.$gte = Number(filters.minPrice);
        if (filters.maxPrice) priceFilter.$lte = Number(filters.maxPrice);
        queryFilter.price = priceFilter;
    }

    if (filters.search) queryFilter.$text = { $search: filters.search };

    const projection = filters.search ? { score: { $meta: "textScore" } } : undefined;
    const sort: Record<string, 1 | -1 | { $meta: string }> = filters.search
        ? { score: { $meta: "textScore" } }
        : { createdAt: -1 };

    const [properties, total] = await Promise.all([
        Property.find(queryFilter, projection)
            .select(LIST_PROJECTION)
            .populate("category", "name slug")
            .populate("subcategory", "name slug")
            .populate("listingType", "name")
            .populate("propertyType", "name")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Property.countDocuments(queryFilter),
    ]);

    return {
        properties: toPlain(properties) as unknown as PublicPropertyListItem[],
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        } as Pagination,
    };
}

export async function getFeaturedProperties(limit = 8): Promise<PublicPropertyListItem[]> {
    await connectDB();
    const cappedLimit = Math.min(8, Math.max(1, limit));

    const properties = await Property.find({ isActive: true, isFeatured: true })
        .select(LIST_PROJECTION)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("listingType", "name")
        .populate("propertyType", "name")
        .sort({ createdAt: -1 })
        .limit(cappedLimit)
        .lean();

    return toPlain(properties) as unknown as PublicPropertyListItem[];
}

export async function getMostViewedProperties(limit = 8): Promise<PublicPropertyListItem[]> {
    await connectDB();
    const cappedLimit = Math.min(8, Math.max(1, limit));

    const properties = await Property.find({ isActive: true })
        .select(LIST_PROJECTION)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("listingType", "name")
        .populate("propertyType", "name")
        .sort({ views: -1, createdAt: -1 })
        .limit(cappedLimit)
        .lean();

    return toPlain(properties) as unknown as PublicPropertyListItem[];
}

// Wrapped in React's cache() so the detail page's generateMetadata() and page
// component — which both need this data — share one call per request instead
// of each triggering their own $inc on `views`.
export const getPropertyBySlug = cache(async (slug: string): Promise<PublicPropertyDetail | null> => {
    await connectDB();

    // Atomic increment avoids a separate read-then-write round trip.
    const property = await Property.findOneAndUpdate(
        { slug, isActive: true },
        { $inc: { views: 1 } },
        { returnDocument: "after" }
    )
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("listingType", "name")
        .populate("propertyType", "name")
        .lean();

    return toPlain(property) as unknown as PublicPropertyDetail | null;
});

// Most-recently-saved first. Properties that were deactivated or deleted since
// being saved are silently dropped rather than shown as broken cards.
export async function getWishlistProperties(userId: string): Promise<PublicPropertyListItem[]> {
    await connectDB();

    const favorites = await Favorite.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: "property",
            match: { isActive: true },
            select: LIST_PROJECTION,
            populate: [
                { path: "category", select: "name slug" },
                { path: "subcategory", select: "name slug" },
                { path: "listingType", select: "name" },
                { path: "propertyType", select: "name" },
            ],
        })
        .lean();

    const properties = favorites.map((favorite) => favorite.property).filter(Boolean);

    return toPlain(properties) as unknown as PublicPropertyListItem[];
}

export async function getPublicCategories() {
    await connectDB();
    const categories = await Category.find({ isActive: true })
        .select("name slug description metaTitle metaDescription")
        .sort({ name: 1 })
        .lean();
    return toPlain(categories);
}

export async function getPublicSubcategories(categorySlug: string) {
    await connectDB();
    const category = await Category.findOne({ slug: categorySlug, isActive: true }).select("name slug").lean();
    if (!category) return null;

    const subcategories = await SubCategory.find({ category: category._id, isActive: true })
        .select("name slug description metaTitle metaDescription")
        .sort({ name: 1 })
        .lean();

    return toPlain({ category, subcategories });
}

export async function getAllPublicSubcategories() {
    await connectDB();
    const subcategories = await SubCategory.find({ isActive: true })
        .select("name slug category")
        .populate("category", "name slug")
        .sort({ name: 1 })
        .lean();
    return toPlain(subcategories);
}

export async function getPublicListingTypes() {
    await connectDB();
    const listingTypes = await ListingType.find({ isActive: true }).select("name").sort({ name: 1 }).lean();
    return toPlain(listingTypes);
}

export async function getPublicPropertyTypes() {
    await connectDB();
    const propertyTypes = await PropertyType.find({ isActive: true }).select("name").sort({ name: 1 }).lean();
    return toPlain(propertyTypes);
}

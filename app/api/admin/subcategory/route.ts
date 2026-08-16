import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { SubCategory } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    try {
        const { category, name, slug, description, metaTitle, metaDescription } = await request.json()
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

        const subcategory = await SubCategory.create({
            category,
            name,
            slug,
            description,
            metaTitle,
            metaDescription,
        });

        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Subcategory created successfully.",
            subcategory
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const admin = await getAdminUser(request);
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized."
            }, { status: 401 })
        }

        // Pagination is opt-in via `page` so existing callers that need the full
        // unpaginated list (e.g. the property form's subcategory dropdown) keep working.
        const searchParams = request.nextUrl.searchParams;
        const paginate = searchParams.has("page");

        if (!paginate) {
            const subcategories = await SubCategory.find()
                .populate("category", "name slug")
                .sort({ createdAt: -1 });
            return NextResponse.json({
                success: true,
                message: "Subcategories fetched successfully.",
                subcategories
            }, { status: 200 })
        }

        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [subcategories, total] = await Promise.all([
            SubCategory.find()
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            SubCategory.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Subcategories fetched successfully.",
            subcategories,
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

import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { Category } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, slug, description, metaTitle, metaDescription } = await request.json()
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

        const category = await Category.create({
            name,
            slug,
            description,
            metaTitle,
            metaDescription,
        });

        return NextResponse.json({
            success: true,
            message: "Category created successfully.",
            category
        }, { status: 201 })
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
        // unpaginated list (e.g. the property form's category dropdown) keep working.
        const searchParams = request.nextUrl.searchParams;
        const paginate = searchParams.has("page");

        if (!paginate) {
            const categories = await Category.find().sort({ createdAt: -1 });
            return NextResponse.json({
                success: true,
                message: "Categories fetched successfully.",
                categories
            }, { status: 200 })
        }

        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            Category.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Category.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully.",
            categories,
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

import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { PropertyType } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, isActive } = await request.json()
        if (!name) {
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

        const propertyType = await PropertyType.create({
            name,
            isActive,
        });

        return NextResponse.json({
            success: true,
            message: "Property type created successfully.",
            propertyType
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

        const propertyTypes = await PropertyType.find().sort({ createdAt: -1 });

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

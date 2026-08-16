import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { PropertyType } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ propertytypeid: string }> }) {
    try {
        const { propertytypeid } = await params;
        if (!propertytypeid) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

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

        const propertyType = await PropertyType.findByIdAndUpdate(
            propertytypeid,
            { name, isActive: Boolean(isActive) },
            { new: true, runValidators: true }
        );
        if (!propertyType) {
            return NextResponse.json({
                success: false,
                message: "Property type not found."
            }, { status: 404 })
        }

        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Property type updated successfully.",
            propertyType
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ propertytypeid: string }> }) {
    try {
        const { propertytypeid } = await params;
        if (!propertytypeid) {
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

        const propertyType = await PropertyType.findByIdAndDelete(propertytypeid);
        if (!propertyType) {
            return NextResponse.json({
                success: false,
                message: "Property type not found."
            }, { status: 404 })
        }

        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Property type deleted successfully."
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

import connectDB from "@/lib/database";
import { getAdminUser } from "@/lib/dal";
import { SiteSettings } from "@/models";
import { NextRequest, NextResponse } from "next/server";

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

        const settings = await SiteSettings.findOne();

        return NextResponse.json({
            success: true,
            message: "Settings fetched successfully.",
            settings: settings ?? {}
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const {
            phone,
            email,
            supportEmail,
            officeAddress,
            mapEmbedUrl,
            officeHours,
            whatsappNumber,
            facebook,
            youtube,
            instagram,
        } = await request.json();

        if (!supportEmail) {
            return NextResponse.json({
                success: false,
                message: "Support email is required."
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

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { phone, email, supportEmail, officeAddress, mapEmbedUrl, officeHours, whatsappNumber, facebook, youtube, instagram },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: "Settings updated successfully.",
            settings
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

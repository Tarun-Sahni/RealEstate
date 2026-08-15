import connectDB from "@/lib/database";
import { getAuthUser } from "@/lib/dal";
import { Property, VisitBooking } from "@/models";
import { NextRequest, NextResponse } from "next/server";

const NAME_REGEX = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d{10}$/;

export async function POST(request: NextRequest) {
    try {
        const { propertyId, fullName, email, phone, message } = await request.json();
        if (!propertyId || !fullName || !email || !phone) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        if (!NAME_REGEX.test(fullName.trim())) {
            return NextResponse.json({
                success: false,
                message: "Full name can only contain letters and spaces."
            }, { status: 400 })
        }

        if (!EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({
                success: false,
                message: "Enter a valid email address."
            }, { status: 400 })
        }

        if (!PHONE_REGEX.test(phone.trim())) {
            return NextResponse.json({
                success: false,
                message: "Enter a valid 10-digit phone number."
            }, { status: 400 })
        }

        await connectDB();

        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({
                success: false,
                message: "Please login to request a tour."
            }, { status: 401 })
        }

        const property = await Property.findById(propertyId).select("_id");
        if (!property) {
            return NextResponse.json({
                success: false,
                message: "Property not found."
            }, { status: 404 })
        }

        await VisitBooking.create({ property: propertyId, fullName, email, phone, message });

        return NextResponse.json({
            success: true,
            message: "Your tour request has been submitted. Our team will contact you shortly."
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}

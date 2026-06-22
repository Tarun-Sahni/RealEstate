import connectDB from "@/lib/database";
import { ContactUs } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { firstname, lastname, email, phone, message } = await request.json();
        if (!firstname || !lastname || !email || !phone || !message) {
            return NextResponse.json({
                success: false,
                message: "Missing Required Fields."
            }, { status: 400 })
        }

        await connectDB();
        await ContactUs.create({
            firstname,
            lastname,
            email,
            phone,
            message
        })

        return NextResponse.json({
            success:true,
            message:"Your message has been sent successfully.Please wait for our response."
        },{status:201})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error."
        }, { status: 500 })
    }
}
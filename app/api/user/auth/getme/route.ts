import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = request.headers.get("x-user-id");
    const user = await User.findById({ _id: userId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Authorized",
      user: {
        userId: user?._id,
        username: user?.username,
        email: user?.email,
        avatar: user?.avatar,
        role: user?.role
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error."
    })
  }
}
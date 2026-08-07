import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { cache } from "react";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/database";
import { User } from "@/models";

export const verifyAdminSession = cache(async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        redirect("/");
    }

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded?.userId) {
        redirect("/");
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    return { userId: user._id.toString(), role: user.role };
});

// For Route Handlers: reads the cookie off the request instead of next/headers,
// and returns null instead of redirecting so callers can respond with JSON. Assumes
// the caller has already called connectDB().
export async function getAdminUser(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return null;
    }

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded?.userId) {
        return null;
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return user;
}

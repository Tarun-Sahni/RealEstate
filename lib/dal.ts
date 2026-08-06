import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

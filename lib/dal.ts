import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { cache } from "react";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/database";
import { User } from "@/models";

// Cached so repeated calls within one request (e.g. a page plus generateMetadata)
// share one cookie/DB lookup. Deliberately does NOT call redirect() itself -
// under Turbopack dev, a redirect() thrown from inside a cache()-wrapped function
// loses its special NEXT_REDIRECT digest (React's cache() re-wraps the rejection),
// so Next treats it as a real error and falls back to broken client-side rendering
// instead of issuing the redirect. Callers below do the redirect() themselves,
// uncached, so the throw reaches Next's rendering pipeline intact.
const getSessionUser = cache(async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded?.userId) return null;

    await connectDB();
    return User.findById(decoded.userId);
});

export async function verifyAdminSession() {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    return { userId: user._id.toString(), username: user.username, role: user.role };
}

// Same as verifyAdminSession but for any authenticated user, regardless of role.
export async function verifyUserSession() {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    return { userId: user._id.toString(), username: user.username, role: user.role };
}

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

// Same as getAdminUser but for any authenticated user, regardless of role.
export async function getAuthUser(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return null;
    }

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded?.userId) {
        return null;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        return null;
    }

    return user;
}

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "UnAuthorized"
        }, { status: 401 })
    }
    try {
        const decoded = verifyToken(token) as JwtPayload
        if (!decoded || decoded === null) {
            return NextResponse.json(
                {
                    success: false,
                    message: "UnAuthorized"
                }, { status: 401 }
            );
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decoded?.userId);
        return NextResponse.next({ request: { headers: requestHeaders } })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "UnAuthorized"
            }, { status: 401 }
        );
    }
}

export const config = {
    matcher: ["/api/user/auth/getme"],
};
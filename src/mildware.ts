import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isVerified = !!token?.emailVerified;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

        // 1. If trying to access dashboard but NOT verified, 
        // we let them in BUT the dashboard will show the Alert component.
        // OR we can redirect them to a "Please verify" page.

        return NextResponse.next();
    },
    {
        callbacks: {
            // This ensures the middleware only runs if there's a valid JWT
            authorized: ({ token }) => !!token,
        },
    }
);

// Define which paths are protected
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"]
};
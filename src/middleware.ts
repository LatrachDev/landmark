import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect routes starting with /admin
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token');

        // If no token exists, hide the route by showing a 404 Not Found response
        if (!token) {
            // Rewriting to a non-existent path to trigger the default or custom not-found page
            // This makes the route appear as if it doesn't exist to unauthorized users
            return NextResponse.rewrite(new URL('/not-found-page', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/admin/:path*',
};

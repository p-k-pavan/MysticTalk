import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

// Middleware to check if the user has a token, otherwise redirect to login
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
         url.pathname.startsWith('/sign-up') ||
         url.pathname.startsWith('/verify') ||
         url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.redirect(new URL('/', request.url));
}

// Paths to apply middleware
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};

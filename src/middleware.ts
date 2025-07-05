import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const GUEST_PATHS = ['/login', '/register'];

interface JwtPayload {
    exp?: number;
}

function isValidToken(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return !!decoded.exp && Date.now() < decoded.exp * 1000;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('token')?.value;
    const isGuestPath = GUEST_PATHS.some((path) => pathname.startsWith(path));
    const isTokenValid = token && isValidToken(token);

    if (isGuestPath && isTokenValid) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isGuestPath && !isTokenValid) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};

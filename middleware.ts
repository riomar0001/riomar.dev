import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through
  if (pathname === '/dashboard/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (accessToken) {
      try {
        await jwtVerify(accessToken, JWT_SECRET);
        return NextResponse.next();
      } catch {
        // Access token expired, try refresh
      }
    }

    // Try refresh token flow
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (refreshToken) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/api/auth/refresh?redirect=${callbackUrl}`, request.nextUrl));
    }

    return NextResponse.redirect(new URL('/dashboard/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};

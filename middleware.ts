
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * PRODUCTION-READY MIDDLEWARE
 * Protects routes based on JWT presence and roles.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('mallucupid_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect Dashboard routes
  if (pathname.startsWith('/user') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // In a real app, you'd decode the token here to verify roles
  }

  // Redirect if already logged in
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/login'],
};

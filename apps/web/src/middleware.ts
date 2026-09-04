import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/appointments', '/profile', '/settings', '/booking'];
const adminRoutes = ['/admin'];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN' || req.auth?.user?.role === 'SUPER_ADMIN';
  const pathname = req.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtected && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/auth/login?redirect=${callbackUrl}`, req.url));
  }

  // Redirect logged in users away from auth pages
  if (pathname.startsWith('/auth/') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/appointments/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/booking/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
};
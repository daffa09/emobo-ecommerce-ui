import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cookies
  const role = request.cookies.get('emobo-role')?.value;
  const token = request.cookies.get('emobo-token')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPage = pathname.startsWith('/admin');
  const isCustomerPage = pathname.startsWith('/customer');

  // If not logged in and trying to access protected page
  if (!token && (isAdminPage || isCustomerPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access auth page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/customer', request.url));
  }

  // Admin page protection: Only ADMIN can access
  if (isAdminPage && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/customer', request.url));
  }

  // Customer page protection: Only CUSTOMER can access
  if (isCustomerPage && role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/login', '/register'],
};

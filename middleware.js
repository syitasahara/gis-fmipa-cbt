import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if user is trying to access quiz page
  if (request.nextUrl.pathname.startsWith('/quiz')) {
    // Get token from cookies or headers (we'll check on client side)
    // For now, let the client-side handle authentication redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

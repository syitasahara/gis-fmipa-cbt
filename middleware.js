import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Protected routes that need authentication
  if (path.startsWith('/quiz') || path.startsWith('/start-exam')) {
    if (!token) {
      // Redirect to login if no token found
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If accessing start-exam directly and already has token, redirect to quiz
    if (path.startsWith('/start-exam') && token) {
      return NextResponse.redirect(new URL('/quiz', request.url));
    }
  }

  // If already logged in and trying to access login page or root, redirect to quiz
  if ((path === '/login' || path === '/') && token) {
    return NextResponse.redirect(new URL('/quiz', request.url));
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

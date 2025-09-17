import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Protected routes that need authentication
  if (path.startsWith('/quiz') || path.startsWith('/start-exam')) {
    if (!token) {
      // Only redirect to login if no token found and not already on login page
      if (!path.startsWith('/login')) {
        console.log('Middleware: No token found, redirecting to login from', path);
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // If already logged in and trying to access login page, redirect to start-exam
  if (path === '/login' && token) {
    console.log('Middleware: Token found on login page, redirecting to start-exam');
    return NextResponse.redirect(new URL('/start-exam', request.url));
  }

  // Root path redirect to login (no longer redirect authenticated users to quiz automatically)
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
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

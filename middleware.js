import { NextResponse } from 'next/server';

// Cek apakah token cookie masih bisa dipakai. Cookie `token` berumur 24 jam,
// tetapi JWT-nya bisa kadaluarsa lebih cepat — tanpa cek ini, middleware
// menganggap user masih login dan menendang /login → /start-exam, lalu
// halaman client mendeteksi expired dan melempar balik ke /login (kedut/refresh).
// Decode payload saja tanpa verifikasi signature — validasi penuh tetap di server.
function isTokenUsable(token) {
  if (!token) return false;
  try {
    const part = token.split('.')[1];
    if (!part) return true; // bukan JWT (opaque): serahkan validasi ke server
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (payload?.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return true; // gagal decode: selaras dengan isAuthenticated() di client
  }
}

export function middleware(request) {
  const token = isTokenUsable(request.cookies.get('token')?.value)
    ? request.cookies.get('token')?.value
    : null;
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

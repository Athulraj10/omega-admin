import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isPrivatePage = req.nextUrl.pathname.startsWith('/dashboard');

  if (!token && isPrivatePage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

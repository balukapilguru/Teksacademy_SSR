import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Intercept any request starting with /virtuals/ or exactly /virtuals
  if (pathname.startsWith('/virtuals/') || pathname === '/virtuals') {
    // Rewrite to the custom 410 error page and return 410 Gone status
    const rewriteUrl = new URL('/410', request.url);
    const response = NextResponse.rewrite(rewriteUrl, {
      status: 410,
      statusText: 'Gone',
    });

    // Prevent caching of the 410 response
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/virtuals',
    '/virtuals/:path*',
  ],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com https://apis.google.com https://va.vercel-scripts.com;",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
      "img-src 'self' data: https:;",
      "font-src 'self' fonts.gstatic.com;",
      "connect-src 'self' https://*.supabase.co https://urbancanvas.vercel.app https://*.vercel.app https://accounts.google.com https://apis.google.com https://va.vercel-scripts.com https://formsubmit.co;",
      "frame-src 'self' https://accounts.google.com;",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self' https://formsubmit.co;"
    ].join(' ')
  );

  return response;
}
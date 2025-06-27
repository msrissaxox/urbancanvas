import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://accounts.google.com https://apis.google.com https://va.vercel-scripts.com;",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
      "img-src 'self' data: https:;",
      "font-src 'self' fonts.gstatic.com;",
      "connect-src 'self' ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:* https://*.supabase.co https://*.vercel.app;",
      "frame-src https://accounts.google.com;",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self';"
    ].join(' ')
  );

  return response;
}
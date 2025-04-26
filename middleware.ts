import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run on the client-reporting route
export function middleware(request: NextRequest) {
  // Add security headers for the client-reporting route
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Only run middleware on the client-reporting route
export const config = {
  matcher: '/client-reporting',
};
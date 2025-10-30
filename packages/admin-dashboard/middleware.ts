/**
 * Next.js Middleware
 *
 * HTTP Basic Authentication - Protects site from bots and unauthorized access
 * Whitelists internal system calls (WordPress, n8n, GitHub Actions)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// HTTP Basic Auth credentials
const BASIC_AUTH_USER = 'builder_user';
const BASIC_AUTH_PASSWORD = 'K8mN#Build7$Q2';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // ========================================
  // WHITELIST: Allow these requests WITHOUT authentication
  // ========================================

  // 1. Webhook endpoints (WordPress, n8n, GoHighLevel, GitHub)
  if (pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next();
  }

  // 2. WordPress requests (plugin status checks, SAA Deployment Manager)
  if (userAgent.includes('WordPress') || userAgent.includes('SAA-Deployment-Manager')) {
    return NextResponse.next();
  }

  // 3. n8n automation requests
  if (
    userAgent.includes('n8n') ||
    request.headers.get('x-n8n-webhook') ||
    request.headers.get('x-workflow-id')
  ) {
    return NextResponse.next();
  }

  // 4. GitHub Actions (workflow status checks, deployments)
  if (
    userAgent.includes('GitHub-Hookshot') ||
    userAgent.includes('github-actions')
  ) {
    return NextResponse.next();
  }

  // 5. Next.js internal API routes (revalidation, etc.)
  if (pathname.startsWith('/api/revalidate')) {
    const revalidateSecret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (revalidateSecret === expectedSecret) {
      return NextResponse.next();
    }
  }

  // 6. Health check endpoints
  if (pathname === '/api/health' || pathname === '/health') {
    return NextResponse.next();
  }

  // ========================================
  // HTTP BASIC AUTH: Required for all other requests
  // ========================================

  const authHeader = request.headers.get('authorization');

  // If no authorization header, request authentication
  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Site - Enter Credentials"',
      },
    });
  }

  // Decode the Basic Auth credentials
  const auth = authHeader.split(' ')[1];
  const [user, password] = Buffer.from(auth, 'base64').toString().split(':');

  // Verify credentials
  if (user !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Site - Enter Credentials"',
      },
    });
  }

  // Authentication successful - allow request
  return NextResponse.next();
}

// Apply to ALL routes (entire site protected)
export const config = {
  matcher: [
    /*
     * Match all request paths including:
     * - All pages
     * - All API routes
     * - Static files (except Next.js internals)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

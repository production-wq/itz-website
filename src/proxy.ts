import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Gates the /admin content pipeline behind HTTP Basic Auth — the browser's
 * own native username/password prompt, so there is no session or cookie
 * plumbing to build or break. Runs on every request to /admin* and
 * /api/admin* (see matcher below); everything else on the site is untouched.
 *
 * Set ADMIN_USERNAME and ADMIN_PASSWORD in the environment (Vercel: Settings
 * → Environment Variables, Production + Preview) to enable. See .env.example.
 *
 * NOTE: this is Proxy, not Middleware — Next.js 16 renamed the file/export;
 * see node_modules/next/dist/docs/.../proxy.md. Runtime defaults to Node.js.
 */
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    // No credentials configured: refuse in production rather than silently
    // leave the content pipeline open, but let local dev through so
    // `npm run dev` still works before anyone has set up .env.local.
    if (process.env.NODE_ENV === 'production') {
      return new Response(
        'The admin panel is not configured — set ADMIN_USERNAME and ADMIN_PASSWORD.',
        { status: 503 },
      );
    }
    return NextResponse.next();
  }

  const header = request.headers.get('authorization');
  if (header?.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    if (sep !== -1 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === pass) {
      return NextResponse.next();
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="ITZ Digital admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

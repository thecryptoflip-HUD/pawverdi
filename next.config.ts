import type { NextConfig } from 'next';

/**
 * Content-Security-Policy.
 *
 * `script-src` keeps 'unsafe-inline' because the App Router emits an inline
 * bootstrap script into otherwise static pages; a nonce would force every page
 * to render dynamically and lose the CDN cache. Everything else is locked to
 * the origin, so injected third-party or remote scripts are still blocked.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  async redirects() {
    return [
      // One canonical host. The site already emits canonical tags for the apex;
      // this makes the browsers and crawlers agree without a round trip.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.pawverdi.com' }],
        destination: 'https://pawverdi.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

export default config;

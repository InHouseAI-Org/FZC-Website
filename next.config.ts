import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone for Docker deployment
  output: 'standalone',
  // Allow cross-origin dev requests from specific IPs
  allowedDevOrigins: ['192.168.1.174', '192.168.1.36'],
  // Enable gzip compression
  compress: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'd24gq0kplkhyxr.cloudfront.net',
      },
    ],
    // Automatically optimize images to WebP format (skip AVIF to reduce processing time)
    formats: ['image/webp'],
    // Enable lazy loading by default
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Increase cache TTL to reduce re-optimization
    minimumCacheTTL: 31536000, // 1 year for optimized images
    // Configure quality levels for image optimization
    qualities: [75, 85],
    // Allow SVG
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Loader configuration for pre-optimized images
    loader: 'default',
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Headers for optimal caching (works with CloudFront)
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico|ttf|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache videos
        source: '/:all*(mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

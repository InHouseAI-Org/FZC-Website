import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone for Docker deployment
  output: 'standalone',
  // Allow cross-origin dev requests from specific IPs
  allowedDevOrigins: ['192.168.1.174', '192.168.1.36'],
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
    // Automatically optimize images to WebP/AVIF format
    formats: ['image/avif', 'image/webp'],
    // Enable lazy loading by default
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image optimization quality
    minimumCacheTTL: 60,
    // Quality settings
    qualities: [75, 85],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;

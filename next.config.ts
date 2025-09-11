import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['fal.media', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
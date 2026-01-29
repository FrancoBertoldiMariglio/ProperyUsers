import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@propery/ui', '@propery/core', '@propery/api-client', '@propery/ai'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
  // Ignore TypeScript errors during build (React 19 type compatibility issues)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

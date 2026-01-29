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
}

export default nextConfig

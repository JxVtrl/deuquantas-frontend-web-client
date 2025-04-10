import type { NextConfig } from 'next';

const isDocker = process.env.NEXT_PUBLIC_DOCKER_ENV === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  trailingSlash: true,
  output: isDocker ? 'export' : undefined,
  eslint: {
    ignoreDuringBuilds: false,
  },
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: isDocker
          ? 'http://backend:3010/:path*'
          : 'http://localhost:3010/:path*',
      },
    ];
  },
};

export default nextConfig;

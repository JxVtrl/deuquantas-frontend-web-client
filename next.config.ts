import type { NextConfig } from 'next';

const isDocker = process.env.NEXT_PUBLIC_DOCKER_ENV === 'true';
const backendUrl = isDocker ? 'http://backend:3001' : 'http://localhost:3001';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  trailingSlash: true,
  output: isDocker ? 'export' : undefined,
  eslint: {
    ignoreDuringBuilds: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

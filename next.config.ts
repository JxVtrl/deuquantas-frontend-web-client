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
};

export default nextConfig;

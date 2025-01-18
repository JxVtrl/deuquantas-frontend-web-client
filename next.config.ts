import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  trailingSlash: true,
  ...(process.env.NEXT_PUBLIC_DOCKER_ENV === 'true' && { output: 'export' }),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from 'next';
import path from 'path';

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
  transpilePackages: ['@deuquantas/components'],
  webpack: (config, { isServer }) => {
    // Configuração para resolver o React corretamente
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: isDocker
          ? 'http://backend:8080/:path*'
          : 'http://localhost:8080/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'deuquantasapi-901874097670.southamerica-east1.run.app',
      },
    ],
  },
};

export default nextConfig;

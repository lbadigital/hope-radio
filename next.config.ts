import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-radio.lba-digital.fr',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'hoperadiofrance.fr',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'wordpress',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ]
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
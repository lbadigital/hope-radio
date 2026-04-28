import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://api-radio.lba-digital.fr/**'), new URL('http://hoperadiofrance.fr/**')],
  }
};

export default nextConfig;

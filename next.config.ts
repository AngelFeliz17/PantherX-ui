import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.6.134"],
  images: {
    remotePatterns: [{
        protocol: process.env.NEXT_PUBLIC_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        port: process.env.NEXT_PUBLIC_PORT,
        pathname: process.env.NEXT_PUBLIC_PATHNAME
    }]
  }
};

export default nextConfig;
import type { NextConfig } from "next";

const imageProtocol =
  process.env.NEXT_PUBLIC_PROTOCOL?.trim() === "http" ? "http" : "https";
const imageHostname = process.env.NEXT_PUBLIC_HOSTNAME?.trim() ?? "";
const imagePort = process.env.NEXT_PUBLIC_PORT?.trim() || undefined;
const imagePathname = process.env.NEXT_PUBLIC_PATHNAME?.trim() || "/**";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.6.134"],
  images: {
    remotePatterns: [{
        protocol: imageProtocol,
        hostname: imageHostname,
        port: imagePort,
        pathname: imagePathname
    }]
  }
};

export default nextConfig;

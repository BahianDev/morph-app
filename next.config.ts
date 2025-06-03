import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "better-festival-3bb25677f9.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "better-festival-3bb25677f9.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "morphd.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

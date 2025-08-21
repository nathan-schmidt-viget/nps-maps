import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.nps.gov",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

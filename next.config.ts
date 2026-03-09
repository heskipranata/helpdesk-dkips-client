import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow development access from both localhost and 127.0.0.1
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "http://localhost:3001/api/:path*",
        },
        {
          source: "/files/:path*",
          destination: "http://localhost:3001/files/:path*",
        },
        {
          source: "/uploads/:path*",
          destination: "http://localhost:3001/uploads/:path*",
        },
      ],
    };
  },
};

export default nextConfig;

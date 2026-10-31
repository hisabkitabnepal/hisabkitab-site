import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/register-business",
        destination: "/guides/business-structures-nepal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

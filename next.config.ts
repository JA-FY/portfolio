import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	  output: "standalone",
  eslint: {
	  ignoreDuringBuilds: true,
  },
  typescript: {
	  ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname, // automatically points to: C:\Users\Nirakulan\Projects\invoice-gen
  },
};

export default nextConfig;

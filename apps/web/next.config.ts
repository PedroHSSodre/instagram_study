import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(process.env.WATCHPACK_POLLING === "true"
    ? { watchOptions: { pollIntervalMs: 1000 } }
    : {}),
};

export default nextConfig;

import type { NextConfig } from "next";

// Deployed on Vercel: the full Next.js runtime, not a static export, so
// client-created meetings resolve at /meeting/<any-id> on demand.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;

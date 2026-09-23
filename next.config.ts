import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Photos are immutable (UUID filenames), so cache the optimized copies for
    // a year. Each one is then fetched from Supabase about once, which is what
    // keeps image traffic off Supabase's metered egress.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;

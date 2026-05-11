import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG logos from /public/listing-logos — local files only, no external SVGs hotlinked
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

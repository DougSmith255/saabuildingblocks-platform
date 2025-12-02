import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Base path for reverse proxy: saabuildingblocks.com/social-poster
  basePath: '/social-poster',

  // Enable React Compiler for better performance (moved to top-level in Next.js 16)
  reactCompiler: true,

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fimgs.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
  webpack(config) {
    config.output.devtoolModuleFilenameTemplate = (info: { absoluteResourcePath: string }) =>
      path.relative(process.cwd(), info.absoluteResourcePath).replace(/\\/g, '/')
    return config
  },
}

export default nextConfig

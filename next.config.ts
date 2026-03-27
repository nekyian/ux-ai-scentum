import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    config.output.devtoolModuleFilenameTemplate = (info: { absoluteResourcePath: string }) =>
      path.relative(process.cwd(), info.absoluteResourcePath).replace(/\\/g, '/')
    return config
  },
}

export default nextConfig

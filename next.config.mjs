import withBundleAnalyzer from '@next/bundle-analyzer'
import optimizeLocales from '@react-aria/optimize-locales-plugin'

// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'rsc-mdx',
      '@shikijs/twoslash',
      '@shikijs/rehype',
    ],
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(
      optimizeLocales.webpack({
        locales: ['en-US'],
      }),
    )
    return config
  },
}

if (process.env.ANALYZE === 'true') {
  nextConfig = withBundleAnalyzer()(nextConfig)
}

export default nextConfig

const withMDX = require('@next/mdx')()

module.exports = withMDX({
  images: {
    domains: ['render-eu.worldofwarcraft.com'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
})

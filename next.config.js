const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  })
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx']
};

module.exports = withBundleAnalyzer(nextConfig)

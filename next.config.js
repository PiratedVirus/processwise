const { withAxiom } = require('next-axiom');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx'],
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  }
};

module.exports = withAxiom(withBundleAnalyzer(nextConfig));


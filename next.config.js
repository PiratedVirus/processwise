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
};

module.exports = withAxiom(withBundleAnalyzer(nextConfig));

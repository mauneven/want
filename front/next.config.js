module.exports = {
  serverRuntimeConfig: {
    host: "0.0.0.0",
    port: 3000,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

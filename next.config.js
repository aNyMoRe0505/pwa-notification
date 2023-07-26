/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: false,
  // disable: process.env.NODE_ENV === 'development',
  buildExcludes: [() => true],
  cacheStartUrl: false,
  dynamicStartUrl: false,
  workboxOptions: {
    skipWaiting: false,
    clientsClaim: false,
  },
});

module.exports = withPWA({
  compiler: {
    styledComponents: true,
  },
});

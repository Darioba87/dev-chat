const nextConfig = {
  images: {
    domains: ['media.giphy.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `media0.giphy.com`,
        pathname: '/**',
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        protocol: 'https',
        hostname: `media${i + 1}.giphy.com`,
        pathname: '/**',
      })),
    ],
  },
};

module.exports = nextConfig;

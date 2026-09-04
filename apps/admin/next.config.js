/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: `${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
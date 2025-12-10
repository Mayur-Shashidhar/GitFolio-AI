/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/charts/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig

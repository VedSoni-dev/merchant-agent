/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['merchant-agent', '@merchant-agent/example-goldenhour'],
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig

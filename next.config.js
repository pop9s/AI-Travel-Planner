/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 启用 standalone 输出模式，用于 Docker 部署
  output: 'standalone',
}

module.exports = nextConfig


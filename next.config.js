/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // アップロード画像を処理するために必要な設定
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
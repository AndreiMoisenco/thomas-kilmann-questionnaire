/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/thomas-kilmann-questionnaire',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
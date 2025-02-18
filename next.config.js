/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'media.istockphoto.com', 's1.ticketm.net', 'images.discovery-prod.axs.com', 'media.stubhubstatic.com','static.discovery-prod.axs.com', '*.stubhubstatic.com'],
  },
  
}

module.exports = nextConfig

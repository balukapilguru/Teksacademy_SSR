/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 31536000, 
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tekacademy.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "teksacademynewwebsite.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "teksacademy.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "teksacademy.com",
      },
      {
        protocol: "https",
        hostname: "teksversity.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Redirects with 301 status code
  async redirects() {
    return [
      // Redirect /course to /courses (301)
      {
        source: '/course',
        destination: '/courses',
        statusCode: 301, // ✅ Changed from permanent: true to statusCode: 301
      },
      // Remove trailing slashes (301)
      {
        source: '/:path*/',
        destination: '/:path*',
        statusCode: 301, // ✅ Changed from permanent: true to statusCode: 301
      },
      // Add your other redirects here with 301
      // Example:
      // {
      //   source: '/old-url',
      //   destination: '/new-url',
      //   statusCode: 301,
      // },
    ];
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
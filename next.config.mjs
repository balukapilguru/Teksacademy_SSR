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
        hostname: "teksversity.s3.us-east-1.amazonaws.com", // ✅ ADD THIS LINE
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Add deviceSizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Add your 301 redirects here
  async redirects() {
    return [
      // Redirect /course to /courses
      {
        source: '/course',
        destination: '/courses',
        permanent: true, // 308 redirect
      },
      // Remove trailing slashes
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
      // Add your other redirects here
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
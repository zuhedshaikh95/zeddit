/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/*",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;

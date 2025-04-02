/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ngeyhydcefjumnruwmal.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ngeyhydcefjumnruwmal.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

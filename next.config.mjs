/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eyrkyvqvmkyxsunudlto.supabase.co',
      },
    ],
  },
};

export default nextConfig;

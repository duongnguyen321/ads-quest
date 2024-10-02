/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CLIENT_URL,
      },
      {
        protocol: 'https',
        hostname: process.env.SERVER_URL,
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    TELEGRAM_URL: process.env.TELEGRAM_URL,
    DEV_USER_ID: process.env.DEV_USER_ID,
    TON_ADDRESS: process.env.TON_ADDRESS,
    AMOUNT_USER_UNLOCK: process.env.AMOUNT_USER_UNLOCK,
    AMOUNT_ADD_MISSION: process.env.AMOUNT_ADD_MISSION,
    AMOUNT_REWARD_MISSION: process.env.AMOUNT_REWARD_MISSION,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.CLIENT_URL },
        ],
      },
    ];
  },
};

export default nextConfig;

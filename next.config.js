/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    dbHost: '54.236.214.214',
    dbUser: 'node',
    dbPassword: '123456',
    dbName: 'cookzilla',
    jwtSecret: 'suuuupersecure',
  },
};

module.exports = nextConfig;

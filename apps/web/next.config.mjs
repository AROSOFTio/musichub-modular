const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api";
const noStoreHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  },
  {
    key: "Pragma",
    value: "no-cache",
  },
  {
    key: "Expires",
    value: "0",
  },
  {
    key: "X-Musichub-Cache-Policy",
    value: "no-store",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/",
        headers: noStoreHeaders,
      },
      {
        source: "/login",
        headers: noStoreHeaders,
      },
      {
        source: "/admin",
        headers: noStoreHeaders,
      },
      {
        source: "/admin/:path*",
        headers: noStoreHeaders,
      },
      {
        source: "/api/:path*",
        headers: noStoreHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;


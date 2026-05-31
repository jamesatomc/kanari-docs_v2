import fs from "node:fs";
import path from "node:path";

const docsSpaces = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content", "docs-spaces.json")),
);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      ...docsSpaces
        .filter((space) => space.href !== "/docs")
        .map((space) => ({
          source: `${space.href}/:path*`,
          destination: "/docs/:path*",
        })),
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

export default config;

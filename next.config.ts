import type { NextConfig } from "next";

function getBasePath() {
  const explicit = process.env.NEXT_PUBLIC_BASE_PATH;
  if (explicit !== undefined) return explicit;

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const owner = process.env.GITHUB_REPOSITORY?.split("/")[0];
  if (!repo) return "";

  // For user/organization pages (owner.github.io), GitHub Pages is served from the root.
  if (owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) return "";

  // For project pages, the site lives under /repo-name
  return `/${repo}`;
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: getBasePath(),
  assetPrefix: getBasePath(),
};

export default nextConfig;

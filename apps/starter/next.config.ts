import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  // Shared packages ship TypeScript source; Next compiles them.
  transpilePackages: ["@factory/ui", "@factory/blocks", "@factory/schemas", "@factory/sanity-client"],
  outputFileTracingRoot: repoRoot,
  turbopack: { root: repoRoot },
};

export default nextConfig;

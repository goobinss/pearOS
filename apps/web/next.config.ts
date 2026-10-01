import type { NextConfig } from "next";
const nextConfig: NextConfig = { transpilePackages: ["@pearos/sdk", "@pearos/shared-types", "@pearos/ui"] };
export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	output: "standalone",
	outputFileTracingRoot: process.cwd(),
	experimental: {
		optimizePackageImports: ["@radix-ui/react-icons"],
	},
};

export default nextConfig;


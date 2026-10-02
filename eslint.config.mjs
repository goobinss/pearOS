import { fixupConfigRules } from "@eslint/compat";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...fixupConfigRules([...nextVitals, ...nextTs]),
  { settings: { next: { rootDir: "apps/web/" } } },
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/*.tsbuildinfo",
    "**/playwright-report/**",
    "**/test-results/**",
    "next-env.d.ts",
  ]),
]);

import "server-only";
import project from "../content/project.json";
import type { PublicConfig } from "./types";
export type { PublicConfig } from "./types";
export type Config = PublicConfig & {
  backendUrl: string | null;
  backendToken: string | null;
  protectionBypass: string | null;
};

export function readConfig(
  env: Record<string, string | undefined> = process.env,
): Config {
  const mode = env.DATA_MODE || "live";
  if (mode !== "demo" && mode !== "live") throw new Error("Invalid data mode");
  if (
    (env.PROJECT_NAME && env.PROJECT_NAME !== project.name) ||
    (env.PROJECT_SYMBOL && env.PROJECT_SYMBOL !== project.symbol)
  )
    throw new Error("Project identity differs from reviewed content");
  const owner = env.GITHUB_OWNER || "goobinss",
    repo = env.GITHUB_REPO || "pearOS";
  if (
    !/^[a-zA-Z0-9-]{1,39}$/.test(owner) ||
    !/^[a-zA-Z0-9_.-]{1,100}$/.test(repo)
  )
    throw new Error("Invalid GitHub repository");
  let backendUrl: string | null = null;
  if (env.BACKEND_URL) {
    const url = new URL(env.BACKEND_URL);
    const local =
      env.VERCEL !== "1" &&
      ["127.0.0.1", "localhost"].includes(url.hostname) &&
      url.protocol === "http:";
    const hosts = (env.BACKEND_ALLOWED_HOSTS || "")
      .split(",")
      .map((host) => host.trim());
    if (
      (!local &&
        (url.protocol !== "https:" || !hosts.includes(url.hostname))) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error("Backend requires an allowlisted HTTPS origin");
    backendUrl = url.origin;
  }
  const backendToken = env.BACKEND_READ_TOKEN || null;
  if (backendToken && !/^[A-Za-z0-9_-]{32,256}$/.test(backendToken))
    throw new Error("Invalid backend credential");
  const demoAddress =
    mode === "demo" &&
    /^0x[0-9a-fA-F]{40}$/.test(env.PROJECT_TOKEN_ADDRESS || "")
      ? env.PROJECT_TOKEN_ADDRESS!
      : null;
  return {
    mode,
    projectName: project.name,
    symbol: project.symbol,
    githubUrl: `https://github.com/${owner}/${repo}`,
    chainId: null,
    networkType: null,
    explorerUrl: null,
    projectAddress: demoAddress,
    referenceAddress: null,
    treasuryAddress: null,
    marketUrl: null,
    backendUrl,
    backendToken,
    protectionBypass: env.BACKEND_VERCEL_BYPASS || null,
  };
}
export function publicConfig(config: Config): PublicConfig {
  const {
    backendUrl: _url,
    backendToken: _token,
    protectionBypass: _bypass,
    ...visible
  } = config;
  void _url;
  void _token;
  void _bypass;
  return visible;
}

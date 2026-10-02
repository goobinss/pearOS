import type { Asset } from "./types";
export function assetKey(asset: Asset) {
  return `${asset.chainId}:${asset.kind}:${asset.address?.toLowerCase() || "native"}`;
}

import { Pear } from "@pearos/sdk";
import { readConfig } from "@/lib/config";
import { getActivity, getDashboard, getHistory, getTreasury, ratioResponse } from "@/lib/dashboard";
export const dynamic = "force-dynamic";
const routes = new Set(["dashboard", "treasury", "history", "transactions", "pear-ratio", "projects", "wallet"]);
export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (path.length !== 1 || !routes.has(path[0])) return Response.json({ error: "Not found" }, { status: 404 });
  const route = path[0];
  const config = readConfig();
  if (route === "wallet") {
    const address = new URL(request.url).searchParams.get("address") || "";
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return Response.json({ error: "Valid wallet address required" }, { status: 400 });
    if (!config.apiUrl) return Response.json({ error: "Wallet API is unavailable" }, { status: 503 });
    try { return Response.json(await new Pear({ apiUrl: config.apiUrl }).getWallet(address), { headers: { "Cache-Control": "no-store" } }); }
    catch { return Response.json({ error: "Wallet API is unavailable" }, { status: 503 }); }
  }
  let result: unknown;
  if (route === "dashboard") result = await getDashboard();
  else if (route === "treasury") result = await getTreasury();
  else if (route === "history") result = await getHistory();
  else if (route === "transactions") result = await getActivity();
  else if (route === "pear-ratio") result = ratioResponse(await getDashboard());
  else result = (await getDashboard()).project;
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}

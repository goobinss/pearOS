import { getDashboard } from "@/lib/backend";

export const dynamic = "force-dynamic";

/** The same read-only ledger shown in Treasury. No mutation methods are exported. */
export async function GET() {
  try {
    const data = await getDashboard();
    return Response.json(data.treasury, {
      status: data.config.mode === "demo" || data.connected ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json(
      {
        status: "unavailable",
        data: null,
        reason: "Treasury configuration or reviewed content is invalid",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

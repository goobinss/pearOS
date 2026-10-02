import { getDashboard } from "@/lib/backend";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getDashboard();
    const available = data.config.mode === "demo" || data.connected;
    return Response.json(data.ratio, {
      status: available ? 200 : 503,
      headers: {
        "Cache-Control":
          data.config.mode === "demo"
            ? "public, max-age=30, s-maxage=60"
            : "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json(
      {
        mode: process.env.DATA_MODE === "demo" ? "demo" : "live",
        status: "unavailable",
        ratio: null,
        reason: "Invalid application configuration",
      },
      { status: 503 },
    );
  }
}

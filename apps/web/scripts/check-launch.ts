import { loadDashboard } from "../lib/backend";
import { readConfig } from "../lib/config";
async function check() {
  const config = readConfig();
  const data = await loadDashboard(config);
  const checks = [
    ["Live mode", config.mode === "live"],
    ["Authenticated backend and matching reviewed content", data.connected],
    ...(process.argv.includes("--community")
      ? []
      : [
          ["Fresh treasury read", data.treasury.balances.status === "ok"],
          ["Verified live prices", data.ratio.status === "ok"],
        ]),
  ] as [string, boolean][];
  for (const [label, passed] of checks)
    console.log(`${passed ? "PASS" : "PENDING"} ${label}`);
  if (checks.some(([, passed]) => !passed)) process.exitCode = 1;
}
check().catch(() => {
  console.error("PENDING Application configuration invalid");
  process.exitCode = 1;
});

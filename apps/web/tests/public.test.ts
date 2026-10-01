import test from "node:test";
import assert from "node:assert/strict";
import { readConfig } from "../lib/config";
import { demoDashboard, demoTreasury } from "../lib/demo";
import { getActivity, getDashboard, getTreasury, unavailableDashboard } from "../lib/dashboard";
import { calculatePearRatio } from "../lib/pear-ratio";
import { validateCard } from "../lib/studio";

test("demo observations stay explicitly simulated", () => {
  const data = demoDashboard(readConfig({ DEMO_MODE: "true" }));
  assert.equal(data.mode, "demo");
  assert.equal(data.ratio.status, "demo");
  assert.equal(data.ratio.data?.pearsPerApple, "100000");
});
test("missing API produces unavailable public state without demo prices", () => {
  const data = unavailableDashboard(readConfig({}));
  assert.equal(data.mode, "live");
  assert.equal(data.ratio.status, "unavailable");
  assert.equal(data.ratio.data, null);
});
test("public card and ratio utilities validate user data", () => {
  assert.equal(calculatePearRatio("250", "0.0025"), "100000");
  assert.throws(() => calculatePearRatio("250", "0"));
  assert.equal(validateCard({ name: "Pear", description: "Fictional", template: "keynote" }).name, "Pear");
  assert.throws(() => validateCard({ name: "", description: "Fictional", template: "keynote" }));
});

test("live web rejects remote demo market and treasury observations", async () => {
  const oldFetch = globalThis.fetch;
  const oldApi = process.env.PEAR_PUBLIC_API_URL;
  const oldDemo = process.env.DEMO_MODE;
  process.env.PEAR_PUBLIC_API_URL = "https://api.example.test";
  process.env.DEMO_MODE = "false";
  const demoConfig = readConfig({ DEMO_MODE: "true" });
  globalThis.fetch = async (input) => {
    const path = new URL(String(input)).pathname;
    if (path === "/v1/dashboard") return Response.json(demoDashboard(demoConfig));
    if (path === "/v1/treasury") return Response.json(demoTreasury(demoConfig));
    return Response.json({ data: [], status: "demo", source: "mock", observedAt: null, fetchedAt: new Date().toISOString() });
  };
  try {
    assert.equal((await getDashboard()).ratio.status, "unavailable");
    assert.equal((await getTreasury()).balances.status, "unavailable");
    assert.equal((await getActivity()).status, "unavailable");
  } finally {
    globalThis.fetch = oldFetch;
    if (oldApi === undefined) delete process.env.PEAR_PUBLIC_API_URL;
    else process.env.PEAR_PUBLIC_API_URL = oldApi;
    if (oldDemo === undefined) delete process.env.DEMO_MODE;
    else process.env.DEMO_MODE = oldDemo;
  }
});

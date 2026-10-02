import test from "node:test";
import assert from "node:assert/strict";
import { readConfig, publicConfig } from "../lib/config";
import { loadDashboard } from "../lib/backend";
import { contentDigest } from "../lib/content";
import { amount } from "../components/format";

const credential = "boundary-test-" + "a".repeat(40);
const config = readConfig({
  DATA_MODE: "live",
  BACKEND_URL: "https://core.fixture.invalid",
  BACKEND_ALLOWED_HOSTS: "core.fixture.invalid",
  BACKEND_READ_TOKEN: credential,
  BACKEND_VERCEL_BYPASS: "fixture-bypass",
});
async function response() {
  const empty = await loadDashboard(readConfig({}));
  return {
    version: 1,
    contentDigest,
    contentRevision: "1".repeat(40),
    config: empty.config,
    ratio: empty.ratio,
    bounties: [],
    treasury: empty.treasury,
  };
}
test("public configuration keeps backend credentials server-only and restricts the destination", () => {
  assert.ok(!JSON.stringify(publicConfig(config)).includes(credential));
  assert.ok(!JSON.stringify(publicConfig(config)).includes("fixture-bypass"));
  for (const changes of [
    { BACKEND_URL: "http://core.fixture.invalid" },
    { BACKEND_URL: "https://evil.invalid" },
    { BACKEND_URL: "https://core.fixture.invalid?key=x" },
    { BACKEND_URL: "https://core.fixture.invalid/path" },
    { BACKEND_READ_TOKEN: "short" },
    { PROJECT_SYMBOL: "P2A" },
    { BACKEND_URL: "http://127.0.0.1:3001", VERCEL: "1" },
  ])
    assert.throws(() =>
      readConfig({
        DATA_MODE: "live",
        BACKEND_URL: "https://core.fixture.invalid",
        BACKEND_ALLOWED_HOSTS: "core.fixture.invalid",
        BACKEND_READ_TOKEN: credential,
        ...changes,
      }),
    );
});
test("backend reads are authenticated, bounded and tied to the exact public content", async () => {
  const original = globalThis.fetch;
  const data = await response();
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://core.fixture.invalid/v1/dashboard");
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("authorization"), `Bearer ${credential}`);
    assert.equal(headers.get("x-pear-content-digest"), contentDigest);
    assert.equal(headers.get("x-vercel-protection-bypass"), "fixture-bypass");
    assert.equal(init?.redirect, "error");
    assert.ok(init?.signal);
    return Response.json(data);
  };
  try {
    const loaded = await loadDashboard(config);
    assert.equal(loaded.connected, true);
    assert.deepEqual(loaded.treasury, data.treasury);
    assert.ok(!JSON.stringify(loaded).includes(credential));
  } finally {
    globalThis.fetch = original;
  }
});
test("failures, redirects, mismatched content and synthetic responses withhold all live rewards", async () => {
  const original = globalThis.fetch;
  const data = await response();
  try {
    for (const bad of [
      () => Response.json({}, { status: 401 }),
      () => Response.json({}, { status: 409 }),
      () => new Response("login", { headers: { "Content-Type": "text/html" } }),
      () => Response.json({ ...data, contentDigest: "wrong" }),
      () => Response.json({ ...data, ratio: { ...data.ratio, mode: "demo" } }),
      () =>
        Response.json({
          ...data,
          treasury: {
            ...data.treasury,
            balances: { ...data.treasury.balances, source: "DEMO fixture" },
          },
        }),
      () => {
        throw new Error(`Sensitive provider error ${credential}`);
      },
    ]) {
      globalThis.fetch = async () => bad();
      const loaded = await loadDashboard(config);
      assert.equal(loaded.connected, false);
      assert.equal(loaded.ratio.ratio, null);
      assert.deepEqual(loaded.bounties, []);
      assert.deepEqual(loaded.treasury.budget.accounts, []);
      assert.equal(loaded.treasury.balances.data, null);
      assert.ok(!JSON.stringify(loaded).includes(credential));
    }
  } finally {
    globalThis.fetch = original;
  }
});
test("explicit demo stays offline and exact display values do not lose precision", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("No network expected");
  };
  try {
    const config = readConfig({ DATA_MODE: "demo" });
    assert.deepEqual(await loadDashboard(config), await loadDashboard(config));
    assert.equal((await loadDashboard(config)).ratio.ratio, "100000");
    assert.deepEqual(
      (await loadDashboard(config)).treasury.budget.accounts,
      [],
    );
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(
    amount("123456789012345678.901234567890123456", 36),
    "123,456,789,012,345,678.901234567890123456",
  );
});

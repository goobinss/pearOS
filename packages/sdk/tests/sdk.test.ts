import test from "node:test";
import assert from "node:assert/strict";
import { Pear, PearApiError } from "../src/index";

test("SDK calls only documented read routes with no credentials", async () => {
  const calls: Array<{ url: string; method: string | undefined; authorization: string | null }> = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input);
    const headers = new Headers(init?.headers);
    calls.push({ url, method: init?.method, authorization: headers.get("authorization") });
    return Response.json({ status: "unavailable", data: null });
  };
  const pear = new Pear({ apiUrl: "https://api.example.test", fetch: fetcher });
  await pear.getStats();
  await pear.getActivity();
  await pear.getProjects();
  await pear.getWallet("0x1111111111111111111111111111111111111111");
  assert.deepEqual(calls.map((call) => new URL(call.url).pathname), ["/v1/pear-ratio", "/v1/transactions", "/v1/projects", "/v1/wallet"]);
  assert.ok(calls.every((call) => !call.method && !call.authorization));
});
test("SDK rejects unsafe URLs and malformed wallet addresses", async () => {
  assert.throws(() => new Pear({ apiUrl: "http://remote.example.test" }));
  assert.throws(() => new Pear({ apiUrl: "https://user:pass@remote.example.test" }));
  const pear = new Pear({ apiUrl: "http://localhost:3001" });
  assert.throws(() => pear.getWallet("not-an-address"));
});
test("SDK reports HTTP errors without leaking response details", async () => {
  const pear = new Pear({ apiUrl: "https://api.example.test", fetch: async () => new Response("internal details", { status: 503 }) });
  await assert.rejects(() => pear.getStats(), (error: unknown) => error instanceof PearApiError && error.status === 503 && !error.message.includes("internal details"));
});

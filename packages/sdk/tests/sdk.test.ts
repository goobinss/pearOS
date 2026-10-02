import test from "node:test";
import assert from "node:assert/strict";
import { Pear, PearApiError } from "../src/index";
test("client reads only public ratio, preserves demo provenance and bounds requests", async () => {
  let requested = "";
  const pear = new Pear({
    apiUrl: "https://pear.example",
    fetch: async (input, init) => {
      requested = String(input);
      assert.ok(init?.signal);
      return Response.json({ mode: "demo", status: "ok", ratio: "100000" });
    },
  });
  assert.equal((await pear.getRatio()).mode, "demo");
  assert.equal(requested, "https://pear.example/api/pear-ratio");
});
test("client rejects unsafe URL and failed or malformed responses", async () => {
  for (const apiUrl of [
    "http://remote.example",
    "https://user:pass@pear.example",
    "https://pear.example?secret=x",
    "https://pear.example/v1",
  ])
    assert.throws(() => new Pear({ apiUrl }));
  await assert.rejects(
    new Pear({
      apiUrl: "https://pear.example",
      fetch: async () => new Response(null, { status: 503 }),
    }).getRatio(),
    PearApiError,
  );
  await assert.rejects(
    new Pear({
      apiUrl: "https://pear.example",
      fetch: async () => Response.json({ ratio: 123 }),
    }).getRatio(),
  );
});

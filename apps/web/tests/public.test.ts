import test from "node:test";
import assert from "node:assert/strict";
import { readConfig } from "../lib/config";
import { demoDashboard } from "../lib/demo";
import { unavailableDashboard } from "../lib/dashboard";
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

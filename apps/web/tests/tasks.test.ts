import test from "node:test";
import assert from "node:assert/strict";
import proposals from "../content/task-proposals.json";
import {
  validateTaskProposals,
  proposalConversationUrl,
} from "../lib/task-proposals";
import { buildFilters, buildFilterUrl } from "../lib/build-filters";

test("planning requests require complete instructions and cannot promise reward or assignment", () => {
  const tasks = validateTaskProposals(proposals);
  assert.equal(tasks.length, 2);
  for (const change of [
    { state: "Approved" },
    { reward: { amount: "100" } },
    { assignedTo: "person" },
    { steps: [] },
    { deliverables: [null] },
    { id: "../escape" },
  ]) {
    assert.throws(() => validateTaskProposals([{ ...tasks[0], ...change }]));
  }
  assert.throws(() => validateTaskProposals([tasks[0], tasks[0]]));
});

test("proposal links open an encoded draft in the configured repo without authorization or credentials", () => {
  const task = validateTaskProposals(proposals)[0];
  const url = new URL(
    proposalConversationUrl(task, "https://github.com/goobinss/pearOS")!,
  );
  assert.equal(url.origin, "https://github.com");
  assert.equal(url.pathname, "/goobinss/pearOS/issues/new");
  assert.equal(url.searchParams.get("title"), `[Task proposal] ${task.title}`);
  assert.match(
    url.searchParams.get("body")!,
    /exact reward terms before I begin paid work/,
  );
  assert.match(url.searchParams.get("body")!, /No account creation/);
  assert.equal(proposalConversationUrl(task, null), null);
  assert.throws(() =>
    proposalConversationUrl(task, "https://github.com.evil.test/owner/repo"),
  );
  assert.throws(() =>
    proposalConversationUrl(task, "https://github.com/owner/repo?token=secret"),
  );
  assert.throws(() =>
    proposalConversationUrl(
      task,
      "https://user:password@github.com/owner/repo",
    ),
  );
});

test("filter URLs preserve combined selection and ignore untrusted or repeated query values", () => {
  assert.deepEqual(
    buildFilters({ category: "Community", status: "Planning" }),
    { category: "Community", state: "Planning" },
  );
  assert.deepEqual(
    buildFilters({ category: ["Design", "Engineering"], status: "<script>" }),
    { category: "All", state: "All" },
  );
  assert.equal(
    buildFilterUrl("Community", "Planning"),
    "/build?category=Community&status=Planning",
  );
  assert.equal(buildFilterUrl("All", "All"), "/build");
});

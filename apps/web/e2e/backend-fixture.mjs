// Public contract fixture only. Financial implementation is tested in Pear Core.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const names = [
  "project",
  "bounties",
  "payouts",
  "budget-policies",
  "receipts",
  "disbursements",
  "support-rounds",
  "task-proposals",
];
const content = Object.fromEntries(
  names.map((name) => [
    name,
    JSON.parse(readFileSync(`content/${name}.json`, "utf8")),
  ]),
);
const digest = createHash("sha256")
  .update(JSON.stringify(content))
  .digest("hex");
const observation = {
  data: null,
  status: "unconfigured",
  source: "Reviewed backend contract fixture",
  observedAt: null,
  fetchedAt: "2026-10-01T12:00:00.000Z",
  reason: "Token data pending",
};
const data = {
  version: 1,
  contentDigest: digest,
  contentRevision: "a".repeat(40),
  config: {
    mode: "live",
    symbol: "A2P",
    projectName: "PEAR",
    chainId: null,
    networkType: null,
    explorerUrl: null,
    projectAddress: null,
    referenceAddress: null,
    treasuryAddress: null,
    marketUrl: null,
    githubUrl: "https://github.com/goobinss/pearOS",
  },
  ratio: {
    mode: "live",
    status: "unconfigured",
    ratio: null,
    currency: null,
    unitBasis: "Whole project tokens per one whole AAPL Stock Token",
    source: "Pear Core",
    observedAt: null,
    fetchedAt: observation.fetchedAt,
    reason: "Both timestamped prices required",
    observations: { project: observation, reference: observation },
  },
  bounties: [],
  treasury: {
    mode: "live",
    address: null,
    explorerUrl: null,
    balances: observation,
    commitments: [],
    payouts: [],
    budget: {
      policies: content["budget-policies"],
      receipts: [],
      accounts: [],
      disbursements: [],
      rounds: [],
    },
  },
};
createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  if (request.url === "/health") {
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }
  if (
    request.headers.authorization !== `Bearer ${process.env.CORE_READ_TOKEN}`
  ) {
    response.statusCode = 401;
    response.end("{}");
    return;
  }
  if (request.headers["x-pear-content-digest"] !== digest) {
    response.statusCode = 409;
    response.end("{}");
    return;
  }
  response.end(JSON.stringify(data));
}).listen(3210, "127.0.0.1");

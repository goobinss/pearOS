import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
const routes = ["/", "/terminal", "/build", "/treasury"];
test("PEAR identity and proposed tokenomics stay separate from funded rewards in both modes", async ({
  page,
  request,
}) => {
  for (const origin of ["http://127.0.0.1:3200", "http://127.0.0.1:3201"]) {
    await page.goto(`${origin}/terminal`);
    await expect(
      page.getByRole("heading", { name: "A2P", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("PEAR · project token", { exact: true }),
    ).toBeVisible();
    await page.goto(`${origin}/treasury`);
    await expect(
      page.getByText("PROPOSAL · NOT ACTIVE", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "No reviewed receipts. No funded reward budget.",
      }),
    ).toBeVisible();
    await expect(page.locator(".allocation-percent")).toHaveText([
      "35%",
      "25%",
      "20%",
      "10%",
      "10%",
    ]);
    const response = await request.get(`${origin}/api/treasury`);
    expect(response.status()).toBe(origin.endsWith("3200") ? 200 : 503);
    expect(response.headers()["cache-control"]).toBe("no-store");
    const treasury = await response.json();
    expect(treasury.mode).toBe(origin.endsWith("3200") ? "demo" : "live");
    expect(treasury.budget.receipts).toEqual([]);
    expect(treasury.budget.accounts).toEqual([]);
    expect((await request.post(`${origin}/api/treasury`)).status()).toBe(405);
  }
});
test("connected live frontend reads the authenticated backend and keeps its credential out of browser output", async ({
  page,
  request,
}) => {
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3203${route}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".backend-notice")).toHaveCount(0);
    expect(await page.content()).not.toContain("pearos-server-boundary-canary");
  }
  const treasury = await request.get("http://127.0.0.1:3203/api/treasury");
  expect(treasury.status()).toBe(200);
  expect((await treasury.json()).mode).toBe("live");
  expect(treasury.headers()["cache-control"]).toBe("no-store");
  for (const source of await page
    .locator("script[src]")
    .evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLScriptElement).src),
    ))
    expect(await (await request.get(source)).text()).not.toContain(
      "pearos-server-boundary-canary",
    );
});
for (const width of [1440, 390, 360]) {
  test(`four demo screens at ${width}px: provenance, accessibility and no overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await expect(
        page.getByText("DEMO WORKSPACE", { exact: true }),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.viewport);
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      await expect(
        page.getByRole("button", { name: /Connect wallet/i }),
      ).toHaveCount(0);
      if (width !== 360) {
        mkdirSync("../../docs/screenshots/tokenomics", { recursive: true });
        await page.screenshot({
          path: `../../docs/screenshots/tokenomics/${route.slice(1) || "home"}-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}
test("navigation and keyboard filters/disclosures work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Build Pear" })
    .click();
  await expect(page).toHaveURL(/\/build$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.locator(".task-card")).toHaveCount(6);
  const engineering = page.getByRole("link", {
    name: "Engineering",
    exact: true,
  });
  await engineering.focus();
  await page.keyboard.press("Enter");
  await expect(engineering).toHaveAttribute("aria-current", "true");
  await engineering.focus();
  expect(
    await engineering.evaluate((e) => getComputedStyle(e).outlineStyle),
  ).not.toBe("none");
  await expect(page.locator(".bounty-card")).toHaveCount(1);
  const criteria = page.locator("summary").first();
  await criteria.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.getByLabel("Status", { exact: true }).selectOption("Approved");
  await page.getByRole("button", { name: "Apply status", exact: true }).click();
  await expect(page.locator(".bounty-card")).toHaveCount(0);
  await expect(page.getByText("No tasks match these filters")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Filter by category" })
    .getByRole("link", { name: "All", exact: true })
    .click();
  await expect(page.locator(".bounty-card")).toHaveCount(1);
  await expect(
    page.getByText("DEMO · Recorded payment — unverified", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Status", { exact: true }).selectOption("Paid");
  await page.getByRole("button", { name: "Apply status", exact: true }).click();
  await expect(page.locator(".bounty-card")).toHaveCount(0);
});
test("unconfigured live screens never display demo values or fake identities", async ({
  page,
  request,
}) => {
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3201${route}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByText("LIVE · READ ONLY", { exact: true }),
    ).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(
      /100,000|1,250|DEMO|0x[a-f0-9]{40}|Make every pear accessible/,
    );
    await expect(
      page.locator(".bounty-card:not(.community-task-card)"),
    ).toHaveCount(0);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:3201${route}`);
      await expect(page.locator("h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      mkdirSync("../../docs/screenshots/tokenomics", { recursive: true });
      await page.screenshot({
        path: `../../docs/screenshots/tokenomics/live-${route.slice(1) || "home"}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.goto("http://127.0.0.1:3201/terminal");
  await expect(
    page.getByRole("button", { name: "Market not verified" }),
  ).toBeDisabled();
  const r = await request.get("http://127.0.0.1:3201/api/pear-ratio");
  const body = await r.json();
  expect(body.mode).toBe("live");
  expect(body.ratio).toBeNull();
  expect(body.status).toBe("unconfigured");
  const studio = await request.get("/studio");
  expect(studio.status()).toBe(404);
});
test("all categories and combined status filters persist in the URL", async ({
  page,
}) => {
  await page.goto("/build");
  const categories = page.getByRole("navigation", {
    name: "Filter by category",
  });
  for (const [category, count] of [
    ["Engineering", 1],
    ["Design", 1],
    ["Community", 4],
  ] as const) {
    await categories.getByRole("link", { name: category, exact: true }).click();
    await expect(page.locator(".task-card")).toHaveCount(count);
    await expect(page).toHaveURL(new RegExp(`category=${category}`));
  }
  await page.getByLabel("Status", { exact: true }).selectOption("Planning");
  await page.getByRole("button", { name: "Apply status", exact: true }).click();
  await expect(page.locator(".task-card")).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue(
    "Planning",
  );
  await expect(page.locator(".task-card")).toHaveCount(2);
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  await expect(page.locator(".task-card")).toHaveCount(6);
});

test("filtering, instructions and proposal downloads work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3201/build");
    await expect(page.locator(".task-card")).toHaveCount(2);
    await page
      .getByRole("navigation", { name: "Filter by category" })
      .getByRole("link", { name: "Design", exact: true })
      .click();
    await expect(page.getByText("No tasks match these filters")).toBeVisible();
    await page
      .getByRole("link", { name: "Clear filters", exact: true })
      .click();
    await page.getByLabel("Status", { exact: true }).selectOption("Planning");
    await page
      .getByRole("button", { name: "Apply status", exact: true })
      .click();
    await expect(page.locator(".task-card")).toHaveCount(2);
    await page.getByText("New to GitHub? Start here", { exact: true }).click();
    await expect(page.locator("#getting-started")).toHaveAttribute("open", "");
    const card = page.locator("#community-x");
    await card.getByText("How to help, step by step", { exact: true }).click();
    await expect(
      card.getByRole("heading", { name: "How the owner reviews it" }),
    ).toBeVisible();
    await expect(
      card.getByText("To be confirmed", { exact: true }),
    ).toBeVisible();
    const proposal = new URL(
      (await card
        .getByRole("link", { name: "Open proposal on GitHub" })
        .getAttribute("href"))!,
    );
    expect(proposal.origin).toBe("https://github.com");
    expect(proposal.pathname).toBe("/goobinss/pearOS/issues/new");
    expect(proposal.searchParams.get("body")).toContain(
      "exact reward terms before I begin paid work",
    );
    const downloadPromise = page.waitForEvent("download");
    await card
      .getByRole("link", { name: "Download proposal template" })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("community-x.txt");
    expect(await download.failure()).toBeNull();
    const template = await page.request.get(
      "http://127.0.0.1:3201/task-templates/community-discord.txt",
    );
    expect(template.status()).toBe(200);
    expect(await template.text()).toContain("before any paid work");
  } finally {
    await context.close();
  }
});
test("API provenance, cache headers, read-only surface and external links", async ({
  page,
  request,
}) => {
  const a = await request.get("/api/pear-ratio"),
    b = await request.get("/api/pear-ratio");
  const body = await a.json();
  expect(body.mode).toBe("demo");
  expect(body.ratio).toBe("100000");
  expect(body.observations.project.source).toContain("DEMO");
  expect(body).toEqual(await b.json());
  expect(a.headers()["cache-control"]).toContain("s-maxage=60");
  expect((await request.post("/api/pear-ratio")).status()).toBe(405);
  expect((await request.get("/api/wallet?address=anything")).status()).toBe(
    404,
  );
  await page.goto("/build");
  await expect(
    page.locator('a[href="https://example.com/demo-deliverable"]'),
  ).toHaveCount(0);
  for (const link of await page.locator('a[target="_blank"]').all()) {
    expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
    expect(await link.getAttribute("rel")).toContain("noreferrer");
  }
});
test("reduced motion keeps controls usable without animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".button")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  await page.getByRole("link", { name: "Find a bounty", exact: true }).click();
  await expect(page).toHaveURL(/\/build$/);
});

test("copy-address feedback, full identity and safe GitHub links", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("http://127.0.0.1:3202/terminal");
  await page
    .getByRole("button", { name: "Copy project token address" })
    .click();
  await expect(page.getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "0x1111111111111111111111111111111111111111",
  );
  await page.getByText("Full address", { exact: true }).click();
  await expect(page.locator(".full-address")).toHaveText(
    "0x1111111111111111111111111111111111111111",
  );
  const github = page
    .getByRole("navigation")
    .getByRole("link", { name: "GitHub" });
  await expect(github).toHaveAttribute(
    "href",
    "https://github.com/goobinss/pearOS",
  );
  await expect(github).toHaveAttribute("rel", "noreferrer");
  const scripts = await page
    .locator("script[src]")
    .evaluateAll((nodes) => nodes.map((n) => (n as HTMLScriptElement).src));
  expect(await page.content()).not.toContain("pearos-server-boundary-canary");
  for (const src of scripts) {
    expect(await (await page.request.get(src)).text()).not.toContain(
      "pearos-server-boundary-canary",
    );
  }
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Builder Bench without starter content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Builder Bench \| Platform App Builder Study Coach<\/title>/i);
  assert.match(html, /Loading your study bench/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships the complete weighted question bank", async () => {
  const source = await readFile(new URL("../app/questions.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/\n\s+id: "([^"]+)",/g)].map((match) => match[1]);

  // Deliberately a floor rather than an exact count: the bank grows as topics are
  // mined, and an exact assertion fails on every addition without catching anything.
  assert.ok(ids.length >= 100, `expected at least 100 questions, found ${ids.length}`);
  assert.equal(new Set(ids).size, ids.length, "question ids must be unique");
  assert.match(source, /"Salesforce Fundamentals": 23/);
  assert.match(source, /"Data Modeling and Management": 22/);
  assert.match(source, /"Business Logic and Process Automation": 28/);
  assert.match(source, /"User Interface": 17/);
  assert.match(source, /"App Deployment": 10/);
});

test("builds a GitHub Pages site under the repository path", async () => {
  const html = await readFile(new URL("../pages-dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /\/salesforce-platform-app-builder-study-coach\/assets\/[^"']+\.js/);
  assert.match(html, /\/salesforce-platform-app-builder-study-coach\/assets\/[^"']+\.css/);
  assert.match(html, /Builder Bench \| Platform App Builder Study Coach/);
  assert.match(html, /site\.webmanifest/);
  assert.match(html, /builder-bench-icon-180\.png/);
});

test("ships installable phone app metadata and guidance", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../pages-dist/site.webmanifest", import.meta.url), "utf8"),
  );
  const source = await readFile(new URL("../app/StudyCoach.tsx", import.meta.url), "utf8");

  assert.equal(manifest.short_name, "Builder Bench");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.deepEqual(
    manifest.icons.map((icon) => icon.sizes),
    ["192x192", "512x512"],
  );
  assert.match(source, /Add to Home Screen/);
  assert.match(source, /beforeinstallprompt/);
});

test("creates a structured GitHub study check-in without embedding credentials", async () => {
  const source = await readFile(new URL("../app/StudyCoach.tsx", import.meta.url), "utf8");
  const template = await readFile(
    new URL("../.github/ISSUE_TEMPLATE/study-check-in.md", import.meta.url),
    "utf8",
  );

  assert.match(source, /salesforce-platform-app-builder-study-coach\/issues\/new/);
  assert.match(source, /builder-bench-check-in:v1/);
  assert.match(source, /Publish check-in for review/);
  assert.match(source, /Nothing is posted until you tap Submit new issue/);
  assert.doesNotMatch(source, /github_pat_|ghp_|Authorization:\s*Bearer/i);
  assert.match(template, /labels: study-check-in/);
});

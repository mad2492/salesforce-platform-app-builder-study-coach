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

  assert.equal(ids.length, 25);
  assert.equal(new Set(ids).size, 25);
  assert.match(source, /"Salesforce Fundamentals": 23/);
  assert.match(source, /"Data Modeling and Management": 22/);
  assert.match(source, /"Business Logic and Process Automation": 28/);
  assert.match(source, /"User Interface": 17/);
  assert.match(source, /"App Deployment": 10/);
});


import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/digest.html", import.meta.url), "utf8");
const markdown = await readFile(new URL("../docs/niche-facts.md", import.meta.url), "utf8");

// Strip the <style> block before checking for stray markdown: CSS comments
// legitimately contain asterisks.
const body = html.replace(/<style>[\s\S]*?<\/style>/g, "");

test("converts every markdown marker — no raw syntax reaches the reader", () => {
  // These are the two bugs that shipped on the first attempt: bold spanning a
  // line break, and bold containing italic. Both left literal ** on the page.
  assert.doesNotMatch(body, /\*\*/, "unconverted bold markers in the output");
  assert.doesNotMatch(body, /\|\s*---/, "unconverted table separator in the output");
  assert.doesNotMatch(body, /^\s*#{1,3}\s/m, "unconverted heading in the output");
});

test("carries every section of the digest", () => {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  assert.ok(headings.length >= 10, `expected a substantial digest, found ${headings.length} sections`);
  for (const heading of headings) {
    const plain = heading.replace(/[*`]/g, "");
    assert.ok(
      body.includes(plain),
      `section missing from the rendered digest: ${plain}`,
    );
  }
});

test("keeps a wrapped numbered item inside its list", () => {
  // A numbered item that wraps onto a second source line used to end the list:
  // the continuation became its own paragraph and the next item restarted at 1.
  // Counting <li> would not catch it — the split list keeps every item. Count
  // the lists themselves: one markdown block holding numbered lines is one <ol>.
  const prose = body.replace(/<nav class="toc"[\s\S]*?<\/nav>/, "");
  const renderedLists = [...prose.matchAll(/<ol>/g)].length;
  const sourceLists = markdown
    .split(/\n\s*\n/)
    .filter((block) => /^\s*\d+\.\s+/m.test(block)).length;
  assert.equal(
    renderedLists,
    sourceLists,
    `each numbered list should render as one <ol>: ${sourceLists} in source, ${renderedLists} rendered`,
  );
});

test("renders tables rather than dropping them", () => {
  const sourceTables = [...markdown.matchAll(/^\|[\s:|-]+\|$/gm)].length;
  const renderedTables = [...body.matchAll(/<table>/g)].length;
  assert.equal(
    renderedTables,
    sourceTables,
    `every markdown table should render: ${sourceTables} in source, ${renderedTables} rendered`,
  );
});

test("is readable and self-contained", () => {
  // No webfonts or external assets — this has to work offline as part of the PWA.
  assert.doesNotMatch(html, /<link[^>]+href="https?:/i, "external stylesheet would break offline use");
  assert.doesNotMatch(html, /@import/i, "external font import would break offline use");
  assert.match(html, /prefers-color-scheme: dark/, "should support low-light reading");
  assert.match(html, /viewport/, "must be mobile-viewport aware");
  assert.match(html, /Back to Builder Bench/, "needs a way back to the app");
});

import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// The app sources use extensionless relative imports (bundler resolution).
// Node's ESM resolver needs the ".ts" spelled out, so add it on the way through.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^\.{1,2}\//.test(specifier) && !/\.(ts|mts|js|mjs|json)$/.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        // Fall through to the default resolution below.
      }
    }
    return nextResolve(specifier, context);
  },
});

const { questions, domainWeights } = await import("../app/questions.ts");
const { buildQuestionStates, selectSession, multiSelectGap, domainAccuracy, domainNeeds } =
  await import("../app/engine.ts");

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.parse("2026-07-01T12:00:00.000Z");
const domains = Object.keys(domainWeights);

const byDomain = (domain) => questions.filter((question) => question.domain === domain);
const singleAnswer = questions.filter((question) => question.answers.length === 1);
const multiAnswer = questions.filter((question) => question.answers.length > 1);

function answer(question, correct, at) {
  return {
    questionId: typeof question === "string" ? question : question.id,
    correct,
    selected: [],
    answeredAt: new Date(at).toISOString(),
  };
}

/** Deterministic stand-in for Math.random so selection can be asserted exactly. */
function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

test("buildQuestionStates: a miss drops to box 1 and is due immediately", () => {
  const question = questions[0];
  const states = buildQuestionStates([answer(question, false, T0 - DAY)], T0);
  const state = states.get(question.id);

  assert.equal(state.attempts, 1);
  assert.equal(state.correct, 0);
  assert.equal(state.box, 1);
  assert.equal(state.dueAt, T0 - DAY);
  assert.ok(state.dueAt <= T0);
});

test("buildQuestionStates: the ladder is 1 -> 2 (+2d) -> 3 (+5d) -> graduated", () => {
  const question = questions[0];
  const log = [answer(question, false, T0 - 20 * DAY), answer(question, true, T0 - 15 * DAY)];

  let state = buildQuestionStates(log, T0).get(question.id);
  assert.equal(state.box, 2);
  assert.equal(state.dueAt, T0 - 15 * DAY + 2 * DAY);

  log.push(answer(question, true, T0 - 10 * DAY));
  state = buildQuestionStates(log, T0).get(question.id);
  assert.equal(state.box, 3);
  assert.equal(state.dueAt, T0 - 10 * DAY + 5 * DAY);

  log.push(answer(question, true, T0 - DAY));
  state = buildQuestionStates(log, T0).get(question.id);
  assert.equal(state.box, 0);
  assert.equal(state.dueAt, null);
  assert.equal(state.attempts, 4);
  assert.equal(state.correct, 3);
});

test("buildQuestionStates: a later miss resets a graduated question to box 1", () => {
  const question = questions[0];
  const states = buildQuestionStates(
    [
      answer(question, false, T0 - 30 * DAY),
      answer(question, true, T0 - 25 * DAY),
      answer(question, true, T0 - 20 * DAY),
      answer(question, true, T0 - 15 * DAY),
      answer(question, false, T0 - 2 * DAY),
    ],
    T0,
  );
  const state = states.get(question.id);
  assert.equal(state.box, 1);
  assert.equal(state.dueAt, T0 - 2 * DAY);
  assert.equal(state.lastAnsweredAt, T0 - 2 * DAY);
});

test("buildQuestionStates: never-missed questions stay in the normal pool", () => {
  const question = questions[0];
  const states = buildQuestionStates([answer(question, true, T0 - DAY)], T0);
  assert.equal(states.get(question.id).box, 0);
  assert.equal(states.get(question.id).dueAt, null);
});

test("buildQuestionStates: out-of-order, unknown, and future entries are handled", () => {
  const question = questions[0];
  const states = buildQuestionStates(
    [
      answer(question, true, T0 - 5 * DAY),
      answer(question, false, T0 - 10 * DAY),
      answer("no-such-question-id", false, T0 - DAY),
      answer(question, false, T0 + 5 * DAY),
    ],
    T0,
  );
  assert.equal(states.size, 1);
  // Replayed chronologically: miss at -10d then correct at -5d lands in box 2.
  assert.equal(states.get(question.id).box, 2);
  assert.equal(states.get(question.id).dueAt, T0 - 5 * DAY + 2 * DAY);
});

test("selectSession: day one produces a full, unique, weight-leaning spread", () => {
  const counts = {};
  for (const domain of domains) counts[domain] = 0;

  for (let run = 0; run < 400; run += 1) {
    const set = selectSession(10, [], T0, seeded(run + 1));
    assert.equal(set.length, 10);
    assert.equal(new Set(set.map((question) => question.id)).size, 10);
    for (const question of set) counts[question.domain] += 1;
  }

  // Every domain shows up, and the two heaviest ones lead.
  for (const domain of domains) assert.ok(counts[domain] > 0, `${domain} was never drawn`);
  assert.ok(counts["Business Logic and Process Automation"] > counts["App Deployment"]);
  assert.ok(counts["Salesforce Fundamentals"] > counts["App Deployment"]);
  assert.ok(counts["Salesforce Fundamentals"] > counts["User Interface"]);
});

test("selectSession: due reviews lead and are capped at 40% of the round", () => {
  const missed = questions.slice(0, 8);
  const log = missed.map((question, position) => answer(question, false, T0 - (30 - position) * DAY));

  const set = selectSession(10, log, T0, seeded(7));
  assert.equal(set.length, 10);
  const reviewIds = missed.map((question) => question.id);
  const leading = set.slice(0, 4).map((question) => question.id);
  assert.deepEqual(leading, reviewIds.slice(0, 4)); // oldest dueAt first
  assert.equal(set.filter((question) => reviewIds.includes(question.id)).length, 4);
});

test("selectSession: questions answered correctly in the last 24h are held back", () => {
  const domain = "App Deployment";
  const pool = byDomain(domain);
  const log = pool.map((question) => answer(question, true, T0 - 2 * 60 * 60 * 1000));

  for (let run = 0; run < 25; run += 1) {
    const set = selectSession(10, log, T0, seeded(run + 1));
    assert.equal(
      set.some((question) => question.domain === domain),
      false,
      "a domain with only recent correct answers should drop out of the draw",
    );
    assert.equal(set.length, 10);
  }

  // Once the cooldown lapses the domain is drawable again.
  const later = T0 + 2 * DAY;
  const seenLater = new Set();
  for (let run = 0; run < 60; run += 1) {
    for (const question of selectSession(10, log, later, seeded(run + 1))) {
      if (question.domain === domain) seenLater.add(question.id);
    }
  }
  assert.ok(seenLater.size > 0);
});

test("selectSession: a small domain is neither starved nor over-drilled", () => {
  const smallest = domains
    .map((domain) => ({ domain, size: byDomain(domain).length }))
    .sort((a, b) => a.size - b.size)[0];

  let appearances = 0;
  for (let run = 0; run < 200; run += 1) {
    const set = selectSession(10, [], T0, seeded(run + 101));
    const drawn = set.filter((question) => question.domain === smallest.domain);
    assert.ok(drawn.length <= smallest.size, "drew more than the domain holds");
    assert.equal(new Set(drawn.map((question) => question.id)).size, drawn.length);
    appearances += drawn.length;
  }
  assert.ok(appearances > 0, "small domain never appeared");
});

test("selectSession: never exceeds the eligible pool and never loops forever", () => {
  const everything = selectSession(500, [], T0, seeded(3));
  assert.equal(everything.length, questions.length);
  assert.equal(new Set(everything.map((question) => question.id)).size, questions.length);

  const allRecentlyCorrect = questions.map((question) => answer(question, true, T0 - 60 * 60 * 1000));
  assert.deepEqual(selectSession(10, allRecentlyCorrect, T0, seeded(3)), []);
  assert.deepEqual(selectSession(0, [], T0, seeded(3)), []);
});

test("selectSession: unseen questions outrank stale ones inside a domain", () => {
  const domain = "App Deployment";
  const pool = byDomain(domain);
  const seen = pool[0];
  // Answered correctly long ago: eligible, but should rank below the unseen ones.
  const log = [answer(seen, true, T0 - 40 * DAY)];

  let seenFirst = 0;
  for (let run = 0; run < 50; run += 1) {
    const set = selectSession(pool.length - 1, log, T0, seeded(run + 1)).filter(
      (question) => question.domain === domain,
    );
    if (set.length && set[0].id === seen.id) seenFirst += 1;
  }
  assert.equal(seenFirst, 0);
});

test("multiSelectGap: needs both windows and a gap above 10 points", () => {
  assert.equal(multiSelectGap([], T0), false);

  const thin = [
    ...singleAnswer.slice(0, 4).map((question, i) => answer(question, true, T0 - (20 - i) * DAY)),
    ...multiAnswer.slice(0, 6).map((question, i) => answer(question, false, T0 - (10 - i) * DAY)),
  ];
  assert.equal(multiSelectGap(thin, T0), false, "fewer than 5 single-answer samples");

  const wide = [
    ...singleAnswer.slice(0, 10).map((question, i) => answer(question, true, T0 - (30 - i) * DAY)),
    ...multiAnswer.slice(0, 10).map((question, i) => answer(question, i < 4, T0 - (20 - i) * DAY)),
  ];
  assert.equal(multiSelectGap(wide, T0), true, "100% vs 40% is a real gap");

  const even = [
    ...singleAnswer.slice(0, 10).map((question, i) => answer(question, i < 8, T0 - (30 - i) * DAY)),
    ...multiAnswer.slice(0, 10).map((question, i) => answer(question, i < 8, T0 - (20 - i) * DAY)),
  ];
  assert.equal(multiSelectGap(even, T0), false);
});

test("domainAccuracy and domainNeeds reflect the prior before any answers", () => {
  const accuracy = domainAccuracy([], T0);
  // (0.5*9 + 0 + 1) / (0.5*10 + 0 + 2) = 5.5 / 7
  assert.ok(Math.abs(accuracy["User Interface"] - 5.5 / 7) < 1e-12);
  // (0.5*7 + 0 + 1) / (0.5*14 + 0 + 2) = 4.5 / 9
  assert.ok(Math.abs(accuracy["Salesforce Fundamentals"] - 0.5) < 1e-12);

  const needs = domainNeeds([], T0);
  assert.ok(Math.abs(needs["Salesforce Fundamentals"] - 23 * 0.5) < 1e-12);
  assert.ok(needs["Salesforce Fundamentals"] > needs["User Interface"]);
  assert.ok(needs["Business Logic and Process Automation"] > needs["App Deployment"]);

  // Fresh misses raise a domain's need.
  const missed = byDomain("User Interface")
    .slice(0, 8)
    .map((question, i) => answer(question, false, T0 - (10 - i) * DAY));
  assert.ok(domainNeeds(missed, T0)["User Interface"] > needs["User Interface"]);
});

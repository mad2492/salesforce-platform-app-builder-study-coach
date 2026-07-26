import type { Domain, Question } from "./questions";
import { domainWeights, questions } from "./questions";

/**
 * Pure selection and scheduling engine for Builder Bench.
 *
 * Nothing in this file touches the DOM, localStorage, or the clock: every
 * function takes the append-only answer log plus an explicit `now`, so the
 * whole thing can be exercised in isolation from a test runner.
 */

export type AnswerLogEntry = {
  questionId: string;
  correct: boolean;
  answeredAt: string;
};

export type QuestionState = {
  attempts: number;
  correct: number;
  /** Leitner box: 0 = normal pool (never missed or graduated), 1-3 = review ladder. */
  box: number;
  /** Epoch milliseconds the question becomes reviewable, or null when it is not queued. */
  dueAt: number | null;
  lastAnsweredAt: number | null;
};

/** Her real practice-exam result, used as a prior until in-app answers accumulate. */
export const DIAGNOSTIC_PRIOR: Record<Domain, { correct: number; total: number }> = {
  "Salesforce Fundamentals": { correct: 7, total: 14 },
  "Business Logic and Process Automation": { correct: 11, total: 17 },
  "Data Modeling and Management": { correct: 9, total: 13 },
  "App Deployment": { correct: 4, total: 6 },
  "User Interface": { correct: 9, total: 10 },
};

/** How much the diagnostic counts once in-app answers exist. */
export const PRIOR_WEIGHT = 0.5;
/** In-app answers per domain that feed the accuracy estimate. */
export const RECENT_WINDOW = 25;
/** Rolling window for the single-answer vs multi-select comparison. */
export const FORMAT_WINDOW = 15;
/** Minimum samples in each format window before the gap bonus can apply. */
export const FORMAT_MIN_SAMPLES = 5;
/** Accuracy gap (in points) that counts as a real multi-select weakness. */
export const FORMAT_GAP_THRESHOLD = 0.1;
/** Share of a session that reviews may claim. */
export const REVIEW_SHARE = 0.4;
/** A correct answer inside this window keeps a question out of the fresh draw. */
export const REPEAT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;
const BOX_INTERVAL_DAYS: Record<number, number> = { 1: 2, 2: 5 };

export const domains = Object.keys(domainWeights) as Domain[];

const questionsById = new Map(questions.map((question) => [question.id, question]));

function emptyState(): QuestionState {
  return { attempts: 0, correct: 0, box: 0, dueAt: null, lastAnsweredAt: null };
}

function isMultiSelect(question: Question) {
  return question.answers.length > 1;
}

/**
 * Chronological, bank-filtered view of the log. Answers stamped after `now`
 * are ignored so that replaying with an earlier `now` stays consistent.
 */
function replayable(answers: AnswerLogEntry[], now: number) {
  return answers
    .map((answer) => ({
      answer,
      question: questionsById.get(answer.questionId),
      at: Date.parse(answer.answeredAt),
    }))
    .filter(
      (entry): entry is { answer: AnswerLogEntry; question: Question; at: number } =>
        Boolean(entry.question) && Number.isFinite(entry.at) && entry.at <= now,
    )
    .sort((a, b) => a.at - b.at);
}

/**
 * Laplace-smoothed accuracy per domain, blending the diagnostic prior with the
 * last RECENT_WINDOW in-app answers for that domain.
 */
export function domainAccuracy(
  answers: AnswerLogEntry[],
  now: number = Date.now(),
): Record<Domain, number> {
  const recent = new Map<Domain, { correct: number; attempts: number }>();
  for (const domain of domains) recent.set(domain, { correct: 0, attempts: 0 });

  const log = replayable(answers, now);
  for (const domain of domains) {
    const window = log
      .filter((entry) => entry.question.domain === domain)
      .slice(-RECENT_WINDOW);
    recent.set(domain, {
      attempts: window.length,
      correct: window.filter((entry) => entry.answer.correct).length,
    });
  }

  const accuracy = {} as Record<Domain, number>;
  for (const domain of domains) {
    const prior = DIAGNOSTIC_PRIOR[domain];
    const seen = recent.get(domain) ?? { correct: 0, attempts: 0 };
    accuracy[domain] =
      (PRIOR_WEIGHT * prior.correct + seen.correct + 1) /
      (PRIOR_WEIGHT * prior.total + seen.attempts + 2);
  }
  return accuracy;
}

/** need(d) = exam weight x remaining error. Higher means "drill this". */
export function domainNeeds(
  answers: AnswerLogEntry[],
  now: number = Date.now(),
): Record<Domain, number> {
  const accuracy = domainAccuracy(answers, now);
  const needs = {} as Record<Domain, number>;
  for (const domain of domains) {
    needs[domain] = domainWeights[domain] * (1 - accuracy[domain]);
  }
  return needs;
}

/**
 * Replays the append-only log into per-question scheduler state. No extra
 * persistence: the log is the source of truth.
 *
 * The transition table is evaluated at the moment of each answer, so a correct
 * answer in box 1 becomes due two days after it was given rather than two days
 * after whatever `now` happens to be.
 */
export function buildQuestionStates(
  answers: AnswerLogEntry[],
  now: number = Date.now(),
): Map<string, QuestionState> {
  const states = new Map<string, QuestionState>();

  for (const entry of replayable(answers, now)) {
    const state = states.get(entry.answer.questionId) ?? emptyState();
    state.attempts += 1;
    state.lastAnsweredAt = entry.at;

    if (!entry.answer.correct) {
      // Any miss drops the question to box 1 and makes it reviewable at once.
      state.box = 1;
      state.dueAt = entry.at;
    } else {
      state.correct += 1;
      if (state.box === 1 || state.box === 2) {
        state.box += 1;
        state.dueAt = entry.at + BOX_INTERVAL_DAYS[state.box - 1] * DAY_MS;
      } else if (state.box === 3) {
        // Graduated back into the normal pool.
        state.box = 0;
        state.dueAt = null;
      } else {
        state.box = 0;
        state.dueAt = null;
      }
    }

    states.set(entry.answer.questionId, state);
  }

  return states;
}

/**
 * True when rolling multi-select accuracy trails single-answer accuracy by more
 * than FORMAT_GAP_THRESHOLD. Undersized windows return false.
 */
export function multiSelectGap(answers: AnswerLogEntry[], now: number = Date.now()): boolean {
  const log = replayable(answers, now);
  const multi = log.filter((entry) => isMultiSelect(entry.question)).slice(-FORMAT_WINDOW);
  const single = log.filter((entry) => !isMultiSelect(entry.question)).slice(-FORMAT_WINDOW);

  if (multi.length < FORMAT_MIN_SAMPLES || single.length < FORMAT_MIN_SAMPLES) return false;

  const rate = (window: typeof log) =>
    window.filter((entry) => entry.answer.correct).length / window.length;

  return rate(single) - rate(multi) > FORMAT_GAP_THRESHOLD;
}

/** Ranking score inside a domain. Higher goes first. */
function questionScore(
  question: Question,
  state: QuestionState | undefined,
  now: number,
  gap: boolean,
) {
  const unseen = !state || state.attempts === 0;
  const staleness = unseen
    ? 1
    : Math.min((now - (state.lastAnsweredAt ?? now)) / DAY_MS, 10) / 10;
  return (
    (unseen ? 2 : 0) + staleness + (isMultiSelect(question) && gap ? 0.5 : 0)
  );
}

/**
 * Builds a session: due reviews first (capped), then a need-weighted draw
 * across domains that still have eligible questions.
 */
export function selectSession(
  length: number,
  answers: AnswerLogEntry[],
  now: number = Date.now(),
  random: () => number = Math.random,
): Question[] {
  if (length <= 0) return [];

  const states = buildQuestionStates(answers, now);
  const gap = multiSelectGap(answers, now);
  const needs = domainNeeds(answers, now);

  const lastCorrectAt = new Map<string, number | null>();
  for (const entry of replayable(answers, now)) {
    lastCorrectAt.set(entry.answer.questionId, entry.answer.correct ? entry.at : null);
  }

  const picked: Question[] = [];
  const pickedIds = new Set<string>();

  // 1. Reviews first.
  const reviewCap = Math.floor(REVIEW_SHARE * length);
  if (reviewCap > 0) {
    const due = questions
      .map((question) => ({ question, state: states.get(question.id) }))
      .filter((item) => item.state?.dueAt != null && (item.state.dueAt as number) <= now)
      .sort(
        (a, b) =>
          (a.state?.dueAt as number) - (b.state?.dueAt as number) ||
          a.question.id.localeCompare(b.question.id),
      )
      .slice(0, reviewCap);
    for (const item of due) {
      picked.push(item.question);
      pickedIds.add(item.question.id);
    }
  }

  // 2. Need-weighted fill from the remaining eligible pool.
  const pools = new Map<Domain, Question[]>();
  for (const domain of domains) {
    const pool = questions
      .filter((question) => question.domain === domain)
      .filter((question) => !pickedIds.has(question.id))
      .filter((question) => {
        const correctAt = lastCorrectAt.get(question.id);
        // Recently correct questions rest; recent misses ride the Leitner queue.
        return correctAt == null || now - correctAt >= REPEAT_COOLDOWN_MS;
      })
      .map((question) => ({
        question,
        score: questionScore(question, states.get(question.id), now, gap),
        jitter: random(),
      }))
      .sort((a, b) => b.score - a.score || a.jitter - b.jitter)
      .map((item) => item.question);
    pools.set(domain, pool);
  }

  while (picked.length < length) {
    const active = domains.filter((domain) => (pools.get(domain)?.length ?? 0) > 0);
    if (!active.length) break;

    const weights = active.map((domain) => Math.max(needs[domain], 0));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let chosen = active[active.length - 1];
    if (total > 0) {
      let ticket = random() * total;
      for (let i = 0; i < active.length; i += 1) {
        ticket -= weights[i];
        if (ticket <= 0) {
          chosen = active[i];
          break;
        }
      }
    } else {
      chosen = active[Math.min(Math.floor(random() * active.length), active.length - 1)];
    }

    const pool = pools.get(chosen) as Question[];
    const question = pool.shift() as Question;
    picked.push(question);
    pickedIds.add(question.id);
  }

  return picked;
}

/** Share of the fresh draw each domain should receive, for display and debugging. */
export function domainShares(
  answers: AnswerLogEntry[],
  now: number = Date.now(),
  eligibleDomains: Domain[] = domains,
): Record<Domain, number> {
  const needs = domainNeeds(answers, now);
  const total = eligibleDomains.reduce((sum, domain) => sum + needs[domain], 0);
  const shares = {} as Record<Domain, number>;
  for (const domain of domains) {
    shares[domain] =
      total > 0 && eligibleDomains.includes(domain) ? needs[domain] / total : 0;
  }
  return shares;
}

/** Count of questions currently sitting due in the Leitner queue. */
export function reviewsDue(answers: AnswerLogEntry[], now: number = Date.now()): number {
  let count = 0;
  for (const state of buildQuestionStates(answers, now).values()) {
    if (state.dueAt !== null && state.dueAt <= now) count += 1;
  }
  return count;
}

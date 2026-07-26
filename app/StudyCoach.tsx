"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Domain,
  Question,
  domainShortNames,
  domainWeights,
  questions,
} from "./questions";

type AnswerRecord = {
  questionId: string;
  correct: boolean;
  selected: number[];
  answeredAt: string;
};

type StoredProgress = {
  answers: AnswerRecord[];
  completedSessions: number;
};

type SessionResult = {
  title: string;
  answers: AnswerRecord[];
};

const STORAGE_KEY = "builder-bench-progress-v2";
const domains = Object.keys(domainWeights) as Domain[];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sameAnswers(selected: number[], correct: number[]) {
  return (
    selected.length === correct.length &&
    [...selected].sort().every((value, index) => value === [...correct].sort()[index])
  );
}

function percentage(correct: number, total: number) {
  return total ? Math.round((correct / total) * 100) : 0;
}

export default function StudyCoach() {
  const [progress, setProgress] = useState<StoredProgress>({
    answers: [],
    completedSessions: 0,
  });
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<Question[]>([]);
  const [sessionTitle, setSessionTitle] = useState("");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<AnswerRecord[]>([]);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy study brief");
  const [showBrief, setShowBrief] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved) as StoredProgress);
    } catch {
      // A blocked storage setting should never block studying.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, loaded]);

  const stats = useMemo(() => {
    return domains.map((domain) => {
      const domainQuestionIds = new Set(
        questions.filter((question) => question.domain === domain).map((question) => question.id),
      );
      const attempts = progress.answers.filter((answer) =>
        domainQuestionIds.has(answer.questionId),
      );
      const correct = attempts.filter((answer) => answer.correct).length;
      return {
        domain,
        attempts: attempts.length,
        correct,
        score: percentage(correct, attempts.length),
      };
    });
  }, [progress.answers]);

  const overall = useMemo(() => {
    const correct = progress.answers.filter((answer) => answer.correct).length;
    return {
      correct,
      attempts: progress.answers.length,
      score: percentage(correct, progress.answers.length),
    };
  }, [progress.answers]);

  const weakest = useMemo(() => {
    return [...stats].sort((a, b) => {
      const aAdjusted = a.attempts ? a.score : -1;
      const bAdjusted = b.attempts ? b.score : -1;
      return aAdjusted - bAdjusted || a.attempts - b.attempts;
    })[0];
  }, [stats]);

  const current = session[index];

  function startSession(title: string, pool: Question[], length: number) {
    setSession(shuffle(pool).slice(0, Math.min(length, pool.length)));
    setSessionTitle(title);
    setIndex(0);
    setSelected([]);
    setChecked(false);
    setSessionAnswers([]);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startDiagnostic() {
    const distribution: Record<Domain, number> = {
      "Salesforce Fundamentals": 2,
      "Data Modeling and Management": 2,
      "Business Logic and Process Automation": 3,
      "User Interface": 2,
      "App Deployment": 1,
    };
    const set = domains.flatMap((domain) =>
      shuffle(questions.filter((question) => question.domain === domain)).slice(
        0,
        distribution[domain],
      ),
    );
    startSession("Readiness diagnostic", set, 10);
  }

  function startAdaptive() {
    const sorted = [...stats].sort((a, b) => {
      const aScore = a.attempts ? a.score : 0;
      const bScore = b.attempts ? b.score : 0;
      return aScore - bScore || a.attempts - b.attempts;
    });
    const focusDomains = sorted.slice(0, 2).map((item) => item.domain);
    const missedIds = new Set(
      progress.answers.filter((answer) => !answer.correct).map((answer) => answer.questionId),
    );
    const focusPool = questions.filter((question) => focusDomains.includes(question.domain));
    const ordered = [
      ...shuffle(focusPool.filter((question) => missedIds.has(question.id))),
      ...shuffle(focusPool.filter((question) => !missedIds.has(question.id))),
    ];
    startSession(
      `Adaptive focus: ${focusDomains.map((domain) => domainShortNames[domain]).join(" + ")}`,
      ordered,
      8,
    );
  }

  function toggleOption(optionIndex: number) {
    if (checked || !current) return;
    if (current.answers.length === 1) {
      setSelected([optionIndex]);
      return;
    }
    setSelected((previous) =>
      previous.includes(optionIndex)
        ? previous.filter((item) => item !== optionIndex)
        : [...previous, optionIndex],
    );
  }

  function checkAnswer() {
    if (!current || selected.length !== current.answers.length) return;
    const record: AnswerRecord = {
      questionId: current.id,
      correct: sameAnswers(selected, current.answers),
      selected: [...selected],
      answeredAt: new Date().toISOString(),
    };
    setChecked(true);
    setSessionAnswers((previous) => [...previous, record]);
    setProgress((previous) => ({
      ...previous,
      answers: [...previous.answers, record],
    }));
  }

  function nextQuestion() {
    if (index < session.length - 1) {
      setIndex((previous) => previous + 1);
      setSelected([]);
      setChecked(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const finalResult = { title: sessionTitle, answers: sessionAnswers };
    setResult(finalResult);
    setProgress((previous) => ({
      ...previous,
      completedSessions: previous.completedSessions + 1,
    }));
    setSession([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function studyBrief() {
    const lines = [
      "Salesforce Platform App Builder study brief",
      `Overall: ${overall.correct}/${overall.attempts} correct (${overall.score}%)`,
      `Completed quiz sessions: ${progress.completedSessions}`,
      "Domain performance:",
      ...stats.map(
        (item) =>
          `- ${item.domain} (${domainWeights[item.domain]}% of exam): ${item.correct}/${item.attempts} correct${item.attempts ? ` (${item.score}%)` : " (not tested yet)"}`,
      ),
    ];

    const misses = progress.answers
      .filter((answer) => !answer.correct)
      .slice(-12)
      .map((answer) => questions.find((question) => question.id === answer.questionId))
      .filter((question): question is Question => Boolean(question));

    if (misses.length) {
      lines.push(
        "Recent missed topics:",
        ...Array.from(new Set(misses.map((question) => `${question.domain}: ${question.topic}`))).map(
          (topic) => `- ${topic}`,
        ),
      );
    }

    lines.push(
      "Please assess my readiness, explain patterns in my misses, and create a fresh question set weighted toward my weakest domains.",
    );
    return lines.join("\n");
  }

  async function copyBrief() {
    const brief = studyBrief();
    let copied = false;
    try {
      await navigator.clipboard.writeText(brief);
      copied = true;
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = brief;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      copied = document.execCommand("copy");
      fallback.remove();
    }
    setShowBrief(!copied);
    setCopyLabel(copied ? "Copied — paste it into Codex" : "Study brief ready below");
    window.setTimeout(() => setCopyLabel("Copy study brief"), 2600);
  }

  function resetProgress() {
    if (!window.confirm("Clear all saved answers and scores on this device?")) return;
    setProgress({ answers: [], completedSessions: 0 });
    setResult(null);
  }

  if (!loaded) return <main className="app-shell loading">Loading your study bench…</main>;

  if (current) {
    const isCorrect = checked && sameAnswers(selected, current.answers);
    return (
      <main className="quiz-shell">
        <header className="quiz-topbar">
          <button className="brand-button" onClick={() => setSession([])}>
            <span className="brand-mark">BB</span>
            <span>Builder Bench</span>
          </button>
          <span className="question-count">
            Question {index + 1} of {session.length}
          </span>
        </header>

        <div className="progress-track" aria-label={`Question ${index + 1} of ${session.length}`}>
          <span style={{ width: `${((index + 1) / session.length) * 100}%` }} />
        </div>

        <section className="question-layout">
          <aside className="question-context">
            <span className="eyebrow">{sessionTitle}</span>
            <h1>{domainShortNames[current.domain]}</h1>
            <p>{current.topic}</p>
            <div className="weight-note">
              <strong>{domainWeights[current.domain]}%</strong>
              <span>of the current exam outline</span>
            </div>
          </aside>

          <article className="question-card">
            <div className="question-heading">
              <span className="domain-dot" />
              <span>{current.domain}</span>
            </div>
            <h2>{current.prompt}</h2>
            <p className="selection-hint">
              {current.answers.length > 1
                ? `Choose ${current.answers.length} answers.`
                : "Choose the best answer."}
            </p>

            <div className="answer-list" role="group" aria-label="Answer choices">
              {current.options.map((option, optionIndex) => {
                const chosen = selected.includes(optionIndex);
                const correctOption = current.answers.includes(optionIndex);
                const stateClass = checked
                  ? correctOption
                    ? "is-correct"
                    : chosen
                      ? "is-wrong"
                      : ""
                  : chosen
                    ? "is-selected"
                    : "";
                return (
                  <button
                    key={option}
                    className={`answer-option ${stateClass}`}
                    onClick={() => toggleOption(optionIndex)}
                    disabled={checked}
                    aria-pressed={chosen}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option}</span>
                    {checked && correctOption && <span className="answer-status">Correct</span>}
                    {checked && chosen && !correctOption && <span className="answer-status">Your pick</span>}
                  </button>
                );
              })}
            </div>

            {checked && (
              <div className={`feedback ${isCorrect ? "feedback-correct" : "feedback-review"}`}>
                <span className="feedback-label">{isCorrect ? "Exactly right" : "Review this one"}</span>
                <p>{current.explanation}</p>
              </div>
            )}

            <div className="question-actions">
              {!checked ? (
                <button
                  className="primary-button"
                  onClick={checkAnswer}
                  disabled={selected.length !== current.answers.length}
                >
                  Check answer
                </button>
              ) : (
                <button className="primary-button" onClick={nextQuestion}>
                  {index === session.length - 1 ? "See my results" : "Next question"}
                </button>
              )}
              <span>
                {selected.length}/{current.answers.length} selected
              </span>
            </div>
          </article>
        </section>
      </main>
    );
  }

  const resultCorrect = result?.answers.filter((answer) => answer.correct).length ?? 0;
  const resultScore = result ? percentage(resultCorrect, result.answers.length) : 0;

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark">BB</span>
          <div>
            <strong>Builder Bench</strong>
            <span>Platform App Builder study coach</span>
          </div>
        </div>
        <button className="text-button" onClick={resetProgress} disabled={!progress.answers.length}>
          Reset progress
        </button>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Built for your real-world experience</span>
          <h1>Turn what you know into exam-ready instincts.</h1>
          <p>
            Practice in short rounds, see why each answer works, and bring your study brief back to
            Codex for a question set shaped around your misses.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={startDiagnostic}>
              Start 10-question diagnostic
            </button>
            <button className="secondary-button" onClick={startAdaptive}>
              Practice my weak spots
            </button>
          </div>
        </div>

        <div className="score-card">
          <span className="score-label">Current accuracy</span>
          <div className="score-number">{overall.attempts ? `${overall.score}%` : "—"}</div>
          <p>
            {overall.attempts
              ? `${overall.correct} correct across ${overall.attempts} ${overall.attempts === 1 ? "attempt" : "attempts"}`
              : "Take the diagnostic to establish your baseline."}
          </p>
          <div className="readiness-rule">
            <span style={{ width: `${overall.score}%` }} />
            <i style={{ left: "80%" }} />
          </div>
          <div className="readiness-labels">
            <span>Building</span>
            <span>80% practice target</span>
          </div>
        </div>
      </section>

      {result && (
        <section className="result-banner">
          <div>
            <span className="eyebrow">Round complete</span>
            <h2>{result.title}</h2>
            <p>
              You scored <strong>{resultCorrect}/{result.answers.length}</strong> ({resultScore}%).
              {resultScore >= 80
                ? " Strong result—keep testing consistency."
                : " Your misses are now feeding the adaptive practice mode."}
            </p>
          </div>
          <button className="primary-button" onClick={startAdaptive}>
            Start adaptive round
          </button>
        </section>
      )}

      <section className="dashboard-grid">
        <div className="panel domain-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Exam map</span>
              <h2>Performance by domain</h2>
            </div>
            <span className="session-count">{progress.completedSessions} rounds completed</span>
          </div>
          <div className="domain-list">
            {stats.map((item) => (
              <div className="domain-row" key={item.domain}>
                <div className="domain-title">
                  <strong>{domainShortNames[item.domain]}</strong>
                  <span>{domainWeights[item.domain]}% exam weight</span>
                </div>
                <div className="mini-track">
                  <span style={{ width: `${item.score}%` }} />
                </div>
                <div className="domain-score">
                  <strong>{item.attempts ? `${item.score}%` : "Not tested"}</strong>
                  <span>{item.attempts ? `${item.correct}/${item.attempts}` : "—"}</span>
                </div>
                <button
                  className="practice-button"
                  onClick={() =>
                    startSession(
                      `${domainShortNames[item.domain]} focus`,
                      questions.filter((question) => question.domain === item.domain),
                      6,
                    )
                  }
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel coach-panel">
          <span className="eyebrow">Coach's call</span>
          <h2>
            {overall.attempts ? `Focus next on ${domainShortNames[weakest.domain]}.` : "Start with a clean baseline."}
          </h2>
          <p>
            {overall.attempts
              ? weakest.attempts
                ? `This is currently your lowest-scoring domain at ${weakest.score}%. The adaptive round will mix repeat misses with fresh scenarios.`
                : "This domain has not been tested yet, so it is the biggest unknown in your readiness picture."
              : "The diagnostic mirrors the official domain weighting and takes about 10 minutes."}
          </p>
          <button className="secondary-button full-button" onClick={overall.attempts ? startAdaptive : startDiagnostic}>
            {overall.attempts ? "Practice recommended topics" : "Take the diagnostic"}
          </button>
          <div className="handoff-box">
            <strong>Bring your results back to Codex</strong>
            <p>Copy a compact summary of your scores and missed topics. No personal data is included.</p>
            <button className="copy-button" onClick={copyBrief} disabled={!progress.answers.length}>
              {copyLabel}
            </button>
            {showBrief && (
              <textarea
                className="brief-preview"
                aria-label="Study brief for Codex"
                readOnly
                value={studyBrief()}
                onFocus={(event) => event.currentTarget.select()}
              />
            )}
          </div>
        </aside>
      </section>

      <footer>
        <span>Progress stays in this browser on this device.</span>
        <a
          href="https://trailhead.salesforce.com/content/learn/trails/platform-app-builder-certification-prep"
          target="_blank"
          rel="noreferrer"
        >
          Official Salesforce exam prep ↗
        </a>
      </footer>
    </main>
  );
}

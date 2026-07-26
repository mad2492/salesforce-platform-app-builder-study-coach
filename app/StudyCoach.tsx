"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Domain,
  Question,
  domainShortNames,
  domainWeights,
  questions,
} from "./questions";
import { domainNeeds, reviewsDue, selectSession } from "./engine";

type AnswerRecord = {
  questionId: string;
  correct: boolean;
  selected: number[];
  answeredAt: string;
};

type ActiveSession = {
  title: string;
  questionIds: string[];
  index: number;
};

type StoredProgress = {
  answers: AnswerRecord[];
  completedSessions: number;
  activeSession?: ActiveSession;
};

type SessionResult = {
  title: string;
  answers: AnswerRecord[];
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const STORAGE_KEY = "builder-bench-progress-v2";
const CHECKIN_ISSUE_URL =
  "https://github.com/mad2492/salesforce-platform-app-builder-study-coach/issues/new";
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

function questionById(id: string) {
  return questions.find((question) => question.id === id);
}

/** Old payloads predate activeSession, so every field falls back to a safe default. */
function parseProgress(raw: string): StoredProgress {
  const saved = JSON.parse(raw) as Partial<StoredProgress> | null;
  const answers = Array.isArray(saved?.answers) ? (saved?.answers as AnswerRecord[]) : [];
  const completedSessions = Number(saved?.completedSessions ?? 0) || 0;
  const stored = saved?.activeSession;
  // Ids that left the bank are dropped, so a resumed round never hits a blank question.
  const questionIds = Array.isArray(stored?.questionIds)
    ? (stored?.questionIds as string[]).filter((id) => Boolean(questionById(id)))
    : [];
  const activeSession = questionIds.length
    ? {
        title: stored?.title ?? "Saved round",
        questionIds,
        index: Math.min(Math.max(Number(stored?.index ?? 0) || 0, 0), questionIds.length),
      }
    : undefined;

  return { answers, completedSessions, activeSession };
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
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(parseProgress(saved));
    } catch {
      // A blocked storage setting should never block studying.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, loaded]);

  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const clearInstallPrompt = () => {
      setInstallPrompt(null);
      setShowInstallHelp(false);
    };

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", clearInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", clearInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (!showInstallHelp) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInstallHelp(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showInstallHelp]);

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

  const formatSplit = useMemo(() => {
    const tally = { single: { correct: 0, attempts: 0 }, multi: { correct: 0, attempts: 0 } };
    for (const answer of progress.answers) {
      const question = questionById(answer.questionId);
      if (!question) continue;
      const bucket = question.answers.length > 1 ? tally.multi : tally.single;
      bucket.attempts += 1;
      if (answer.correct) bucket.correct += 1;
    }
    return tally;
  }, [progress.answers]);

  const dueCount = useMemo(() => reviewsDue(progress.answers, Date.now()), [progress.answers]);

  const resumable =
    progress.activeSession && progress.activeSession.index < progress.activeSession.questionIds.length
      ? progress.activeSession
      : null;

  const current = session[index];

  function runSession(title: string, set: Question[], startIndex = 0) {
    if (!set.length) {
      setNotice(
        "Everything you have answered correctly is resting for now. Try a domain practice round or come back tomorrow.",
      );
      return;
    }
    setNotice("");
    setSession(set);
    setSessionTitle(title);
    setIndex(Math.min(startIndex, set.length - 1));
    setSelected([]);
    setChecked(false);
    setSessionAnswers([]);
    setResult(null);
    setProgress((previous) => ({
      ...previous,
      activeSession: {
        title,
        questionIds: set.map((question) => question.id),
        index: Math.min(startIndex, set.length - 1),
      },
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSession(title: string, pool: Question[], length: number) {
    runSession(title, shuffle(pool).slice(0, Math.min(length, pool.length)));
  }

  function startPlanned(title: string, length: number) {
    runSession(title, selectSession(length, progress.answers, Date.now()));
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
    const needs = domainNeeds(progress.answers, Date.now());
    const focusDomains = [...domains]
      .sort((a, b) => needs[b] - needs[a])
      .slice(0, 2)
      .map((domain) => domainShortNames[domain]);
    startPlanned(`Adaptive focus: ${focusDomains.join(" + ")}`, 8);
  }

  function resumeSession() {
    const saved = progress.activeSession;
    if (!saved) return;
    const set = saved.questionIds
      .map((id) => questionById(id))
      .filter((question): question is Question => Boolean(question));
    if (!set.length) {
      abandonSession();
      return;
    }
    runSession(saved.title, set, saved.index);
  }

  function abandonSession() {
    setProgress((previous) => ({ ...previous, activeSession: undefined }));
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
      // Store the next unanswered position so a resume never repeats a question.
      activeSession: previous.activeSession
        ? { ...previous.activeSession, index: index + 1 }
        : previous.activeSession,
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
      activeSession: undefined,
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

  function studyCheckInIssue() {
    const generatedOn = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    const misses = progress.answers
      .filter((answer) => !answer.correct)
      .slice(-12)
      .map((answer) => questions.find((question) => question.id === answer.questionId))
      .filter((question): question is Question => Boolean(question));
    const missedTopics = Array.from(
      new Set(misses.map((question) => `${question.domain}: ${question.topic}`)),
    );

    return [
      "<!-- builder-bench-check-in:v1 -->",
      "## Builder Bench study check-in",
      "",
      `**Generated:** ${generatedOn}`,
      `**Overall:** ${overall.correct}/${overall.attempts} correct (${overall.score}%)`,
      `**Completed rounds:** ${progress.completedSessions}`,
      "",
      "### Domain performance",
      "",
      "| Domain | Exam weight | Result |",
      "| --- | ---: | ---: |",
      ...stats.map(
        (item) =>
          `| ${item.domain} | ${domainWeights[item.domain]}% | ${item.attempts ? `${item.correct}/${item.attempts} (${item.score}%)` : "Not tested"} |`,
      ),
      "",
      "### Recent missed topics",
      "",
      ...(missedTopics.length ? missedTopics.map((topic) => `- ${topic}`) : ["- No recent misses recorded."]),
      "",
      "### Review request",
      "",
      "Please assess my readiness, explain patterns in my misses, and create a fresh question set weighted toward my weakest domains.",
      "",
      "_Generated by Builder Bench. This check-in contains study performance only._",
    ].join("\n");
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

  function publishStudyCheckIn() {
    const generatedDate = new Date().toISOString().slice(0, 10);
    const parameters = new URLSearchParams({
      title: `[Study check-in] ${generatedDate} — ${overall.score}% overall`,
      body: studyCheckInIssue(),
      labels: "study-check-in",
    });
    window.open(`${CHECKIN_ISSUE_URL}?${parameters.toString()}`, "_blank", "noopener,noreferrer");
  }

  async function installApp() {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function resetProgress() {
    if (!window.confirm("Clear all saved answers and scores on this device?")) return;
    setProgress({ answers: [], completedSessions: 0, activeSession: undefined });
    setResult(null);
  }

  if (!loaded) return <main className="app-shell loading">Loading your study bench…</main>;

  if (current) {
    const isCorrect = checked && sameAnswers(selected, current.answers);
    const rightPicks = selected.filter((option) => current.answers.includes(option)).length;
    // Multi-select misses are still all-or-nothing; this only names the shape of the miss.
    const partialNote =
      checked && !isCorrect && current.answers.length > 1
        ? rightPicks === 0
          ? `${current.answers.length === 2 ? "Both picks" : "All of your picks"} were wrong — reread the scenario before the options.`
          : `You had ${rightPicks} of ${current.answers.length} — the miss was on the other choice. It still scores as incorrect.`
        : null;
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
                {partialNote && <p><strong>{partialNote}</strong></p>}
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
          {resumable && (
            <div className="result-banner">
              <div>
                <span className="eyebrow">Unfinished round</span>
                <h2>{resumable.title}</h2>
                <p>
                  Resume — question <strong>{resumable.index + 1}</strong> of{" "}
                  {resumable.questionIds.length}.
                </p>
              </div>
              <div className="hero-actions">
                <button className="primary-button" onClick={resumeSession}>
                  Resume round
                </button>
                <button className="text-button" onClick={abandonSession}>
                  Discard
                </button>
              </div>
            </div>
          )}
          <div className="hero-actions">
            <button className="primary-button" onClick={() => startPlanned("Quick 5", 5)}>
              Quick 5
            </button>
            <button className="primary-button" onClick={() => startPlanned("Focus 10", 10)}>
              Focus 10
            </button>
          </div>
          <div className="hero-actions">
            <button className="text-button" onClick={startDiagnostic}>
              Exam-pace check ↗
            </button>
            <button className="text-button" onClick={startAdaptive}>
              Adaptive round
            </button>
          </div>
          {notice && <p className="handoff-privacy">{notice}</p>}
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
          <div className="readiness-labels">
            <span>
              Single answer:{" "}
              {formatSplit.single.attempts
                ? `${percentage(formatSplit.single.correct, formatSplit.single.attempts)}% (${formatSplit.single.correct}/${formatSplit.single.attempts})`
                : "—"}
            </span>
            <span>
              Multi-select:{" "}
              {formatSplit.multi.attempts
                ? `${percentage(formatSplit.multi.correct, formatSplit.multi.attempts)}% (${formatSplit.multi.correct}/${formatSplit.multi.attempts})`
                : "—"}
            </span>
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
            <div className="domain-title">
              <span className="session-count">{progress.completedSessions} rounds completed</span>
              <span className="session-count">
                {dueCount} {dueCount === 1 ? "review" : "reviews"} due
              </span>
            </div>
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
          <span className="eyebrow">Coach&apos;s call</span>
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
            <p>Copy a private summary or publish a structured check-in that future Codex or Claude sessions can review from GitHub.</p>
            <div className="handoff-actions">
              <button className="copy-button" onClick={copyBrief} disabled={!progress.answers.length}>
                {copyLabel}
              </button>
              <button
                className="publish-button"
                onClick={publishStudyCheckIn}
                disabled={!progress.answers.length}
              >
                Publish check-in for review ↗
              </button>
            </div>
            <span className="handoff-privacy">
              Opens a public, prefilled GitHub issue. Nothing is posted until you tap Submit new issue.
            </span>
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
        <div className="footer-actions">
          <button className="install-button" onClick={installApp}>
            Add to Home Screen
          </button>
          <a
            href="https://trailhead.salesforce.com/content/learn/trails/platform-app-builder-certification-prep"
            target="_blank"
            rel="noreferrer"
          >
            Official Salesforce exam prep ↗
          </a>
        </div>
      </footer>

      {showInstallHelp && (
        <div className="install-overlay" onMouseDown={() => setShowInstallHelp(false)}>
          <section
            className="install-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="install-close"
              onClick={() => setShowInstallHelp(false)}
              aria-label="Close install instructions"
            >
              ×
            </button>
            {/* This same static image path serves both the Next and GitHub Pages builds. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="builder-bench-icon-192.png" alt="" width="72" height="72" />
            <span className="eyebrow">Study from anywhere</span>
            <h2 id="install-title">Put Builder Bench on your phone.</h2>
            <div className="install-steps">
              <div>
                <strong>iPhone or iPad</strong>
                <p>Open this page in Safari, tap Share, choose Add to Home Screen, then tap Add.</p>
              </div>
              <div>
                <strong>Android</strong>
                <p>Open this page in Chrome, tap the menu, then choose Install app or Add to Home screen.</p>
              </div>
            </div>
            <p className="install-note">It will launch like an app. Progress is saved separately on each device.</p>
          </section>
        </div>
      )}
    </main>
  );
}

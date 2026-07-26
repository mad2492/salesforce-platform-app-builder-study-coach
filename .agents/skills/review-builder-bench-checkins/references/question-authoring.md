# Builder Bench question-authoring standard

## Required schema

Add each item to the `questions` array in `app/questions.ts`:

```ts
{
  id: "domain-unique-kebab-id",
  domain: "One exact Domain union value",
  topic: "Concise concept label",
  prompt: "A realistic scenario ending in one clear task or decision?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  answers: [0],
  explanation: "Why the answer fits and why the strongest distractor does not.",
}
```

`answers` uses zero-based option indexes. Multiple values create a multi-select question; the interface automatically tells the learner how many answers to choose.

## Quality bar

- Test application and tradeoff judgment, not trivia or vocabulary recall.
- Use realistic admin/app-builder constraints: security, data model, maintainability, automation timing, user experience, scale, and deployment lifecycle.
- Make every required fact available in the scenario. Avoid hidden assumptions.
- Prefer four concise, parallel answer choices.
- Make distractors plausible for a learner with a specific misconception. Avoid jokes, absurd actions, or obviously unrelated features.
- Ensure exactly one defensible answer set. Do not rely on “generally,” “usually,” or “best” unless the scenario provides the criterion that makes it best.
- For multi-select, make each correct choice independently necessary and each wrong choice clearly wrong.
- Explain the governing concept and distinguish the strongest distractor. Do not merely restate the answer.
- Keep scenarios organization-neutral and fictional. Do not include FIU data, real names, credentials, or personal information.
- Use US English in prompts, options, explanations, tests, and UI text.

## Coverage and IDs

- ID prefixes: `fund-`, `data-`, `auto-`, `ui-`, or `deploy-`.
- Search existing IDs, prompts, topics, and explanations before adding an item.
- Vary scenario industries and object names when that helps prevent memorization, while keeping the Salesforce behavior central.
- Balance single-answer and multi-select items; do not add multi-select merely to increase difficulty.
- Target the learner's concept gap with a new scenario rather than paraphrasing a missed question.

## Accuracy and sourcing

- Use official Salesforce documentation for product behavior that may have changed or that is easy to misstate.
- Avoid release-specific minutiae unless the question explicitly teaches a currently documented capability.
- Keep declarative-versus-programmatic boundaries nuanced; do not imply Flow, formulas, sharing, layouts, or permissions provide capabilities they do not.
- Do not reproduce questions remembered from an exam, dumps, paid practice banks, or copyrighted prep material.

## Verification

After editing:

1. Confirm all IDs are unique.
2. Confirm every answer index exists and no answer index is duplicated.
3. Confirm domain values match the `Domain` union exactly.
4. Update the bank-size test to the new exact total.
5. Run `pnpm test` and inspect any failure before publication.

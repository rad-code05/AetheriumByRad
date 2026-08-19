# CLAUDE.md — Aetherium (agent memory, auto-loaded)

You are working on **Aetherium** — an AI app builder (Stitch + Lovable-style). This file is your
ground truth. Read it fully before any task. The human owner is **Rad**.

The full human-facing master lives in Notion ("🧠 Memory — Engineering Source of Truth", link below).
This file is the condensed, always-loaded copy. If they disagree: Notion wins for *decisions*,
the repo wins for *current code state*.

Domain-specific detail (Prisma, tRPC, auth, testing) lives in `.claude/rules/*.md`, auto-loaded
only when you touch matching files — check there before writing code in those areas.

---

## WORKING STYLE WITH RAD (read this — it shapes HOW you help)
Rad is a beginner and this is Rad's first production project. The goal is to **learn deeply**, not
just to get working code. Every session, work this way:
- **One small step at a time.** Do a single step, then STOP and wait for Rad's "ok" before the next.
- **Explain before and after.** Before a step: plain-English what we're about to do and why.
  After: what the code you just wrote actually does. Assume no prior knowledge; define new terms.
- **Never dump lots of code or many files at once.** Small, readable pieces.
- **Teach the "why," not just the "what."** Connect each step to the concept (point to the Notion Primer).
- **Check in, don't assume.** If Rad seems unsure, slow down and re-explain rather than pressing on.
- If Rad says "slow down / one step / explain it," immediately comply.
- **Verification and git are Rad's to run**, not yours, from Phase 0 step 0.6 onward — you write
  code/config and may run setup commands (installs, scaffolding), but tell Rad the exact
  verification/git commands and explain them rather than running them yourself. Exception: for
  CLAUDE.md-only (and `.claude/rules/`-only) changes, you may run the full
  branch→commit→push→PR→merge cycle yourself.
- For auth/security-sensitive files, ask each time whether Rad wants to write it himself (he
  usually does) or have you write it — don't assume either way carries forward automatically.

## GOLDEN RULES (non-negotiable)
1. Thin vertical slices, foundation first. Never big-bang integrate.
2. End-to-end typesafety: TypeScript strict, Zod at every boundary, tRPC, Prisma. No `any` without a written reason.
3. Secrets live in `.env` only. Never hardcode, never commit `.env`. Only variable NAMES may appear in docs.
4. Every phase must pass its verification gate before the next phase begins.
5. Small commits (Conventional Commits) → PR → CodeRabbit review → merge. Never push straight to main.
6. Validate all outside/AI data with Zod before trusting it.
7. Long work runs in Inngest, never inside a request handler.
8. Generated/untrusted code runs ONLY inside an E2B sandbox.
9. **When unsure, STOP and ask Rad.** Do not guess on stack, schema, deps, or anything destructive.

## WHEN TO ASK RAD FIRST (do not proceed without confirmation)
- Any change to the stack, the Prisma schema, or a database migration that could drop data.
- Adding or upgrading any dependency.
- Any fix larger than a few lines, or that touches auth, billing, or secrets.
- Anything ambiguous or underspecified.

## MEMORY & SESSION NOTES — WHO OWNS WHAT
- **You, Claude Code (local): BUILDER + SCRIBE.** Read this file + current phase + open blockers
  before starting; do the work; run the green-light check; update CURRENT STATE below + Notion;
  commit at session end.
- **The planning/architect agent (Notion/chat): ARCHITECT.** Owns the plan, decisions, phase gates.
- **Rad: OWNER.** Approves decisions; bridges the two agents.
Git history is the real record if a note is ever missed — commit at the end of every session.

## WHERE THINGS LIVE (Notion — the durable archive & reference)
- 🧠 **Memory (master):** https://app.notion.com/p/3b960cf270eb81c5a4d2e44304b9ce40
    Full CURRENT STATE history, Phase Gates (all phases), Decision Log, Error Log, env registry,
    color palette. **This is the source of truth for anything not in the lean sections below.**
- 🧭 **The Primer (concepts):** https://app.notion.com/p/3b960cf270eb81feb2f4eaa7b655bf34
    Plain-English explanations of every tool. Point Rad here when teaching a concept.
- 🌌 **Project hub:** https://app.notion.com/p/3b960cf270eb81eca7a8d5e02c246fc7

## DOC RECONCILIATION (every step)
- The repo is the single source of truth for code. Notion lessons written as advance
  reading are approximations until reconciled against the real code after the step is built.
- After completing each step, output a clearly-formatted "RECONCILE BLOCK" containing:
  (1) every file created or changed in this step, with its full final contents;
  (2) key decisions or deviations from the plan;
  (3) any version-specific surprises or gotchas.
- Purpose: Rad pastes this block to the planning agent (Notion) to true-up the matching
  Notion lesson so it exactly matches the real code.
- NEVER include .env contents or any real secret values in a RECONCILE BLOCK — file
  contents means code files, not secrets. If a step changed .env, list only the variable
  NAMES that were added, never their values.

## STACK (confirm current versions from official docs before installing)
Next.js 16 (App Router, React 19) · TS strict + Zod · Tailwind + shadcn/ui + Lucide ·
tRPC · Clerk · Neon + Prisma · Vercel AI SDK · Inngest · E2B · Upstash Redis ·
Langfuse + Sentry · Vitest + RTL + Playwright · GitHub Actions + CodeRabbit · Vercel.
Full table with notes: Notion Memory §2.

## PROJECT CONVENTIONS
- Folders: `src/app` routes · `src/components` UI · `src/server` tRPC routers/services ·
  `src/lib` clients (prisma, clerk, ai, inngest, e2b, redis) · `src/trpc` client-bridge ·
  `prisma/` schema+migrations · `e2e/` Playwright · `.claude/rules/` domain-specific detail.
- Unit tests co-located as `*.test.ts(x)`. E2E in `e2e/`.
- Naming: camelCase (vars/fns), PascalCase (components/types), SCREAMING_SNAKE (env).
- **Never:** commit `.env`; push directly to main; add a dependency without noting it in the Decision Log.

## THE GREEN-LIGHT CHECK (run before ending any phase; all must pass)
```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run test         # vitest unit + integration
npm run test:e2e     # playwright smoke
npx prisma migrate status
npm run build        # next build succeeds
```
A phase is DONE only when: its Definition of Done is met AND the green-light check passes
AND its phase-specific tests are green. Otherwise it is NOT done — log why.

## ERROR PROTOCOL (follow in order — no big rewrites)
1. Capture the EXACT error text, the command that produced it, and the file/line.
2. Reproduce it deterministically.
3. Check the Notion Error Log for the same symptom.
4. Form ONE hypothesis for the root cause.
5. Propose the MINIMAL fix. If it touches schema/deps/secrets or is more than a few lines → ASK RAD FIRST.
6. Apply on a branch.
7. Re-run the green-light check + phase tests. Not fixed until green.
8. Log outcome in the Notion Error Log, update CURRENT STATE below, and commit.

## CURRENT STATE
**Phase 0: DONE ✅ (2026-08-17).** **Phase 1 — Chat & PRD — in progress.** Added `Project`/
`Message` Prisma models plus `project`/`message` tRPC routers with Clerk-authenticated ownership
checks (PR #33, #34 — 2026-08-19). Error Log: PR #33's `git add src/server` left the new schema +
migration uncommitted, so CI/Vercel passed locally but failed on `main` (stale Prisma Client);
fixed by committing the missing files in PR #34 — `main` is green again. Full step-by-step
history, all Error Log incidents, and the full Decision Log: **see Notion Memory** (link above) —
kept current via the RECONCILE BLOCK workflow.

## PHASE GATES
Current phase's DoD/Tests: see Notion Memory §6. (Phase 0's gate is met — see CURRENT STATE above.)

## KEY DECISIONS
Do not re-litigate stack/architecture choices. Full Decision Log with rationale: **Notion Memory §9.**

# CLAUDE.md — Aetherium (agent memory, auto-loaded)

You are working on **Aetherium** — an AI app builder (Stitch + Lovable-style). This file is your
ground truth. Read it fully before any task. The human owner is **Rad**.

The full human-facing master lives in Notion ("🧠 Memory — Engineering Source of Truth", link below).
This file is the condensed, always-loaded copy. If they disagree: Notion wins for *decisions*,
the repo wins for *current code state*. Keep this file updated (see "Memory & session notes").

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
Three roles. Keep them straight.
- **You, Claude Code (local): the BUILDER + SCRIBE.** You run the code, see the real errors, and make
  changes — so YOU write the session notes. Your duties every session:
    1. Read this file + current phase + open blockers before starting.
    2. Do the work (learning-style rules above).
    3. Run the green-light check + phase tests.
    4. **Update this file**: the "CURRENT STATE" block, and append any incident to the Error Log
       (or to the Notion Error Log if the Notion connector is available).
    5. **End every session with a git commit** — this is the durable safety net even if a note is missed.
- **The planning/architect agent (in Rad's Notion/chat): the ARCHITECT.** Owns the plan, decisions,
  and phase gates. Cannot see this repo, so does NOT write live session notes.
- **Rad: the OWNER.** Approves decisions; bridges the two agents.

Reliability note: an agent updating its own memory isn't perfectly reliable, so **Git history is the
real record**. Commit at the end of every session with a clear message of what changed.

## WHERE THINGS LIVE (Notion — the durable archive & reference)
- 🧠 **Memory (master):** https://app.notion.com/p/3b960cf270eb81c5a4d2e44304b9ce40
    Full decision log, error log, phase gates, env registry. Sync important items here at phase boundaries.
- 🧭 **The Primer (concepts):** https://app.notion.com/p/3b960cf270eb81feb2f4eaa7b655bf34
    Plain-English explanations of every tool. Point Rad here when teaching a concept.
- 🌌 **Project hub:** https://app.notion.com/p/3b960cf270eb81eca7a8d5e02c246fc7
If the Notion connector is NOT enabled in Claude Code: keep notes in THIS file; Rad syncs the big
items up to Notion. If it IS enabled: you may update the Notion Memory page directly as well.

## STACK (confirm current versions from official docs before installing)
- Framework: Next.js 16 (App Router, React 19) · Language: TypeScript strict + Zod
- UI: Tailwind + shadcn/ui + Lucide icons  (aurora light theme; dark ONLY in build workspace)
- API: tRPC · Auth: Clerk (user + admin roles, billing)
- DB: Neon Postgres + Prisma (migrations required for every schema change)
- AI: Vercel AI SDK (streaming, tool calling, human-in-the-loop)
- Jobs: Inngest (durable, step-based) · Sandbox: E2B (pause/resume)
- Resume/cache: Upstash Redis · Observability: Langfuse (AI) + Sentry (errors)
- Testing: Vitest + React Testing Library + Playwright
- VCS/CI: GitHub + Actions + CodeRabbit · Hosting: Vercel

## PROJECT CONVENTIONS
- Folders: `src/app` routes · `src/components` UI · `src/server` tRPC routers/services ·
  `src/lib` clients (prisma, clerk, ai, inngest, e2b, redis) · `prisma/` schema+migrations · `e2e/` Playwright.
- Unit tests co-located as `*.test.ts(x)`. E2E in `e2e/`.
- Naming: camelCase (vars/fns), PascalCase (components/types), SCREAMING_SNAKE (env).

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
3. Check this file + the Notion Error Log for the same symptom.
4. Form ONE hypothesis for the root cause.
5. Propose the MINIMAL fix. If it touches schema/deps/secrets or is more than a few lines → ASK RAD FIRST.
6. Apply on a branch.
7. Re-run the green-light check + phase tests. Not fixed until green.
8. Log outcome (symptom, exact error, root cause, fix, how verified), update CURRENT STATE, and commit.

## CURRENT STATE (update this every session)
- Phase: **0 — Foundation** (in progress — steps 0.1–0.9 of 0.15 done, see plan in chat history)
  - 0.1 Prerequisites confirmed: Node v22.12.0, npm 11.5.2, Git 2.45.2, GitHub account. Vercel/Neon/Clerk accounts still needed before steps 0.8/0.9/0.14.
  - 0.2 Next.js 16.3.0 (App Router, React 19, TS, Tailwind, ESLint, `src/` dir) scaffolded and running (`npm run dev`). Fixed a Turbopack workspace-root warning by pinning `turbopack.root` in `next.config.ts` (unrelated stray lockfile in the Windows user home dir was confusing root detection).
  - 0.3 Git initialized, pushed to `github.com/rad-code05/AetheriumByRad`. Initial scaffold commit landed directly on `main` as a one-time bootstrap exception (see Error Log below) — every commit after that follows branch → PR → review → merge.
  - 0.4 shadcn/ui + Lucide installed; aurora "Clean & Energetic" palette (fetched from the Notion Memory page) wired into Tailwind's CSS-variable theme (`primary`/`secondary`/`highlight`/`violet`/`muted`, aurora gradient background, brand-gradient utilities). Shipped via PR #1 (squash-merged). GitHub CLI (`gh`) installed + authed as `rad-code05` to support this PR flow.
  - 0.5 Confirmed `tsconfig.json` already had full `strict: true` from the scaffold (no partial strict flags); added the missing `typecheck` npm script (`tsc --noEmit`) — `lint` already existed. Shipped via PR #3 (squash-merged).
  - 0.6 Vitest + React Testing Library installed (`vitest.config.mts`, `vitest.setup.ts`); unit test for the `cn()` util in `src/lib/utils.test.ts` (satisfies "unit test a util" DoD item). `npm run test` = `vitest run` (one-shot, for CI/green-light); `npm run test:watch` for live-reloading while writing tests. Rad ran the tests + did the commit/PR/squash-merge himself.
  - **Workflow change starting at 0.6:** Claude Code writes/edits code and runs setup commands (npm installs, scaffolding), but Rad now runs all verification commands (test/build/etc.) and ALL git commands himself — including read-only ones like `git status`/`git pull`, not just commits/PRs. Claude gives exact commands + explanations and takes Rad's word on the resulting state.
  - 0.7 Playwright + Chromium browser binary installed; `playwright.config.ts` (auto-starts `npm run dev` via `webServer`, `baseURL: http://localhost:3000`); trivial smoke test `e2e/homepage.spec.ts` (checks the "Aetherium" heading renders). `npm run test:e2e` script added. Rad ran the test + did commit/PR/squash-merge himself. Shipped via PR #6 (squash-merged).
  - 0.8 Neon Postgres connected + Prisma 7 installed. Note: Prisma 7 changed significantly from older versions — CLI no longer auto-loads `.env` or reads the connection URL from `schema.prisma` (now in `prisma.config.ts`); the `prisma-client` generator requires an explicit `output` path; Postgres now needs the `@prisma/adapter-pg` driver adapter (confirmed via current docs, not assumed from training data). Minimal `User` model (`id`/`email`/`createdAt`) migrated via `npx prisma migrate dev --name init` (Rad ran this himself — it's the one command that touches the real database). Added `.env.example` (names only) + fixed a `.gitignore` bug where `.env*` would've also blocked `.env.example` from being committed. `postinstall: "prisma generate"` added so the generated (gitignored) client always exists after `npm install`. Rad hit a real merge conflict in `package.json`/`package-lock.json` (two branches both touched the `scripts` block) — resolved together, and agreed that future conflicts: Rad reads the conflict markers and makes the edit himself, Claude explains but doesn't touch the file. Shipped via PR #8 (squash-merged).
  - 0.9 Clerk integration: `@clerk/nextjs` installed; `src/middleware.ts` (`clerkMiddleware()`), `<ClerkProvider>` wrapping root layout, `/sign-in` and `/sign-up` pages (Clerk's pre-built components, optional catch-all routes `[[...sign-in]]`/`[[...sign-up]]`). Env vars for Clerk keys + routing added to `.env.example`. **Rad wrote all the Clerk files himself** (middleware/layout/sign-in/sign-up) with Claude explaining each — a deliberate step-specific choice for auth-sensitive code, see chat history. Hit + fixed two real mistakes together: `middleware.ts` was initially missing its `export default clerkMiddleware()` line (page failed to load), and the 4 non-secret Clerk routing env vars were initially missing from `.env`. Verified: sign-up + sign-in both load and a real test account was created; typecheck/lint/build all green. Shipped via PR #10 (squash-merged).
  - Next up: 0.10 user/admin role gating (add `role` field to `User` model, minimal `/admin` route).
- Last green-light check: none yet (`npx prisma migrate status` not yet re-verified post-merge; `test:e2e` doesn't cover Clerk flows yet — that's step 0.12). Currently green: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm run build`.
- Open blockers: none
- Last commit note: `feat: add Clerk authentication (sign-in/sign-up, middleware)` (PR #10, squash-merged by Rad)

### Error Log addendum
- **Bootstrap direct-push-to-main** · Phase 0 · resolved. Symptom: initial scaffold commit was pushed straight to `main` via `git push -u origin main`, violating Golden Rule #5 ("never push straight to main"). Root cause: followed a GitHub quick-setup command snippet Rad pasted without reconciling it against CLAUDE.md's workflow rule first. Fix: Rad approved treating this one commit as a one-time bootstrap exception (nothing existed yet to PR against); every commit since (starting with PR #1) follows branch → PR → review → merge. Verified by: PR #1 opened/merged correctly for the next change.

## PHASE GATES (summary — full detail in Notion Memory)
- P0 Foundation: app runs + deployed; Clerk login; user/admin gate; Neon+Prisma; empty dashboard; CI.
  Tests: util unit; e2e logged-out→/login; e2e user→/dashboard; e2e non-admin blocked from /admin; migrate status clean.
- P1 Chat & PRD: streaming chat; messages persist; PRD fills; "Proceed to design" gate.
  Tests: PRD Zod parse good/bad; msg persist round-trip; e2e reload keeps history; gate-enable logic.
- P2 Design + approve: generate/iterate versions; "Approve & build" enables after selection.
  Tests: version state machine; e2e select→enable; e2e approve→advance stepper.
- P3 Build engine: Inngest job + E2B run + preview URL + resume (chat & build).
  Tests: Inngest steps complete (E2B mocked); failed step retries from checkpoint; state persisted per step; e2e build→preview; Redis stream resume.
- P4 Advisor/admin/billing/observability: gap advisor (POC vs Prod); admin gating; billing; Sentry+Langfuse live.
  Tests: advisor gap logic; e2e non-admin blocked; Sentry test error received; Langfuse trace received; publish gated on required items.

## KEY DECISIONS (do not re-litigate — see Notion for rationale)
Clerk (not Supabase auth) · E2B (not Vercel Sandbox) · tRPC (not REST/GraphQL) ·
Neon+Prisma · Inngest for builds · Vercel AI SDK · Upstash Redis for resume ·
No LangGraph for now · aurora light theme (never flat white) · Vitest+Playwright+RTL.

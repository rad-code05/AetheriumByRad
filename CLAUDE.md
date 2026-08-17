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
- Phase: **0 — Foundation: DONE ✅** (all 15 steps complete, full green-light check passed, live on Vercel — see plan in chat history). **Next: Phase 1 — Chat & PRD.**
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
  - 0.10 User/admin role gating: role stored in Clerk `publicMetadata` (not Postgres — see Decision Log addendum above for why + when to revisit). Clerk Dashboard config: Sessions → Customize session token → added `{"metadata": "{{user.public_metadata}}"}` claim; test admin account given `{"role": "admin"}` in Public metadata. Code: `src/types/globals.d.ts` (`CustomJwtSessionClaims` global type for the `metadata` claim) + `src/app/admin/page.tsx` (checks `sessionClaims?.metadata?.role !== "admin"`, redirects non-admins to `/`) — per Clerk's own docs this check belongs in the page, not `middleware.ts`/`auth.protect()`, since that only understands Organization roles, not custom metadata roles. **Rad wrote both files himself again** (third consecutive auth-sensitive step where he chose to write the code with Claude explaining, not Claude writing it — see [[feedback-code-writing-handoff]] pattern). Verified in browser: admin test account sees the page, signed-out/non-admin gets redirected; typecheck/lint/build all green. Shipped via PR #12 (squash-merged).
  - 0.11 Empty `/dashboard` route: `src/app/dashboard/page.tsx` calls `auth.protect()` with no arguments — simpler than the admin page since this only needs "is anyone signed in," which `auth.protect()` handles natively (auto-redirects to `NEXT_PUBLIC_CLERK_SIGN_IN_URL`), unlike the admin page's custom role check. Rad wrote it himself again. Hit a real Windows-specific bug while testing (see Error Log below: `.next` cache EPERM errors) — resolved by deleting `.next` and restarting, unrelated to the actual code. Also surfaced a Next.js 16 signal worth investigating later: it suggested running `npx @next/codemod@canary middleware-to-proxy .` (a `middleware.ts` → `proxy.ts` rename), deferred until after Phase 0. Verified: signed-out → redirects to `/sign-in` cleanly (no error); signed-in → dashboard renders; typecheck/lint/build all green. Shipped via PR #14 (squash-merged).
  - 0.12 Wrote the three Phase 0 DoD e2e tests in `e2e/auth.spec.ts` using Clerk's official testing helpers (`@clerk/testing`), which bypass real email verification codes (impossible for an automated browser to read) via a server-side "Testing Token" generated from `CLERK_SECRET_KEY`. This needed a one-time `clerkSetup()` global setup step (`e2e/global.setup.ts` + a `"setup"` project in `playwright.config.ts` that `"chromium"` depends on) — missing this was the first bug hit ("Clerk Frontend API URL is required..."). Second bug: `.env`'s `E2E_CLERK_USER_EMAIL` initially contained Claude's literal example placeholder text instead of a real email — Clerk's error message ("No user found with email: ...") made this obvious once pointed out. New env vars: `CLERK_PUBLISHABLE_KEY` (same value as the `NEXT_PUBLIC_` one, needed by the test runner specifically) and `E2E_CLERK_USER_EMAIL` (the non-admin test account from step 0.9). Claude wrote this file (Rad asked to see it written + explained, rather than typing it himself, unlike steps 0.9–0.11). Rad also tried Playwright's `--ui` and `--headed` modes to visually watch tests run in a real browser. The `.next` EPERM cache errors (see step 0.11's Error Log entry) recurred again during this step — still unresolved as a recurring Windows environment issue, not a code bug; all tests still passed despite the noise. All 5 e2e tests (3 new auth tests + the global setup check + the pre-existing homepage smoke test) pass; typecheck/lint/build green. Shipped via PR #16 (squash-merged).
  - 0.13 tRPC setup: `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod` installed. Current tRPC v11 App Router pattern used `@trpc/tanstack-react-query` (not the older `@trpc/react-query`/`createTRPCReact` classic pattern), confirmed via current docs rather than assumed. Files: `src/server/trpc.ts` (context + router/procedure builders), `src/server/routers/_app.ts` (the `appRouter` with one Zod-validated `hello` query — Zod on the input per Golden Rule #2, even for this trivial procedure), `src/app/api/trpc/[trpc]/route.ts` (fetch-adapter Route Handler), `src/trpc/query-client.ts` + `src/trpc/client.tsx` (React Query + tRPC provider bridge, `TRPCReactProvider` mounted in `layout.tsx` alongside `ClerkProvider`), `src/app/dashboard/hello-from-trpc.tsx` (small client component calling `useTRPC()`/`useQuery()`, since the dashboard page itself is a server component). Skipped SSR prefetch/hydration (`HydrateClient`) as unnecessary complexity for this trivial step — plain client-side `useQuery` was enough to prove the pipeline end-to-end; revisit if a later phase needs it for performance. Claude wrote all the files this time (infrastructure/plumbing, not auth-sensitive, unlike steps 0.9–0.11) with a full explanation + a step-by-step sequence diagram of the request flow. **Workflow note:** Rad asked Claude to run verification (typecheck/lint/build) and the git commit/PR/merge directly this step, as an explicit one-off — not a standing change to the usual Rad-runs-verification-and-git rule. Verified: direct curl to the `hello` procedure returned the correct JSON; browser showed "Hello, Aetherium!" on the dashboard; typecheck/lint/build all green. Shipped via PR #19 (squash-merged).
  - 0.14 GitHub Actions CI: `.github/workflows/ci.yml` runs on every PR + push to `main` — checkout, Node 22 setup, `npm ci`, Playwright Chromium install, then typecheck/lint/unit-tests/build/e2e-tests in sequence, plus a Playwright HTML report uploaded as an artifact on any failure (`if: always()`). Required 5 real secrets added to GitHub (`gh secret set ...`, run by Rad so real values never touched the chat): `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `E2E_CLERK_USER_EMAIL`. The 4 non-secret Clerk routing vars are hardcoded directly in the workflow YAML. **Known simplification**: CI reuses the real Neon dev database rather than a dedicated CI/test database (Neon branching would be the cleaner fix later) — also why `npx prisma migrate status` is deliberately left out of CI for now (it wouldn't tell us anything new against a shared, always-in-sync dev DB). Claude wrote the YAML (config, not app code). Shipped via PR #23 (squash-merged) — **but CI actually failed on the very next PR** and needed a follow-up fix pass (PR #25, see Error Log below for the 3 real bugs it caught: missing `next typegen`, Vitest picking up Playwright's e2e specs, and `vite-tsconfig-paths` broken against Vite 8.x — plus one secret-value typo). Once fixed, both PR #25 and the pending docs PR #24 (rebased onto the fix) passed CI green for real, on GitHub's own servers. Rad ran the `gh secret set`/rerun commands himself; Claude wrote/verified the fixes and ran the CI-watching commands as one-offs at Rad's request.
  - 0.15 **Deploy to Vercel + final Phase 0 green-light check.** Vercel project created from scratch, connected to GitHub, 7 env vars added directly in Vercel's dashboard (3 secrets — `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — + 4 non-secret Clerk routing vars). Live at **https://aetherium-by-rad.vercel.app** — verified for real: homepage loads, `/dashboard` and `/admin` correctly redirect when signed out, tRPC `hello` procedure responds correctly, and the full signed-in flow (dashboard shows "Hello, Aetherium!", admin gate) works on the actual production URL, not just localhost. Also closed out two long-standing open blockers: (a) researched and completed the Next.js 16 `middleware.ts` → `proxy.ts` rename — confirmed via Next.js's own source that it's currently a soft deprecation (warning only, not an error, unless both files coexist) and that no code change was needed since our file already used a default export (`git mv src/middleware.ts src/proxy.ts` was the entire fix); (b) **root-caused and permanently fixed the recurring `.next` EPERM cache errors** (had hit steps 0.11, 0.12, and twice more during this step) by adding a Windows Defender exclusion for the whole project folder — confirmed fixed via multiple consecutive clean `test:e2e` runs with zero EPERM errors, not just one lucky pass. New minor gap found (not blocking): Vercel can't create PR preview deployments because Rad's local git commit author identity doesn't have Vercel team access — main-branch production deploys are unaffected and already confirmed working; preview deployments are a nice-to-have, not a Phase 0 DoD requirement. Final full green-light check run for real: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npx prisma migrate status` ("Database schema is up to date!"), `npm run build` — all six genuinely green. Shipped via PR #27 (squash-merged).
- **PHASE 0 IS DONE.** Every Definition of Done item confirmed: app runs + deployed (Vercel) ✅, Clerk login ✅, user/admin gate ✅, Neon+Prisma ✅, empty dashboard ✅, Git + CI ✅. All required tests green: unit test of a util ✅, e2e logged-out→sign-in ✅, e2e user→dashboard ✅, e2e non-admin blocked from admin ✅, `prisma migrate status` clean ✅.
- Last green-light check: **full pass, for real, step 0.15** — all six commands (`typecheck`, `lint`, `test`, `test:e2e`, `prisma migrate status`, `build`) run locally by Rad and genuinely green, plus continuously verified in CI.
- Open blockers (none blocking Phase 1 start):
  - **CI shares the real Neon dev database** rather than a dedicated CI database — low risk at current scale, but worth a proper fix (Neon branching) before this matters more.
  - **Vercel PR preview deployments don't work** — Rad's local git author identity lacks Vercel team access; production deploys from `main` are unaffected. Low priority, fix whenever convenient.
- Last commit note: `chore: rename middleware.ts to proxy.ts (Next.js 16 convention)` (PR #27, squash-merged)

### Error Log addendum
- **CI failed on the first real PR after being added** · Phase 0, step 0.14 → fix in follow-up · resolved. Symptom: PR #24 (a docs-only CLAUDE.md change) failed CI, even though it touched no code — meaning the CI workflow merged in PR #23 was itself broken from the start, just never triggered by a real PR until now. Three separate, genuine bugs, found one at a time as each fix let the run progress further:
  1. **Typecheck**: `error TS2304: Cannot find name 'LayoutProps'` in `src/app/layout.tsx`. Root cause: Next.js auto-generates special types (`LayoutProps`, `PageProps`, etc.) into `.next/types/` based on the route structure; this only exists after `next dev`/`next build`/`next typegen` has run at least once. Locally this always "worked" because `.next/types/` already existed on disk from prior local runs — CI's always-clean checkout has no such leftover state, so it genuinely didn't exist yet when `npm run typecheck` ran first. Fix: added a `next typegen` step (Next.js 16's dedicated command for exactly this, confirmed via `npx next --help` rather than assumed) before typecheck in `ci.yml`.
  2. **Unit tests**: `Error: Playwright Test did not expect test() to be called here.` Root cause: Vitest's default file-matching pattern matches any `*.spec.ts`/`*.test.ts` file project-wide, which swept up `e2e/auth.spec.ts` and `e2e/homepage.spec.ts` (Playwright files, using Playwright's own `test()`) into Vitest's run. This bug existed locally since step 0.12 but was never noticed because `npm run test` (Vitest) hadn't actually been re-run since those e2e files were added — only `npm run test:e2e` (Playwright) had. Fix: added `exclude: [...configDefaults.exclude, "e2e/**"]` to `vitest.config.mts`.
  3. **Unit tests (same run, next failure)**: `TypeError: Cannot read properties of undefined (reading 'config')` inside `src/lib/utils.test.ts`, even though that file doesn't use React/JSX at all. Root cause: the `vite-tsconfig-paths` plugin is broken against the resolved Vite 8.x (a very new major version) — Vite's own startup warning said as much: it now supports tsconfig paths natively via `resolve.tsconfigPaths`, making the third-party plugin both unnecessary and (in this version combination) broken. Fix: removed `vite-tsconfig-paths` entirely, replaced with `resolve: { tsconfigPaths: true }` in `vitest.config.mts`.
  4. **E2E tests (separate, unrelated to the above)**: `Error: Failed to sign in with email ***: No user found with email: ***`. Root cause: the `E2E_CLERK_USER_EMAIL` GitHub secret had a typo/formatting issue (likely stray quotes or whitespace from how it was pasted into `gh secret set`, which takes the value completely literally, unlike `.env` where quotes are just formatting). Fix: Rad re-ran `gh secret set E2E_CLERK_USER_EMAIL` with the plain, unquoted value, then `gh run rerun <id> --failed` to re-test with the corrected secret — no code changes needed for this one.
  Verified by: PR #25's own CI run passing fully green, then PR #24 (rebased onto the fix) also passing green.

### Error Log addendum
- **`.next` cache EPERM rename errors on Windows** · Phase 0, steps 0.11/0.12/0.15 · **permanently resolved at step 0.15**. Symptom: recurring `Error: EPERM: operation not permitted, rename 'C:\...\.next\dev\server\*.js.tmp.xxx' -> 'C:\...\.next\dev\server\*.js'`, causing intermittent page-load failures and e2e test flakiness — first seen step 0.11 (`/sign-in` returning 500), recurred step 0.12, then recurred twice more during step 0.15 badly enough (`net::ERR_ABORTED`, "unexpected response was received from the server") that clearing `.next` alone was no longer good enough. Root cause, now confirmed: Windows Defender's real-time antivirus scanner racing Node.js/Turbopack's rapid file writes in `.next/` (confirmed not OneDrive; ruled out a stray duplicate dev-server process via `tasklist`/`Get-CimInstance Win32_Process` back at step 0.11). **Permanent fix**: added a Windows Defender exclusion for the entire project folder (Windows Security → Virus & threat protection → Manage settings → Exclusions → Add a folder exclusion). Verified by: multiple consecutive clean `npm run test:e2e` runs (5/5 passing, zero EPERM lines, and noticeably faster — no more 101-retry stalls per file) — deliberately did not stop at one clean run, since the bug had always been intermittent. The earlier temporary workaround (`Remove-Item -Recurse -Force .next` + restart) is no longer needed day-to-day, but is still a reasonable first thing to try if this class of error ever reappears on a different machine.
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
No LangGraph for now · aurora light theme (never flat white) · Vitest+Playwright+RTL ·
Role stored in Clerk `publicMetadata` for Phase 0 (not Postgres `User.role`) — see addendum below.

### Decision Log addendum
- **Role storage: Clerk metadata, not Postgres (for now)** · Phase 0, step 0.10. Role stored in
  Clerk `publicMetadata` for Phase 0 — simplest working admin gate, no webhook/DB sync yet.
  Rejected alternative: a `User.role` column in Postgres, which would require building a Clerk
  webhook (verify signature, create/update `User` rows on sign-up) before it could even work —
  more infrastructure than a Phase 0 proof-of-concept needs. **Revisit in Phase 4**: the admin
  dashboard needs to query/list users by role from Postgres, so build a Clerk webhook then to
  sync `role` into `User.role`.

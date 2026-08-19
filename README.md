# Aetherium

**An AI app builder — describe the app you want in chat, collaborate on its design, and watch it get built.**

Aetherium is a full-stack AI application builder in the spirit of tools like Lovable and Google Stitch: a user chats with an AI to define what they want, refines the design collaboratively, approves it, and the system generates a working prototype — then advises on what's needed to take it to production.

> **Status:** Phase 0 complete — foundation, authentication, database, CI/CD, and live deployment are in place and fully tested. Phase 1 (the AI chat + requirements engine) is next.

---

## Why this project

This is a from-scratch, production-minded build focused on modern AI-engineering practices — not a tutorial clone. Every architectural decision was made deliberately and documented, with an emphasis on type safety, testing, and reliable AI orchestration.

It's also built with a rigorous **AI-assisted engineering workflow**: automated PR review, a reconcile-based documentation system that keeps docs in lockstep with the code, and path-scoped agent memory. The goal was to practice building AI systems *the way a real team would*, with the guardrails a real team would have.

---

## Architecture

Aetherium is a single Next.js application that serves both the UI and the server, backed by a typed data layer, background job orchestration for long-running AI builds, and sandboxed code execution.

```
Browser (React)
    │
    ▼
Next.js 16 (App Router)  ──►  Clerk (auth: users + admin roles)
    │
    ▼
tRPC (typed API)  ──►  Prisma  ──►  Neon (Postgres)
    │
    ├──►  Vercel AI SDK        (streaming chat, tool calling)
    └──►  Inngest (durable jobs) ──►  E2B (sandboxed code execution)
```

The request lifecycle end-to-end: a typed tRPC call carries data between the client and server; Clerk resolves identity and role; Prisma reads/writes Postgres; the Vercel AI SDK handles streaming and tool calls; and long-running build work is offloaded to Inngest, which drives sandboxed execution in E2B so AI-generated code never runs on the host.

---

## Tech stack — and why

Every choice below was a deliberate trade-off, not a default.

| Layer | Choice | Why this one |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19) | One codebase for UI + server; server components by default |
| Language | **TypeScript (strict) + Zod** | Compile-time safety in our code; runtime validation at every external/AI boundary |
| API | **tRPC** | End-to-end type safety with zero schema duplication — ideal when both ends are TypeScript |
| Auth | **Clerk** | Production-grade sessions, user/admin roles, and billing without hand-rolling security-critical code |
| Database | **Neon (Postgres) + Prisma** | Serverless Postgres with a typed ORM and real migrations; kept separate from auth so there's no overlap with Clerk |
| AI | **Vercel AI SDK** | Provider-agnostic streaming, tool calling, and human-in-the-loop approval |
| Background jobs | **Inngest** | Durable, step-based execution with retries — builds take minutes and must survive failures |
| Sandbox | **E2B** | Isolated micro-VMs so AI-generated code runs safely, with pause/resume snapshots |
| Testing | **Vitest + React Testing Library + Playwright** | Fast unit/integration tests plus real-browser end-to-end coverage |
| CI/CD | **GitHub Actions + Vercel** (CodeRabbit planned) | Automated checks on every PR; auto-deploy on merge. AI review via CodeRabbit is planned but currently inactive (repo is under its 10-star threshold for free auto-review) — PRs are manually reviewed instead |

*(A deliberate note on scope: user roles are currently stored in Clerk metadata rather than a Postgres column — the simplest correct solution for the current phase, with the database-sync path scheduled for when the admin dashboard needs it.)*

---

## Engineering practices

- **End-to-end type safety** — TypeScript strict mode, tRPC across the client/server boundary, Zod validation on all external and AI input.
- **CI on every pull request** — lint, type-check, unit tests, and end-to-end tests must pass before merge; PRs are manually reviewed (CodeRabbit auto-review is planned, currently inactive under its 10-star threshold).
- **Real testing** — a unit suite plus Playwright end-to-end tests covering the authentication flows (logged-out redirect, authenticated access, and role-gated admin routes).
- **Thin vertical slices** — each phase ships something that runs end-to-end, verified against an explicit Definition of Done, rather than big-bang integration.
- **Documented decisions** — architectural choices, trade-offs, and deferred work are recorded so the reasoning is never lost.
- **Secrets discipline** — no secret has ever been committed; configuration is via environment variables only.

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/rad-code05/AetheriumByRad.git
cd AetheriumByRad

# 2. Install
npm install

# 3. Environment
cp .env.example .env
# then fill in the values (Neon DATABASE_URL, Clerk keys, etc.)

# 4. Database
npx prisma migrate dev

# 5. Run
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables
See `.env.example` for the full list. At minimum you'll need a Neon `DATABASE_URL` and your Clerk keys. Never commit real values.

### One extra Clerk setup step
For the admin role gate to actually reflect roles, your Clerk application needs a session token customization: in the Clerk Dashboard, go to **Sessions → Customize session token** and add:
```json
{ "metadata": "{{user.public_metadata}}" }
```
Without this, the app still runs fine — sign-up, sign-in, and the dashboard all work — but the admin check will never see a role, since `sessionClaims.metadata` stays empty. Set a test user's **Public** metadata to `{"role": "admin"}` on the same Dashboard page to test the gate.

---

## Roadmap

- **Phase 0 — Foundation** — Auth, database, dashboard, CI/CD, live deploy, full test coverage
- **Phase 1 — Chat & requirements** — Streaming AI chat that produces a structured project brief, with a "proceed to design" gate
- **Phase 2 — Design collaboration** — Generate and iterate on the UI, with an approval gate
- **Phase 3 — Build engine** — Durable AI build jobs (Inngest) executing generated code in E2B sandboxes, with resumable sessions
- **Phase 4 — Launch readiness** — An AI advisor that inspects the built prototype and guides connecting real services (POC vs production)

---

## License

> ⚠️ VERIFY / DECIDE: no license is included yet. Add one (e.g. MIT) if you want others to be able to use the code, or state "All rights reserved" if not. For a portfolio piece, MIT is a common, friendly default.

---

*Built by Rad. Aetherium is an active learning-and-engineering project — feedback welcome.*

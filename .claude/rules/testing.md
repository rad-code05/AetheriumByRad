---
paths:
  - "e2e/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "vitest.config.mts"
  - "playwright.config.ts"
---

# Testing conventions
- Vitest and Playwright must stay separated: `vitest.config.mts` explicitly excludes `e2e/**`
  (Vitest's default glob otherwise picks up Playwright's `*.spec.ts` files and crashes).
- tsconfig path aliases (`@/*`) resolve via Vite's native `resolve.tsconfigPaths: true` — not the
  `vite-tsconfig-paths` plugin (broken against the current Vite 8.x).
- e2e Clerk-authenticated tests use `@clerk/testing`: a one-time `clerkSetup()` in
  `e2e/global.setup.ts` (wired as a dependency in `playwright.config.ts`'s projects), then
  `setupClerkTestingToken({ page })` + `clerk.signIn({ page, emailAddress: process.env.E2E_CLERK_USER_EMAIL! })`
  per test — bypasses real email verification codes.
- CI runs `next typegen` before typecheck — a fresh checkout has no `.next/types/` yet, so
  `LayoutProps` etc. don't exist otherwise.
- Recurring local-only Windows `.next` EPERM cache errors: fixed via a Windows Defender folder
  exclusion for the whole project — not a code issue.

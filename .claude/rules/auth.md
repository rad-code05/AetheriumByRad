---
paths:
  - "src/proxy.ts"
  - "src/middleware.ts"
  - "src/app/sign-in/**"
  - "src/app/sign-up/**"
  - "src/app/admin/**"
  - "src/app/dashboard/**"
  - "src/types/globals.d.ts"
---

# Clerk auth conventions
- Auth guard is `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`), a default export
  wrapping `clerkMiddleware()`. Always Node.js runtime, no Edge — a non-issue for us.
- `auth.protect()` (no args) is enough for plain "must be logged in" gates (e.g. `/dashboard`) —
  auto-redirects to `NEXT_PUBLIC_CLERK_SIGN_IN_URL`.
- Custom role checks (e.g. admin-only) do NOT belong in `proxy.ts`/`auth.protect()` — that only
  understands Clerk Organization roles. Check `sessionClaims?.metadata?.role` inside the page
  itself and `redirect()` manually instead.
- Role lives in Clerk `publicMetadata`, NOT Postgres, for now (Phase 0 decision — revisit in
  Phase 4 when the admin dashboard needs to query users by role via a Clerk webhook).
- Requires a session-token claims customization in the Clerk Dashboard (Sessions → Customize
  session token → add `{"metadata": "{{user.public_metadata}}"}`) before `sessionClaims.metadata`
  is populated at all.

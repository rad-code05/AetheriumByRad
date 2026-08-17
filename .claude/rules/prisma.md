---
paths:
  - "prisma/**"
  - "src/lib/prisma.ts"
  - "prisma.config.ts"
---

# Prisma 7 specifics (confirmed via current docs, not assumed)
- CLI does NOT auto-load `.env` or read the connection URL from `schema.prisma` — both live in
  `prisma.config.ts` (which itself must `import "dotenv/config"`).
- `generator client` uses `provider = "prisma-client"` (not the old `"prisma-client-js"`), with a
  required explicit `output` path — ours is `src/generated/prisma` (gitignored, regenerated via
  `postinstall: "prisma generate"`).
- Postgres requires the `@prisma/adapter-pg` driver adapter — Prisma 7 dropped the bundled Rust engine.
- Every schema change needs a real migration: `npx prisma migrate dev --name <name>` — Rad runs
  this himself, it's the one command that touches the real Neon database.
- Current model: minimal `User` (id/email/createdAt). Role is NOT stored here — see `auth.md`.

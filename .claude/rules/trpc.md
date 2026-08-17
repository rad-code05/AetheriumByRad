---
paths:
  - "src/server/**"
  - "src/trpc/**"
  - "src/app/api/trpc/**"
---

# tRPC v11 conventions
- Use `@trpc/tanstack-react-query` (current App Router pattern: `createTRPCContext` → `useTRPC` +
  `queryOptions()`) — NOT the older `@trpc/react-query`/`createTRPCReact` classic hooks, deprecated.
- Server: `src/server/trpc.ts` (context + router/procedure builders), `src/server/routers/_app.ts`
  (the actual router).
- Client bridge (`src/trpc/client.tsx` + `query-client.ts`) gets its own top-level folder — it's
  neither backend logic (`src/server/`) nor a simple service client (`src/lib/`).
- Every procedure validates its input with Zod, no exceptions, even trivial ones (Golden Rule #2).
- Skip SSR prefetch/hydration (`HydrateClient`) unless there's a real perf need — plain client-side
  `useQuery` is enough for most cases so far.

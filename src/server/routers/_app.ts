import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/server/trpc";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello, ${input.text}!` };
    }),
});

export type AppRouter = typeof appRouter;

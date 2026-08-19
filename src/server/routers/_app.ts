import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/server/trpc";
import { messageRouter } from "@/server/routers/message";
import { projectRouter } from "@/server/routers/project";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello, ${input.text}!` };
    }),
  project: projectRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;

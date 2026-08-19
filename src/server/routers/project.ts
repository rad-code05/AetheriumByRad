import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

const projectSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  title: z.string(),
  brief: z.unknown().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1).optional() }))
    .output(projectSchema)
    .mutation(({ ctx, input }) => {
      return prisma.project.create({
        data: {
          clerkId: ctx.userId,
          ...(input.title ? { title: input.title } : {}),
        },
      });
    }),

  list: protectedProcedure.output(z.array(projectSchema)).query(({ ctx }) => {
    return prisma.project.findMany({
      where: { clerkId: ctx.userId },
      orderBy: { createdAt: "desc" },
    });
  }),
});

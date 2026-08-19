import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

const messageSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  role: z.string(),
  content: z.string(),
  createdAt: z.date(),
});

async function assertOwnsProject(projectId: string, clerkId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.clerkId !== clerkId) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
}

export const messageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      })
    )
    .output(messageSchema)
    .mutation(async ({ ctx, input }) => {
      await assertOwnsProject(input.projectId, ctx.userId);

      return prisma.message.create({
        data: {
          projectId: input.projectId,
          role: input.role,
          content: input.content,
        },
      });
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .output(z.array(messageSchema))
    .query(async ({ ctx, input }) => {
      await assertOwnsProject(input.projectId, ctx.userId);

      return prisma.message.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: "asc" },
      });
    }),
});

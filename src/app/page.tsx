import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <main className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm backdrop-blur-sm">
        <h1 className="text-gradient-brand text-3xl font-semibold tracking-tight">
          Aetherium
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm leading-6">
          Aurora light theme is wired up — Tailwind + shadcn/ui + Lucide icons,
          themed with the locked Clean &amp; Energetic palette.
        </p>
        <Button>
          <Sparkles />
          It works
        </Button>
      </main>
    </div>
  );
}

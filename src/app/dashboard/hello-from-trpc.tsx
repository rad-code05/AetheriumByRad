"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function HelloFromTrpc() {
  const trpc = useTRPC();
  const hello = useQuery(trpc.hello.queryOptions({ text: "Aetherium" }));

  if (!hello.data) return <p>Loading...</p>;

  return <p>{hello.data.greeting}</p>;
}

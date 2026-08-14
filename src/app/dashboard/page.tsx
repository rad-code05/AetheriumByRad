import { auth } from "@clerk/nextjs/server";

import { HelloFromTrpc } from "./hello-from-trpc";

export default async function DashboardPage() {
  await auth.protect();

  return (
    <div>
      <p>Dashboard — empty for now.</p>
      <HelloFromTrpc />
    </div>
  );
}

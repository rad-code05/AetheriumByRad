import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();

  return <p>Dashboard — empty for now.</p>;
}

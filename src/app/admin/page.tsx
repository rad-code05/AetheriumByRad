import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/");
  }

  return <p>Admin dashboard — visible to admins only.</p>;
}

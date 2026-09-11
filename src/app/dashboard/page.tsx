import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
    </main>
  );
}

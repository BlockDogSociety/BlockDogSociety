import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { signOut } from "@/features/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = isAdminEmail(user.email);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
      <Link href="/upload" className="rounded-md bg-black px-4 py-2 text-center text-white">
        Upload your dog
      </Link>
      <Link href="/vote" className="rounded-md border px-4 py-2 text-center">
        Vote on dogs
      </Link>
      <Link href="/calendar" className="rounded-md border px-4 py-2 text-center">
        View calendar
      </Link>
      {isAdmin && (
        <Link href="/admin" className="rounded-md border px-4 py-2 text-center">
          Admin
        </Link>
      )}
      <form action={signOut}>
        <button type="submit" className="w-full rounded-md border px-4 py-2">
          Sign out
        </button>
      </form>
    </main>
  );
}

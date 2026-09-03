import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">🐶 Block Dog Society</h1>
      <p className="text-gray-500">
        Upload your dog. Vote for the cutest. Top 12 make the calendar.
      </p>

      <div className="flex gap-3">
        <Link href="/vote" className="rounded-md border px-5 py-2.5">
          View dogs &amp; vote
        </Link>
        {user ? (
          <Link
            href="/dashboard"
            className="rounded-md bg-black px-5 py-2.5 text-white"
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link href="/signup" className="rounded-md bg-black px-5 py-2.5 text-white">
              Sign up
            </Link>
            <Link href="/login" className="rounded-md border px-5 py-2.5">
              Log in
            </Link>
          </>
        )}
      </div>

      <Link href="/contact" className="text-sm text-gray-500 underline">
        Recommend a rescue, or ask us something
      </Link>
    </main>
  );
}

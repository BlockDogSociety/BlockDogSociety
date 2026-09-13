import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;

  // Supabase appends a one-time PKCE code to the recovery link. The exchange
  // has to happen in a route handler (which can set cookies), not here.
  if (code) {
    redirect(`/auth/confirm?code=${encodeURIComponent(code)}&next=/reset-password`);
  }

  const user = error ? null : await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Set a new password</h1>
      {user ? (
        <ResetPasswordForm />
      ) : (
        <p className="text-sm text-red-600">
          This password reset link is invalid or has expired. Request a new one
          from the{" "}
          <Link href="/forgot-password" className="underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      )}
    </main>
  );
}

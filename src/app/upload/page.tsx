import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { UploadForm } from "@/features/dogs/components/UploadForm";
import { SUBMISSIONS_OPEN } from "@/lib/contest";

export default async function UploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!SUBMISSIONS_OPEN) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Submissions are closed</h1>
        <p className="text-gray-500">
          Thanks to everyone who entered! The winners are up on the{" "}
          <Link href="/calendar" className="underline">
            calendar
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Upload your dog</h1>
      <UploadForm />
    </main>
  );
}

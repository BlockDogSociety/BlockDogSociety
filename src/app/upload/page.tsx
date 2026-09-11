import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { UploadForm } from "@/features/dogs/components/UploadForm";

export default async function UploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Upload your dog</h1>
      <UploadForm />
    </main>
  );
}

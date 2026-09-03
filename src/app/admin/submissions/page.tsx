import { requireAdmin } from "@/lib/admin";
import { getContactSubmissions } from "@/features/contact/queries";

const TYPE_LABELS: Record<string, string> = {
  rescue_recommendation: "Rescue recommendation",
  question: "Question / comment",
};

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const submissions = await getContactSubmissions();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Submissions ({submissions.length})</h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-md border px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{TYPE_LABELS[s.type] ?? s.type}</span>
                <span className="text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
              {(s.name || s.email) && (
                <div className="text-gray-500">
                  {s.name}
                  {s.name && s.email ? " — " : ""}
                  {s.email}
                </div>
              )}
              <p className="mt-1">{s.message}</p>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

import { requireAdmin } from "@/lib/admin";
import { getTopDogs } from "@/features/dogs/queries";
import { FinalizeButton } from "@/features/calendar/components/FinalizeButton";
import { SendLaunchEmailButton } from "@/features/email/components/SendLaunchEmailButton";

export default async function AdminPage() {
  await requireAdmin();
  const standings = await getTopDogs(50);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Admin</h1>

      <div className="mb-8 flex flex-col gap-4 rounded-lg border p-4">
        <div>
          <h2 className="font-medium">1. Close voting</h2>
          <p className="text-sm text-gray-500">
            Locks in the current top 12 by vote count as the calendar lineup.
            Safe to run again — it re-picks the top 12 fresh each time.
          </p>
          <div className="mt-2">
            <FinalizeButton />
          </div>
        </div>

        <div>
          <h2 className="font-medium">2. Announce it</h2>
          <p className="text-sm text-gray-500">
            Emails every registered user that the calendar is ready to order.
          </p>
          <div className="mt-2">
            <SendLaunchEmailButton />
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-medium">Standings</h2>
      <ol className="flex flex-col gap-2">
        {standings.map((dog, i) => (
          <li
            key={dog.id}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <span>
              {i + 1}. {dog.name}
              {dog.selectedForCalendar ? " ⭐" : ""}
            </span>
            <span className="text-gray-500">{dog.voteCount} votes</span>
          </li>
        ))}
      </ol>
    </main>
  );
}

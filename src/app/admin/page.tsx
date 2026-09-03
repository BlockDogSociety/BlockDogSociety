import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getTopDogs } from "@/features/dogs/queries";
import { getPaidOrders } from "@/features/payments/queries";
import { FinalizeButton } from "@/features/calendar/components/FinalizeButton";
import { SendLaunchEmailButton } from "@/features/email/components/SendLaunchEmailButton";

export default async function AdminPage() {
  await requireAdmin();
  const standings = await getTopDogs(50);
  const orders = await getPaidOrders();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Link href="/admin/submissions" className="text-sm underline">
          Submissions
        </Link>
      </div>

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
            <span className="flex items-center gap-3">
              <span className="text-gray-500">{dog.voteCount} votes</span>
              <Link href={`/admin/crop/${dog.id}`} className="text-sm underline">
                Crop
              </Link>
            </span>
          </li>
        ))}
      </ol>

      <h2 className="mt-8 mb-3 font-medium">Orders to fulfill ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No paid orders yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-md border px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {order.shippingName ?? order.buyerEmail ?? "Unknown"}
                </span>
                <span className="text-gray-500">
                  ${(order.amountTotal / 100).toFixed(2)} CAD
                </span>
              </div>
              <div className="text-gray-500">{order.buyerEmail}</div>
              {order.shippingAddress && (
                <address className="mt-1 not-italic text-gray-500">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postal_code}
                  <br />
                  {order.shippingAddress.country}
                </address>
              )}
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

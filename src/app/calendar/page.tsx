import Image from "next/image";
import { getSelectedDogs } from "@/features/dogs/queries";
import { BuyButton } from "@/features/payments/components/BuyButton";
import { CALENDAR_PRICE_CENTS } from "@/lib/pricing";

export default async function CalendarPage() {
  const dogs = await getSelectedDogs();
  const priceDisplay = `$${(CALENDAR_PRICE_CENTS / 100).toFixed(2)}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold">The Block Dog Society Calendar</h1>

      {dogs.length === 0 ? (
        <p className="text-gray-500">
          Voting is still open — check back once the top 12 are announced.
        </p>
      ) : (
        <>
          <p className="mb-6 text-gray-500">
            The 12 cutest dogs, voted by you. {priceDisplay} + shipping.
          </p>
          <div className="mb-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={dog.photoUrl}
                  alt={dog.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <BuyButton priceDisplay={priceDisplay} />
        </>
      )}
    </main>
  );
}

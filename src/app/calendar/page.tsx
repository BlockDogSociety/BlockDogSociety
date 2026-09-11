import Image from "next/image";
import { getSelectedDogs } from "@/features/dogs/queries";
import { BuyButton } from "@/features/payments/components/BuyButton";
import { CALENDAR_PRICE_CENTS } from "@/lib/pricing";

export default async function CalendarPage() {
  const dogs = await getSelectedDogs();
  const priceDisplay = `$${(CALENDAR_PRICE_CENTS / 100).toFixed(2)} CAD`;

  return (
    <main className="px-6 py-10">
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
          <div className="mb-8 flex flex-col gap-10">
            {dogs.map((dog) => (
              <div key={dog.id} className="flex flex-col gap-2">
                <div className="relative h-[80vh] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={dog.photoUrl}
                    alt={dog.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="text-lg font-medium">{dog.name}</p>
              </div>
            ))}
          </div>
          <BuyButton priceDisplay={priceDisplay} />
        </>
      )}
    </main>
  );
}

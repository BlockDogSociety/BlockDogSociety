import { DogImage } from "@/components/DogImage";
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
            The 12 cutest dogs, voted by you. {priceDisplay} each + shipping.
          </p>
          <div className="mb-8 flex flex-col gap-10">
            {dogs.map((dog) => (
              <div key={dog.id} className="flex flex-col gap-2">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-100">
                  <DogImage
                    src={dog.calendarUrl}
                    alt={dog.name}
                    sizes="(min-width: 1024px) 1024px, 100vw"
                  />
                </div>
                <p className="text-lg font-medium">{dog.name}</p>
              </div>
            ))}
          </div>
          <BuyButton />
        </>
      )}
    </main>
  );
}

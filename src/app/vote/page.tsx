import Image from "next/image";
import { getDogs } from "@/features/dogs/queries";
import { VoteButton } from "@/features/votes/components/VoteButton";

export default async function VotePage() {
  const dogs = await getDogs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Vote for the cutest dog</h1>

      {dogs.length === 0 ? (
        <p className="text-gray-500">No dogs yet — be the first to upload one.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {dogs.map((dog) => (
            <div key={dog.id} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={dog.photoUrl}
                  alt={dog.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <p className="font-medium">{dog.name}</p>
              {dog.story && (
                <p className="line-clamp-3 text-sm text-gray-500">{dog.story}</p>
              )}
              <VoteButton dogId={dog.id} voteCount={dog.voteCount} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

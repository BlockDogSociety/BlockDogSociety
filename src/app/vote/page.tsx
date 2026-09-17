import Image from "next/image";
import { getDogs } from "@/features/dogs/queries";
import { VoteButton } from "@/features/votes/components/VoteButton";
import { DeleteDogButton } from "@/features/dogs/components/DeleteDogButton";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { isAdminEmail } from "@/lib/admin";

export default async function VotePage() {
  const user = await getCurrentUser();
  const isAdmin = isAdminEmail(user?.email);

  const dogs = await getDogs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Vote for the cutest dog</h1>

      {dogs.length === 0 ? (
        <p className="text-gray-500">No dogs yet — be the first to upload one.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {dogs.map((dog) => (
            <div key={dog.id} className="flex h-full flex-col gap-2">
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
              <p className="line-clamp-3 min-h-[3.75rem] text-sm text-gray-500">
                {dog.story}
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <VoteButton dogId={dog.id} voteCount={isAdmin ? dog.voteCount : undefined} />
                {(isAdmin || (user && dog.ownerId === user.id)) && (
                  <DeleteDogButton dogId={dog.id} dogName={dog.name} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

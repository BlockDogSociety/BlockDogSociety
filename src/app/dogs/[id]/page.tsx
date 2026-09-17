import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDogs } from "@/features/dogs/queries";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { isAdminEmail } from "@/lib/admin";
import { VoteButton } from "@/features/votes/components/VoteButton";
import { getVotedDogIds } from "@/features/votes/queries";
import { DeleteDogButton } from "@/features/dogs/components/DeleteDogButton";
import { ScrollToHash } from "@/components/ScrollToHash";

export default async function DogViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [dogs, votedIds] = await Promise.all([getDogs(), getVotedDogIds(user?.id)]);
  const isAdmin = isAdminEmail(user?.email);

  if (!dogs.some((dog) => dog.id === id)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <ScrollToHash id={id} />

      <div className="sticky top-[59px] z-10 -mx-4 mb-6 border-b bg-white px-4 py-3 md:top-0">
        <Link href="/vote" className="inline-flex items-center gap-2 text-sm font-medium">
          <span aria-hidden="true" className="text-lg leading-none">
            ←
          </span>
          Back to all dogs
        </Link>
      </div>

      <div className="flex flex-col gap-14">
        {dogs.map((dog) => (
          <article key={dog.id} id={dog.id} className="scroll-mt-[7.5rem] flex flex-col gap-3 md:scroll-mt-20">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={dog.photoUrl}
                alt={dog.name}
                fill
                unoptimized
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-semibold">{dog.name}</h2>
            {dog.story && (
              <p className="whitespace-pre-line text-gray-700">{dog.story}</p>
            )}
            <div className="flex max-w-xs flex-col gap-2">
              <VoteButton
                  dogId={dog.id}
                  voted={votedIds.has(dog.id)}
                  voteCount={isAdmin ? dog.voteCount : undefined}
                />
              {(isAdmin || (user && dog.ownerId === user.id)) && (
                <DeleteDogButton dogId={dog.id} dogName={dog.name} />
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

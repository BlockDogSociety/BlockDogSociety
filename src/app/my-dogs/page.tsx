import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getDogsByOwner } from "@/features/dogs/queries";
import { DeleteDogButton } from "@/features/dogs/components/DeleteDogButton";

export default async function MyDogsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const dogs = await getDogsByOwner(user.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Your submissions</h1>

      {dogs.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t submitted a dog yet.{" "}
          <Link href="/upload" className="underline">
            Submit one
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {dogs.map((dog) => (
            <div key={dog.id} className="flex h-full flex-col gap-2">
              <Link href={`/dogs/${dog.id}`} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image src={dog.photoUrl} alt={dog.name} fill unoptimized className="object-cover" />
                </div>
                <p className="font-medium">{dog.name}</p>
                <p className="line-clamp-3 min-h-[3.75rem] text-sm text-gray-500">{dog.story}</p>
              </Link>
              <div className="mt-auto">
                <DeleteDogButton dogId={dog.id} dogName={dog.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

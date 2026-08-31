import { createClient } from "@/lib/supabase/server";

export type DogWithVotes = {
  id: string;
  name: string;
  photoUrl: string;
  voteCount: number;
};

export async function getDogs(): Promise<DogWithVotes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dogs")
    .select("id, name, photo_path, votes(count)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((dog) => ({
    id: dog.id,
    name: dog.name,
    photoUrl: supabase.storage.from("dog-photos").getPublicUrl(dog.photo_path)
      .data.publicUrl,
    voteCount: dog.votes?.[0]?.count ?? 0,
  }));
}

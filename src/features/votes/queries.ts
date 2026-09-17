import { createClient } from "@/lib/supabase/server";

export async function getVotedDogIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) {
    return new Set();
  }

  const supabase = await createClient();
  const { data } = await supabase.from("votes").select("dog_id").eq("voter_id", userId);

  return new Set((data ?? []).map((row) => row.dog_id));
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

const MAX_VOTES_PER_USER = 12;

export type VoteState = { error: string | null; voted?: boolean };

// The admin can vote unlimited times, including repeatedly for the same
// dog — everyone else gets at most MAX_VOTES_PER_USER distinct dogs, one
// vote each. Enforced here in the app rather than a DB unique constraint,
// since the admin needs to be exempt from the "one vote per dog" rule too.
export async function castVote(
  dogId: string,
  _prevState: VoteState, // eslint-disable-line @typescript-eslint/no-unused-vars
  _formData: FormData, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<VoteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("voter_id", user.id)
      .eq("dog_id", dogId)
      .maybeSingle();

    if (existingVote) {
      return { error: null, voted: true };
    }

    const { count } = await supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("voter_id", user.id);

    if ((count ?? 0) >= MAX_VOTES_PER_USER) {
      return { error: `You can only vote for up to ${MAX_VOTES_PER_USER} dogs.` };
    }
  }

  const { error } = await supabase
    .from("votes")
    .insert({ voter_id: user.id, dog_id: dogId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vote");
  revalidatePath("/dogs/[id]", "page");
  return { error: null, voted: true };
}

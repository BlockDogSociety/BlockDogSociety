"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const UNIQUE_VIOLATION = "23505";

export async function castVote(dogId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("votes")
    .insert({ voter_id: user.id, dog_id: dogId });

  if (error && error.code !== UNIQUE_VIOLATION) {
    throw new Error(error.message);
  }

  revalidatePath("/vote");
}

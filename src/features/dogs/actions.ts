"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateDogState = { error: string | null };

// The photo itself is uploaded client-side straight to Supabase Storage
// (see UploadForm) — Server Actions cap request bodies at 1MB by default,
// far below a typical phone photo, so only the resulting path comes through.
export async function createDog(
  _prevState: CreateDogState,
  formData: FormData,
): Promise<CreateDogState> {
  const name = formData.get("name") as string;
  const photoPath = formData.get("photoPath") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!photoPath) {
    return { error: "Please choose a photo." };
  }

  const { error } = await supabase.from("dogs").insert({
    owner_id: user.id,
    name,
    photo_path: photoPath,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vote");
  redirect("/vote");
}

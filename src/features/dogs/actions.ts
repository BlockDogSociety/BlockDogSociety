"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { isAdminEmail } from "@/lib/admin";

export type CreateDogState = { error: string | null };
export type DeleteDogState = { error: string | null };

// The photo itself is uploaded client-side straight to Supabase Storage
// (see UploadForm) — Server Actions cap request bodies at 1MB by default,
// far below a typical phone photo, so only the resulting path comes through.
export async function createDog(
  _prevState: CreateDogState,
  formData: FormData,
): Promise<CreateDogState> {
  const name = formData.get("name") as string;
  const story = (formData.get("story") as string) || null;
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
    story,
    photo_path: photoPath,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vote");
  redirect("/vote");
}

export async function deleteDog(
  dogId: string,
  _prevState: DeleteDogState,
): Promise<DeleteDogState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();
  const { data: dog } = await admin
    .from("dogs")
    .select("owner_id, photo_path")
    .eq("id", dogId)
    .maybeSingle();

  if (!dog) {
    return { error: "This dog has already been removed." };
  }
  if (dog.owner_id !== user.id && !isAdminEmail(user.email)) {
    return { error: "You can only delete your own submissions." };
  }

  // Votes cascade via the foreign key; the photo file has to go separately.
  const { error } = await admin.from("dogs").delete().eq("id", dogId);
  if (error) {
    return { error: error.message };
  }
  await admin.storage.from("dog-photos").remove([dog.photo_path]);

  revalidatePath("/vote");
  revalidatePath("/my-dogs");
  revalidatePath("/admin");
  revalidatePath("/calendar");
  return { error: null };
}

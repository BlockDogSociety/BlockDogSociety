"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UploadDogState = { error: string | null };

export async function uploadDog(
  _prevState: UploadDogState,
  formData: FormData,
): Promise<UploadDogState> {
  const name = formData.get("name") as string;
  const photo = formData.get("photo") as File;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!photo || photo.size === 0) {
    return { error: "Please choose a photo." };
  }

  const extension = photo.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("dog-photos")
    .upload(path, photo);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("dogs").insert({
    owner_id: user.id,
    name,
    photo_path: path,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/vote");
  redirect("/vote");
}

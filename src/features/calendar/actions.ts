"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTopDogs } from "@/features/dogs/queries";

export async function finalizeCalendar() {
  await requireAdmin();

  const topDogs = await getTopDogs(12);
  const supabase = createAdminClient();

  await supabase
    .from("dogs")
    .update({ selected_for_calendar: false })
    .not("id", "is", null);

  if (topDogs.length > 0) {
    await supabase
      .from("dogs")
      .update({ selected_for_calendar: true })
      .in(
        "id",
        topDogs.map((dog) => dog.id),
      );
  }

  revalidatePath("/calendar");
  revalidatePath("/admin");
}

// Records a hand-framed calendar photo. The blob itself is uploaded straight
// to Storage from the browser (Server Actions cap bodies at 1MB), so only the
// resulting path comes through here.
export async function setCalendarCrop(dogId: string, cropPath: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: dog } = await supabase
    .from("dogs")
    .select("calendar_crop_path")
    .eq("id", dogId)
    .maybeSingle();

  const { error } = await supabase
    .from("dogs")
    .update({ calendar_crop_path: cropPath })
    .eq("id", dogId);

  if (error) {
    throw new Error(error.message);
  }

  // Each crop gets a fresh filename so caches can't serve a stale one; the
  // superseded file is no longer referenced, so drop it.
  if (dog?.calendar_crop_path && dog.calendar_crop_path !== cropPath) {
    await supabase.storage.from("dog-photos").remove([dog.calendar_crop_path]);
  }

  revalidatePath("/calendar");
  revalidatePath("/admin");
  revalidatePath(`/admin/crop/${dogId}`);
}

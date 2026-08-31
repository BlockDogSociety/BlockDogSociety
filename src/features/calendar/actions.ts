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

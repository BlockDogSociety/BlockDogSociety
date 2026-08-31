import { createClient } from "@/lib/supabase/server";

export type DogStanding = {
  id: string;
  name: string;
  photoUrl: string;
  voteCount: number;
  selectedForCalendar: boolean;
};

type StandingRow = {
  id: string;
  name: string;
  photo_path: string;
  vote_count: number;
  selected_for_calendar: boolean;
};

function toStanding(
  supabase: Awaited<ReturnType<typeof createClient>>,
  row: StandingRow,
): DogStanding {
  return {
    id: row.id,
    name: row.name,
    photoUrl: supabase.storage.from("dog-photos").getPublicUrl(row.photo_path)
      .data.publicUrl,
    voteCount: row.vote_count,
    selectedForCalendar: row.selected_for_calendar,
  };
}

// Queries the dogs table directly (not the dog_standings view below) so this
// keeps working on the schema from schema.sql alone — it doesn't need the
// Phase 3 migration (phase3.sql) to have been run yet.
export async function getDogs(): Promise<DogStanding[]> {
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
    selectedForCalendar: false,
  }));
}

// The functions below require phase3.sql (the dog_standings view) to have
// been run — they're only used by the new /admin and /calendar pages.
export async function getTopDogs(limit: number): Promise<DogStanding[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dog_standings")
    .select("id, name, photo_path, vote_count, selected_for_calendar")
    .order("vote_count", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => toStanding(supabase, row));
}

export async function getSelectedDogs(): Promise<DogStanding[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dog_standings")
    .select("id, name, photo_path, vote_count, selected_for_calendar")
    .eq("selected_for_calendar", true)
    .order("vote_count", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => toStanding(supabase, row));
}

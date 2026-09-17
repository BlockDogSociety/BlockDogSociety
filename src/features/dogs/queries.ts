import { createClient } from "@/lib/supabase/server";

export type DogStanding = {
  id: string;
  ownerId: string | null;
  name: string;
  story: string | null;
  photoUrl: string;
  voteCount: number;
  selectedForCalendar: boolean;
};

type StandingRow = {
  id: string;
  name: string;
  story: string | null;
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
    ownerId: null,
    name: row.name,
    story: row.story,
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
    .select("id, owner_id, name, story, photo_path, votes(count)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((dog) => ({
    id: dog.id,
    ownerId: dog.owner_id,
    name: dog.name,
    story: dog.story,
    photoUrl: supabase.storage.from("dog-photos").getPublicUrl(dog.photo_path)
      .data.publicUrl,
    voteCount: dog.votes?.[0]?.count ?? 0,
    selectedForCalendar: false,
  }));
}

export async function getDogsByOwner(ownerId: string): Promise<DogStanding[]> {
  const dogs = await getDogs();
  return dogs.filter((dog) => dog.ownerId === ownerId);
}

// The functions below require phase3.sql (the dog_standings view) to have
// been run — they're only used by the new /admin and /calendar pages.
export async function getTopDogs(limit: number): Promise<DogStanding[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dog_standings")
    .select("id, name, story, photo_path, vote_count, selected_for_calendar")
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
    .select("id, name, story, photo_path, vote_count, selected_for_calendar")
    .eq("selected_for_calendar", true)
    .order("vote_count", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => toStanding(supabase, row));
}

export async function getDogById(id: string): Promise<DogStanding | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dogs")
    .select("id, owner_id, name, story, photo_path")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    ownerId: data.owner_id,
    name: data.name,
    story: data.story,
    photoUrl: supabase.storage.from("dog-photos").getPublicUrl(data.photo_path)
      .data.publicUrl,
    voteCount: 0,
    selectedForCalendar: false,
  };
}

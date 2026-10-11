import { createClient } from "@/lib/supabase/server";

export type DogStanding = {
  id: string;
  ownerId: string | null;
  name: string;
  story: string | null;
  /** Original upload — only the admin crop tool should load this. */
  photoUrl: string;
  /** ~640px, for grids. */
  thumbUrl: string;
  /** ~1600px, for the full-size viewer. */
  displayUrl: string;
  /** Admin-framed 3:2 crop for the calendar page; falls back to displayUrl. */
  calendarUrl: string;
  hasCalendarCrop: boolean;
  voteCount: number;
  selectedForCalendar: boolean;
};

type StandingRow = {
  id: string;
  owner_id?: string;
  name: string;
  story: string | null;
  photo_path: string;
  thumb_path: string | null;
  display_path: string | null;
  calendar_crop_path: string | null;
  vote_count: number;
  selected_for_calendar: boolean;
};

type Supabase = Awaited<ReturnType<typeof createClient>>;

const PHOTO_COLUMNS = "photo_path, thumb_path, display_path, calendar_crop_path";

function photoUrls(
  supabase: Supabase,
  row: {
    photo_path: string;
    thumb_path: string | null;
    display_path: string | null;
    calendar_crop_path?: string | null;
  },
) {
  const url = (path: string) =>
    supabase.storage.from("dog-photos").getPublicUrl(path).data.publicUrl;
  const display = row.display_path ?? row.photo_path;
  return {
    photoUrl: url(row.photo_path),
    thumbUrl: url(row.thumb_path ?? row.photo_path),
    displayUrl: url(display),
    calendarUrl: url(row.calendar_crop_path ?? display),
    hasCalendarCrop: Boolean(row.calendar_crop_path),
  };
}

function toStanding(supabase: Supabase, row: StandingRow): DogStanding {
  return {
    id: row.id,
    ownerId: row.owner_id ?? null,
    name: row.name,
    story: row.story,
    ...photoUrls(supabase, row),
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
    .select(`id, owner_id, name, story, ${PHOTO_COLUMNS}, votes(count)`)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((dog) => ({
    id: dog.id,
    ownerId: dog.owner_id,
    name: dog.name,
    story: dog.story,
    ...photoUrls(supabase, dog),
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
    .select(`id, owner_id, name, story, ${PHOTO_COLUMNS}, vote_count, selected_for_calendar`)
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
    .select(`id, name, story, ${PHOTO_COLUMNS}, vote_count, selected_for_calendar`)
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
    .select(`id, owner_id, name, story, ${PHOTO_COLUMNS}`)
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
    ...photoUrls(supabase, data),
    voteCount: 0,
    selectedForCalendar: false,
  };
}

// Admin-only: resolves each dog's owner to their account email so the
// admin can contact winners. Needs the service-role client to read auth.users.
export async function getOwnerEmails(dogs: DogStanding[]): Promise<Map<string, string>> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const ownerIds = [...new Set(dogs.map((d) => d.ownerId).filter((id): id is string => !!id))];

  const emails = new Map<string, string>();
  await Promise.all(
    ownerIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      if (data.user?.email) emails.set(id, data.user.email);
    }),
  );
  return emails;
}

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactSubmission = {
  id: string;
  type: "rescue_recommendation" | "question";
  name: string | null;
  email: string | null;
  message: string;
  createdAt: string;
};

// Admin-only: there's no select policy for anon/authenticated on
// contact_submissions, so this must use the service-role client.
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, type, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  }));
}

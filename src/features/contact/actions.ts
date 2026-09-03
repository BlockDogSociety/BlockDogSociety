"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactState = { message: string | null; error: string | null };

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const type = formData.get("type") as string;
  const name = (formData.get("name") as string) || null;
  const email = (formData.get("email") as string) || null;
  const message = formData.get("message") as string;

  if (!message) {
    return { message: null, error: "Please enter a message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    type,
    name,
    email,
    message,
  });

  if (error) {
    return { message: null, error: error.message };
  }

  return { message: "Thanks — we'll take a look!", error: null };
}

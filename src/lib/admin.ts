import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | null | undefined) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return Boolean(adminEmail && email?.toLowerCase() === adminEmail);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  return user;
}

import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";

export function isAdminEmail(email: string | null | undefined) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return Boolean(adminEmail && email?.toLowerCase() === adminEmail);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  return user;
}

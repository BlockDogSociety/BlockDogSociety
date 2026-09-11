import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Wrapped in React's cache() so that layout.tsx, the page itself, and
// anything else in the same render (e.g. requireAdmin) share a single
// getUser() call instead of each paying its own ~250-500ms round trip
// to Supabase's auth server for the same request.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

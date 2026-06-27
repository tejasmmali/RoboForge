import { createClient as createBrowserClient } from "@/lib/supabase/client";

export function getBrowserDb() {
  return createBrowserClient();
}

export type SupabaseClient = ReturnType<typeof getBrowserDb>;

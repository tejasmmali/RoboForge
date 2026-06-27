import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getServerDb() {
  return createServerClient();
}

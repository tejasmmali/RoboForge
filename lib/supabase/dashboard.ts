/** @deprecated Import from @/lib/db modules directly */
export { getProfile, ensureProfile } from "@/lib/db/profiles";
export {
  getSavedProjects,
  getSavedComponents,
  saveProject,
  removeBookmark as removeSavedProject,
} from "@/lib/db/bookmarks";
export {
  getProjectProgressList as getProjectProgress,
  updateProgress as updateProjectProgress,
} from "@/lib/db/progress";
export { listConversations as getChatHistory } from "@/lib/db/chat";
export { getNotifications } from "@/lib/db/notifications";
export { getAchievements } from "@/lib/db/achievements";

export async function getRecentActivity(userId: string, limit = 10) {
  const { getBrowserDb } = await import("@/lib/db/client");
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

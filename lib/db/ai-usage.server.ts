import { cookies } from "next/headers";
import {
  getChatDailyLimit,
  getChatMonthlyLimit,
  getGuestDailyLimit,
  mapQuotaConsumeRow,
  parseQuotaStatus,
  type ChatQuotaConsumeResult,
  type ChatQuotaStatus,
} from "@/lib/ai/chat-limits";
import { createClient } from "@/lib/supabase/server";

const GUEST_DATE_COOKIE = "rf_guest_date";
const GUEST_COUNT_COOKIE = "rf_guest_count";

function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export type GuestUsageUpdate = {
  count: number;
  date: string;
};

async function readGuestUsage(): Promise<{ count: number; date: string }> {
  try {
    const cookieStore = await cookies();
    const today = utcToday();
    const storedDate = cookieStore.get(GUEST_DATE_COOKIE)?.value ?? "";
    const rawCount = Number(cookieStore.get(GUEST_COUNT_COOKIE)?.value ?? "0");
    const count =
      storedDate === today && Number.isFinite(rawCount)
        ? Math.max(rawCount, 0)
        : 0;

    return { count, date: today };
  } catch {
    return { count: 0, date: utcToday() };
  }
}

function guestQuotaStatus(used: number): ChatQuotaStatus {
  const limit = getGuestDailyLimit();
  return {
    authenticated: false,
    dailyUsed: used,
    dailyLimit: limit,
    monthlyUsed: used,
    monthlyLimit: limit,
    dailyRemaining: Math.max(limit - used, 0),
    monthlyRemaining: Math.max(limit - used, 0),
  };
}

async function consumeGuestQuota(): Promise<{
  result: ChatQuotaConsumeResult;
  cookieUpdate?: GuestUsageUpdate;
}> {
  const { count } = await readGuestUsage();
  const limit = getGuestDailyLimit();
  const status = guestQuotaStatus(count);

  if (count >= limit) {
    return {
      result: {
        ...status,
        allowed: false,
        reason: "daily_limit",
      },
    };
  }

  const nextCount = count + 1;
  return {
    result: {
      ...guestQuotaStatus(nextCount),
      allowed: true,
    },
    cookieUpdate: { count: nextCount, date: utcToday() },
  };
}

export async function applyGuestUsageCookie(update: GuestUsageUpdate) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(GUEST_DATE_COOKIE, update.date, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set(GUEST_COUNT_COOKIE, String(update.count), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  } catch {
    // Cookie writes can fail in some edge runtimes; quota still enforced per request.
  }
}

export async function consumeChatQuotaForGuest() {
  return consumeGuestQuota();
}

export async function getChatQuotaStatus(): Promise<ChatQuotaStatus> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { count } = await readGuestUsage();
    return guestQuotaStatus(count);
  }

  const { data, error } = await supabase.rpc("get_ai_chat_quota_status", {
    p_daily_limit: getChatDailyLimit(),
    p_monthly_limit: getChatMonthlyLimit(),
  });

  if (error || !data) {
    return fallbackQuotaFromMessages(user.id);
  }

  return parseQuotaStatus(data as Record<string, unknown>);
}

export async function consumeChatQuota(): Promise<ChatQuotaConsumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return consumeGuestQuota().then(({ result }) => result);
  }

  const { data, error } = await supabase.rpc("consume_ai_chat_quota", {
    p_daily_limit: getChatDailyLimit(),
    p_monthly_limit: getChatMonthlyLimit(),
  });

  if (error || !data) {
    return fallbackConsumeFromMessages(user.id);
  }

  return mapQuotaConsumeRow(data as Record<string, unknown>);
}

async function fallbackQuotaFromMessages(userId: string): Promise<ChatQuotaStatus> {
  const supabase = await createClient();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startOfMonth = new Date(
    Date.UTC(startOfDay.getUTCFullYear(), startOfDay.getUTCMonth(), 1),
  );

  const { count: dailyUsed } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .gte("created_at", startOfDay.toISOString());

  const { count: monthlyUsed } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .gte("created_at", startOfMonth.toISOString());

  const dailyLimit = getChatDailyLimit();
  const monthlyLimit = getChatMonthlyLimit();
  const daily = dailyUsed ?? 0;
  const monthly = monthlyUsed ?? 0;

  return {
    authenticated: true,
    dailyUsed: daily,
    dailyLimit,
    monthlyUsed: monthly,
    monthlyLimit,
    dailyRemaining: Math.max(dailyLimit - daily, 0),
    monthlyRemaining: Math.max(monthlyLimit - monthly, 0),
  };
}

async function fallbackConsumeFromMessages(
  userId: string,
): Promise<ChatQuotaConsumeResult> {
  const status = await fallbackQuotaFromMessages(userId);

  if (status.dailyUsed >= status.dailyLimit) {
    return { ...status, allowed: false, reason: "daily_limit" };
  }
  if (status.monthlyUsed >= status.monthlyLimit) {
    return { ...status, allowed: false, reason: "monthly_limit" };
  }

  return {
    ...status,
    allowed: true,
    dailyUsed: status.dailyUsed + 1,
    monthlyUsed: status.monthlyUsed + 1,
    dailyRemaining: Math.max(status.dailyRemaining - 1, 0),
    monthlyRemaining: Math.max(status.monthlyRemaining - 1, 0),
  };
}

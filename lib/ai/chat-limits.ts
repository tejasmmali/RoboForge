export type ChatQuotaStatus = {
  authenticated: boolean;
  unlimited?: boolean;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  dailyRemaining: number;
  monthlyRemaining: number;
};

export type ChatQuotaConsumeResult = ChatQuotaStatus & {
  allowed: boolean;
  reason?: "unauthorized" | "daily_limit" | "monthly_limit";
};

const DEFAULT_DAILY = 25;
const DEFAULT_MONTHLY = 200;
const DEFAULT_GUEST_DAILY = 8;

export function getChatDailyLimit(): number {
  const parsed = Number(process.env.AI_CHAT_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY;
}

export function getChatMonthlyLimit(): number {
  const parsed = Number(process.env.AI_CHAT_MONTHLY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MONTHLY;
}

export function getGuestDailyLimit(): number {
  const parsed = Number(process.env.AI_CHAT_GUEST_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GUEST_DAILY;
}

function mapQuotaRow(row: Record<string, unknown>): ChatQuotaStatus {
  return {
    authenticated: Boolean(row.authenticated),
    unlimited: Boolean(row.unlimited),
    dailyUsed: Number(row.daily_used ?? 0),
    dailyLimit: Number(row.daily_limit ?? getChatDailyLimit()),
    monthlyUsed: Number(row.monthly_used ?? 0),
    monthlyLimit: Number(row.monthly_limit ?? getChatMonthlyLimit()),
    dailyRemaining: Number(row.daily_remaining ?? 0),
    monthlyRemaining: Number(row.monthly_remaining ?? 0),
  };
}

export function mapQuotaConsumeRow(
  row: Record<string, unknown>,
): ChatQuotaConsumeResult {
  const base = mapQuotaRow(row);
  return {
    ...base,
    allowed: Boolean(row.allowed),
    reason: row.reason as ChatQuotaConsumeResult["reason"],
  };
}

export function quotaErrorMessage(result: ChatQuotaConsumeResult): string {
  if (result.reason === "monthly_limit") {
    return `You've used all ${result.monthlyLimit} AI messages for this month. Resets on the 1st.`;
  }
  if (!result.authenticated) {
    return `You've used all ${result.dailyLimit} free guest messages for today. Sign in for more.`;
  }
  return `You've used all ${result.dailyLimit} AI messages for today. Try again tomorrow.`;
}

export { mapQuotaRow as parseQuotaStatus };

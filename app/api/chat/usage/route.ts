import { NextResponse } from "next/server";
import { getChatQuotaStatus } from "@/lib/db/ai-usage.server";

export async function GET() {
  try {
    const status = await getChatQuotaStatus();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json(
      { error: "Failed to load chat usage." },
      { status: 500 },
    );
  }
}

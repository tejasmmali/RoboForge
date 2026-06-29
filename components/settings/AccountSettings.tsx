"use client";

import { Calendar, Mail, ShieldCheck } from "lucide-react";
import { SettingsCard, SettingsRow } from "@/components/settings/SettingsCard";
import { useAuth } from "@/hooks/useAuth";

export function AccountSettings() {
  const { user, profile } = useAuth();

  const email = profile?.email ?? user?.email ?? "";
  const createdAt = profile?.created_at ?? user?.created_at;
  const provider =
    (user?.app_metadata?.provider as string | undefined) ??
    user?.identities?.[0]?.provider ??
    "email";
  const emailVerified = Boolean(user?.email_confirmed_at);

  return (
    <div className="space-y-6">
      <SettingsCard title="Account" description="Your RoboForge account details.">
        <SettingsRow label="Email" description={emailVerified ? "Verified" : "Not verified"}>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
            {email}
          </span>
        </SettingsRow>
        <SettingsRow label="Account created">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
            {createdAt
              ? new Date(createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        </SettingsRow>
        <SettingsRow label="Authentication provider">
          <span className="rounded-full border border-border px-3 py-1 text-[12px] capitalize text-muted">
            {provider}
          </span>
        </SettingsRow>
        <SettingsRow label="Membership">
          <span className="text-[13px] text-muted">Free — Student</span>
        </SettingsRow>
        <SettingsRow label="Account status">
          <span className="flex items-center gap-1.5 text-[13px] text-foreground">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Active
          </span>
        </SettingsRow>
      </SettingsCard>

      <SettingsCard title="Email actions" description="Manage your login email.">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted opacity-60"
            title="Coming soon"
          >
            Change email
          </button>
          {!emailVerified ? (
            <button
              type="button"
              className="rounded-[10px] border border-foreground bg-foreground px-4 py-2 text-[13px] font-medium text-background"
            >
              Verify email
            </button>
          ) : null}
        </div>
      </SettingsCard>
    </div>
  );
}

"use client";

import { useState } from "react";
import { SettingsCard, SettingsRow } from "@/components/settings/SettingsCard";
import { PreferenceSelect } from "@/components/settings/PreferenceSelect";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";
import { ConfirmationModal } from "@/components/settings/ConfirmationModal";
import { SettingsSkeleton } from "@/components/settings/SettingsToast";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { clearUserSearchHistory, deleteUserAiHistory } from "@/lib/db/settings";
import { useAuth } from "@/hooks/useAuth";
import type { PrivacySettings } from "@/types/settings";

type PrivacySettingsProps = {
  onSuccess: (message: string) => void;
};

export function PrivacySettingsPanel({ onSuccess }: PrivacySettingsProps) {
  const { user } = useAuth();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [confirmAiDelete, setConfirmAiDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading || !settings) return <SettingsSkeleton />;

  const privacy = settings.privacy;

  const savePrivacy = async (patch: Partial<PrivacySettings>) => {
    await updateSettings.mutateAsync({ privacy: { ...privacy, ...patch } });
    onSuccess("Privacy settings saved.");
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Privacy" description="Control your visibility and data sharing.">
        <SettingsRow label="Profile visibility">
          <PreferenceSelect
            value={privacy.profileVisibility}
            onChange={(profileVisibility) =>
              void savePrivacy({
                profileVisibility: profileVisibility as PrivacySettings["profileVisibility"],
              })
            }
            options={[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
              { value: "friends", label: "Friends" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Allow anonymous analytics">
          <ToggleSwitch
            checked={privacy.allowAnalytics}
            onChange={(allowAnalytics) => void savePrivacy({ allowAnalytics })}
          />
        </SettingsRow>

        <SettingsRow label="Share learning progress">
          <ToggleSwitch
            checked={privacy.shareLearningProgress}
            onChange={(shareLearningProgress) => void savePrivacy({ shareLearningProgress })}
          />
        </SettingsRow>

        <SettingsRow label="Show achievements publicly">
          <ToggleSwitch
            checked={privacy.showAchievementsPublicly}
            onChange={(showAchievementsPublicly) =>
              void savePrivacy({ showAchievementsPublicly })
            }
          />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard title="Data controls">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted opacity-60"
          >
            Download my data
          </button>
          <button
            type="button"
            onClick={() => setConfirmAiDelete(true)}
            className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted hover:bg-background hover:text-foreground"
          >
            Delete AI history
          </button>
          <button
            type="button"
            onClick={() => {
              if (user) {
                void clearUserSearchHistory(user.id);
                onSuccess("Search history cleared.");
              }
            }}
            className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted hover:bg-background hover:text-foreground"
          >
            Clear search history
          </button>
        </div>
      </SettingsCard>

      <ConfirmationModal
        open={confirmAiDelete}
        title="Delete AI history?"
        description="All conversations and messages will be permanently removed from your account."
        confirmLabel="Delete history"
        destructive
        loading={loading}
        onCancel={() => setConfirmAiDelete(false)}
        onConfirm={async () => {
          if (!user) return;
          setLoading(true);
          try {
            await deleteUserAiHistory(user.id);
            onSuccess("AI history deleted.");
            setConfirmAiDelete(false);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}

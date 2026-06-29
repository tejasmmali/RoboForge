"use client";

import { SettingsCard, SettingsRow } from "@/components/settings/SettingsCard";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";
import { SettingsSkeleton } from "@/components/settings/SettingsToast";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import type { NotificationPreferences } from "@/types/settings";

type NotificationSettingsProps = {
  onSuccess: (message: string) => void;
};

const toggles: {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}[] = [
  { key: "email", label: "Email notifications", description: "Receive updates via email." },
  { key: "aiUpdates", label: "AI updates", description: "When your AI assistant responds." },
  { key: "projectUpdates", label: "Project updates", description: "New guides and project changes." },
  { key: "learningReminders", label: "Learning reminders", description: "Nudge to continue projects." },
  { key: "achievements", label: "Achievement alerts", description: "When you unlock badges." },
  { key: "securityAlerts", label: "Security alerts", description: "Login and account activity." },
  { key: "weeklySummary", label: "Weekly summary", description: "Your learning recap each week." },
  { key: "dailyTips", label: "Daily tips", description: "Robotics tips and shortcuts." },
];

export function NotificationSettings({ onSuccess }: NotificationSettingsProps) {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  if (isLoading || !settings) return <SettingsSkeleton />;

  const updateToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    await updateSettings.mutateAsync({
      notificationPreferences: { ...settings.notificationPreferences, [key]: value },
    });
    onSuccess("Notification preferences saved.");
  };

  return (
    <SettingsCard
      title="Notifications"
      description="Choose what you want to be notified about."
    >
      {toggles.map((item) => (
        <SettingsRow key={item.key} label={item.label} description={item.description}>
          <ToggleSwitch
            checked={settings.notificationPreferences[item.key]}
            onChange={(checked) => void updateToggle(item.key, checked)}
            label={item.label}
          />
        </SettingsRow>
      ))}
    </SettingsCard>
  );
}

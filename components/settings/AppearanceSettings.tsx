"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  SettingsCard,
  SettingsRow,
} from "@/components/settings/SettingsCard";
import { PreferenceGrid, PreferenceSelect } from "@/components/settings/PreferenceSelect";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { SettingsSkeleton } from "@/components/settings/SettingsToast";
import type { AccentColor, FontSize, ThemePreference, UIDensity } from "@/types/settings";
import { cn } from "@/lib/utils";

const accentColors: { value: AccentColor; className: string }[] = [
  { value: "blue", className: "bg-blue-600" },
  { value: "purple", className: "bg-purple-600" },
  { value: "green", className: "bg-emerald-600" },
  { value: "orange", className: "bg-orange-500" },
  { value: "red", className: "bg-red-600" },
];

type AppearanceSettingsProps = {
  onSuccess: (message: string) => void;
};

export function AppearanceSettings({ onSuccess }: AppearanceSettingsProps) {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  if (isLoading || !settings) return <SettingsSkeleton />;

  const save = async (updates: Parameters<typeof updateSettings.mutateAsync>[0]) => {
    await updateSettings.mutateAsync(updates);
    onSuccess("Appearance saved.");
  };

  const densityPadding =
    settings.appearance.uiDensity === "compact"
      ? "p-2"
      : settings.appearance.uiDensity === "spacious"
        ? "p-5"
        : "p-3";

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Appearance"
        description="Customize how RoboForge looks and feels."
        footer={
          updateSettings.isPending ? (
            <span className="flex items-center gap-2 text-[12px] text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving…
            </span>
          ) : null
        }
      >
        <SettingsRow label="Theme" description="Choose light, dark, or match your system.">
          <PreferenceSelect<ThemePreference>
            value={settings.theme}
            onChange={(theme) => void save({ theme })}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Accent color" description="Blueprint accent for highlights.">
          <div className="flex gap-2">
            {accentColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() =>
                  void save({ appearance: { ...settings.appearance, accentColor: color.value } })
                }
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-transform hover:scale-105",
                  color.className,
                  settings.appearance.accentColor === color.value
                    ? "border-foreground ring-2 ring-foreground/20"
                    : "border-transparent",
                )}
                aria-label={color.value}
              />
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Font size">
          <PreferenceSelect<FontSize>
            value={settings.appearance.fontSize}
            onChange={(fontSize) =>
              void save({ appearance: { ...settings.appearance, fontSize } })
            }
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="UI density" description="Control spacing across the interface.">
          <PreferenceGrid<UIDensity>
            value={settings.appearance.uiDensity}
            onChange={(uiDensity) =>
              void save({ appearance: { ...settings.appearance, uiDensity } })
            }
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ]}
          />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard title="Live preview">
        <motion.div
          layout
          className={cn(
            "rounded-[12px] border border-border bg-background/70",
            densityPadding,
          )}
        >
          <div className="rounded-[10px] border border-border bg-surface p-3">
            <p
              className={cn(
                "font-heading font-medium",
                settings.appearance.fontSize === "small" && "text-[13px]",
                settings.appearance.fontSize === "medium" && "text-[15px]",
                settings.appearance.fontSize === "large" && "text-[17px]",
              )}
            >
              RoboForge Preview
            </p>
            <p className="mt-1 text-[12px] text-muted">
              Theme: {settings.theme} · Density: {settings.appearance.uiDensity}
            </p>
            <div
              className={cn(
                "mt-3 inline-flex rounded-full px-3 py-1 text-[11px] text-white",
                accentColors.find((c) => c.value === settings.appearance.accentColor)?.className,
              )}
            >
              Accent sample
            </div>
          </div>
        </motion.div>
      </SettingsCard>
    </div>
  );
}

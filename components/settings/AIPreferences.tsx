"use client";

import { SettingsCard, SettingsRow } from "@/components/settings/SettingsCard";
import { PreferenceSelect } from "@/components/settings/PreferenceSelect";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";
import { SettingsSkeleton } from "@/components/settings/SettingsToast";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import type { AIPreferenceSettings } from "@/types/settings";

type AIPreferencesProps = {
  onSuccess: (message: string) => void;
};

export function AIPreferences({ onSuccess }: AIPreferencesProps) {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  if (isLoading || !settings) return <SettingsSkeleton />;

  const ai = settings.aiPreferences;

  const saveAi = async (patch: Partial<AIPreferenceSettings>) => {
    await updateSettings.mutateAsync({
      aiPreferences: { ...ai, ...patch },
      aiResponseLength: patch.responseLength ?? ai.responseLength,
      preferredProgrammingLanguage: patch.codingStyle ?? ai.codingStyle,
    });
    onSuccess("AI preferences saved.");
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="AI Preferences" description="Configure your robotics mentor.">
        <SettingsRow label="Default AI model" description="Gemini model for responses.">
          <PreferenceSelect
            value={ai.defaultModel}
            onChange={(defaultModel) =>
              void saveAi({ defaultModel: defaultModel as AIPreferenceSettings["defaultModel"] })
            }
            options={[
              { value: "gemini-flash", label: "Gemini Flash" },
              { value: "gemini-pro", label: "Gemini Pro" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Response length">
          <PreferenceSelect
            value={ai.responseLength}
            onChange={(responseLength) =>
              void saveAi({
                responseLength: responseLength as AIPreferenceSettings["responseLength"],
              })
            }
            options={[
              { value: "concise", label: "Short" },
              { value: "balanced", label: "Balanced" },
              { value: "detailed", label: "Detailed" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Coding style">
          <PreferenceSelect
            value={ai.codingStyle}
            onChange={(codingStyle) =>
              void saveAi({ codingStyle: codingStyle as AIPreferenceSettings["codingStyle"] })
            }
            options={[
              { value: "arduino", label: "Arduino" },
              { value: "esp32", label: "ESP32" },
              { value: "python", label: "Python" },
              { value: "cpp", label: "C++" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Preferred language">
          <PreferenceSelect
            value={ai.preferredLanguage}
            onChange={(preferredLanguage) =>
              void saveAi({
                preferredLanguage: preferredLanguage as AIPreferenceSettings["preferredLanguage"],
              })
            }
            options={[
              { value: "en", label: "English" },
              { value: "hi", label: "Hindi" },
              { value: "gu", label: "Gujarati" },
            ]}
          />
        </SettingsRow>

        <SettingsRow label="Conversation memory" description="Remember context across chats.">
          <ToggleSwitch
            checked={ai.conversationMemory}
            onChange={(conversationMemory) => void saveAi({ conversationMemory })}
          />
        </SettingsRow>

        <SettingsRow label="Auto-save chats">
          <ToggleSwitch
            checked={ai.autoSaveChats}
            onChange={(autoSaveChats) => void saveAi({ autoSaveChats })}
          />
        </SettingsRow>

        <SettingsRow label="Show code explanations">
          <ToggleSwitch
            checked={ai.showCodeExplanations}
            onChange={(showCodeExplanations) => void saveAi({ showCodeExplanations })}
          />
        </SettingsRow>
      </SettingsCard>
    </div>
  );
}

export type ThemePreference = "light" | "dark" | "system";

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  projectUpdates: boolean;
  aiResponses: boolean;
  achievements: boolean;
  weeklyReminder: boolean;
};

export type AccessibilitySettings = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
};

export type UserSettings = {
  userId: string;
  theme: ThemePreference;
  language: string;
  notificationPreferences: NotificationPreferences;
  aiResponseLength: "concise" | "balanced" | "detailed";
  preferredProgrammingLanguage: string;
  accessibility: AccessibilitySettings;
  updatedAt: string;
};

export type UserSettingsUpdate = Partial<
  Omit<UserSettings, "userId" | "updatedAt">
>;

export const DEFAULT_USER_SETTINGS: Omit<UserSettings, "userId" | "updatedAt"> = {
  theme: "light",
  language: "en",
  notificationPreferences: {
    email: true,
    push: false,
    projectUpdates: true,
    aiResponses: true,
    achievements: true,
    weeklyReminder: true,
  },
  aiResponseLength: "balanced",
  preferredProgrammingLanguage: "arduino",
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  },
};

export type ThemePreference = "light" | "dark" | "system";

export type AccentColor = "blue" | "purple" | "green" | "orange" | "red";

export type FontSize = "small" | "medium" | "large";

export type UIDensity = "compact" | "comfortable" | "spacious";

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  projectUpdates: boolean;
  aiResponses: boolean;
  achievements: boolean;
  weeklyReminder: boolean;
  /** Extended notification toggles */
  aiUpdates: boolean;
  learningReminders: boolean;
  securityAlerts: boolean;
  weeklySummary: boolean;
  dailyTips: boolean;
};

export type AccessibilitySettings = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
};

export type AppearanceSettings = {
  accentColor: AccentColor;
  fontSize: FontSize;
  uiDensity: UIDensity;
};

export type AIPreferenceSettings = {
  defaultModel: "gemini-flash" | "gemini-pro";
  responseLength: "concise" | "balanced" | "detailed";
  codingStyle: "arduino" | "esp32" | "python" | "cpp";
  preferredLanguage: "en" | "hi" | "gu";
  conversationMemory: boolean;
  autoSaveChats: boolean;
  showCodeExplanations: boolean;
};

export type PrivacySettings = {
  profileVisibility: "public" | "private" | "friends";
  allowAnalytics: boolean;
  shareLearningProgress: boolean;
  showAchievementsPublicly: boolean;
};

export type UserSettings = {
  userId: string;
  theme: ThemePreference;
  language: string;
  notificationPreferences: NotificationPreferences;
  aiResponseLength: "concise" | "balanced" | "detailed";
  preferredProgrammingLanguage: string;
  accessibility: AccessibilitySettings;
  appearance: AppearanceSettings;
  aiPreferences: AIPreferenceSettings;
  privacy: PrivacySettings;
  updatedAt: string;
};

export type UserSettingsUpdate = Partial<
  Omit<UserSettings, "userId" | "updatedAt">
>;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: false,
  projectUpdates: true,
  aiResponses: true,
  achievements: true,
  weeklyReminder: true,
  aiUpdates: true,
  learningReminders: true,
  securityAlerts: true,
  weeklySummary: false,
  dailyTips: true,
};

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  accentColor: "blue",
  fontSize: "medium",
  uiDensity: "comfortable",
};

export const DEFAULT_AI_PREFERENCES: AIPreferenceSettings = {
  defaultModel: "gemini-flash",
  responseLength: "balanced",
  codingStyle: "arduino",
  preferredLanguage: "en",
  conversationMemory: true,
  autoSaveChats: true,
  showCodeExplanations: true,
};

export const DEFAULT_PRIVACY: PrivacySettings = {
  profileVisibility: "public",
  allowAnalytics: true,
  shareLearningProgress: false,
  showAchievementsPublicly: true,
};

export const DEFAULT_USER_SETTINGS: Omit<UserSettings, "userId" | "updatedAt"> = {
  theme: "light",
  language: "en",
  notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
  aiResponseLength: "balanced",
  preferredProgrammingLanguage: "arduino",
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  },
  appearance: DEFAULT_APPEARANCE,
  aiPreferences: DEFAULT_AI_PREFERENCES,
  privacy: DEFAULT_PRIVACY,
};

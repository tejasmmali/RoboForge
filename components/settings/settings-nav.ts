import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Database,
  Eye,
  Link2,
  Palette,
  Shield,
  User,
  UserCircle,
  Bell,
  AlertTriangle,
} from "lucide-react";

export type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "notifications"
  | "ai"
  | "privacy"
  | "security"
  | "connected"
  | "data"
  | "danger";

export type SettingsNavItem = {
  id: SettingsSection;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const settingsNavItems: SettingsNavItem[] = [
  { id: "profile", label: "Profile", description: "Your public profile", icon: UserCircle },
  { id: "account", label: "Account", description: "Email and membership", icon: User },
  { id: "appearance", label: "Appearance", description: "Theme and display", icon: Palette },
  { id: "notifications", label: "Notifications", description: "Email and alerts", icon: Bell },
  { id: "ai", label: "AI Preferences", description: "Assistant behavior", icon: Bot },
  { id: "privacy", label: "Privacy", description: "Visibility and data", icon: Eye },
  { id: "security", label: "Security", description: "Password and sessions", icon: Shield },
  { id: "connected", label: "Connected Accounts", description: "OAuth providers", icon: Link2 },
  { id: "data", label: "Data & Export", description: "Download your data", icon: Database },
  { id: "danger", label: "Danger Zone", description: "Irreversible actions", icon: AlertTriangle },
];

export function getSettingsNavItem(id: SettingsSection) {
  return settingsNavItems.find((item) => item.id === id) ?? settingsNavItems[0];
}

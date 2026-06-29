import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/settings/SettingsPageContent";

export const metadata: Metadata = {
  title: "Settings — RoboForge",
  description:
    "Manage your RoboForge profile, appearance, AI preferences, privacy, security, and account settings.",
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}

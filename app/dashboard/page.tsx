import type { Metadata } from "next";
import { DashboardPageContent } from "@/components/dashboard/DashboardPageContent";

export const metadata: Metadata = {
  title: "Dashboard — RoboForge",
  description:
    "Your personal robotics learning workspace. Track projects, components, AI conversations, and achievements.",
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}

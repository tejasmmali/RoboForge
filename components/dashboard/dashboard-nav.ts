import type { LucideIcon } from "lucide-react";
import {
  Award,
  Bot,
  Bookmark,
  Download,
  LayoutDashboard,
  Play,
  TrendingUp,
  Zap,
} from "lucide-react";

export type DashboardSection =
  | "overview"
  | "continue"
  | "progress"
  | "saved-projects"
  | "components"
  | "ai-history"
  | "achievements"
  | "downloads"
  | "actions";

export type DashboardNavItem = {
  id: DashboardSection;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Your workspace at a glance",
  },
  {
    id: "continue",
    label: "Continue Building",
    icon: Play,
    description: "Resume active projects",
  },
  {
    id: "progress",
    label: "Learning Progress",
    icon: TrendingUp,
    description: "Your robotics roadmap",
  },
  {
    id: "saved-projects",
    label: "Saved Projects",
    icon: Bookmark,
    description: "Bookmarked builds",
  },
  {
    id: "components",
    label: "Components",
    icon: Zap,
    description: "Favorite parts",
  },
  {
    id: "ai-history",
    label: "AI History",
    icon: Bot,
    description: "Past conversations",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Award,
    description: "Badges earned",
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: Download,
    description: "Saved resources",
  },
  {
    id: "actions",
    label: "Quick Actions",
    icon: Zap,
    description: "Shortcuts",
  },
];

export function getDashboardNavItem(id: DashboardSection) {
  return dashboardNavItems.find((item) => item.id === id)!;
}

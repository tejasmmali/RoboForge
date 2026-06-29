import type { DashboardData } from "@/types/dashboard";

const EMPTY_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  projects: 0,
  hours: 0,
  aiUsage: 0,
}));

/** Authenticated users with no activity start from this baseline. */
export const emptyDashboardData: DashboardData = {
  stats: [
    { id: "started", label: "Projects Started", value: 0, trend: 0, trendLabel: "all time", icon: "folder" },
    { id: "completed", label: "Projects Completed", value: 0, trend: 0, trendLabel: "all time", icon: "check" },
    { id: "components", label: "Saved Components", value: 0, trend: 0, trendLabel: "all time", icon: "bookmark" },
    { id: "ai", label: "AI Conversations", value: 0, trend: 0, trendLabel: "all time", icon: "bot" },
    { id: "hours", label: "Hours Learned", value: 0, trend: 0, trendLabel: "all time", icon: "clock" },
    { id: "certificates", label: "Certificates Earned", value: 0, trend: 0, trendLabel: "coming soon", icon: "award" },
  ],
  continueProjects: [],
  roadmap: [
    { label: "Beginner", progress: 0, complete: false, current: true },
    { label: "Intermediate", progress: 0, complete: false },
    { label: "Advanced", progress: 0, complete: false },
    { label: "AI Robotics", progress: 0, complete: false },
    { label: "Industrial Robotics", progress: 0, complete: false },
  ],
  savedProjects: [],
  savedComponents: [],
  chatHistory: [],
  activity: [],
  achievements: [],
  downloads: [],
  notifications: [],
  weeklyProgress: EMPTY_WEEK,
  learningStreak: 0,
  hoursLearned: 0,
};

export function getEmptyDashboardData(): DashboardData {
  return emptyDashboardData;
}

import type { DashboardData } from "@/types/dashboard";

export const demoDashboardData: DashboardData = {
  stats: [
    { id: "started", label: "Projects Started", value: 5, trend: 2, trendLabel: "this month", icon: "folder" },
    { id: "completed", label: "Projects Completed", value: 1, trend: 1, trendLabel: "this month", icon: "check" },
    { id: "components", label: "Saved Components", value: 12, trend: 4, trendLabel: "this month", icon: "bookmark" },
    { id: "ai", label: "AI Conversations", value: 7, trend: 3, trendLabel: "this week", icon: "bot" },
    { id: "hours", label: "Hours Learned", value: 24, trend: 6, trendLabel: "this month", icon: "clock" },
    { id: "certificates", label: "Certificates Earned", value: 0, trend: 0, trendLabel: "coming soon", icon: "award" },
  ],
  continueProjects: [
    {
      slug: "obstacle-avoiding-robot",
      title: "Obstacle Avoiding Robot",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=85&auto=format&fit=crop",
      progress: 72,
      lastOpened: "2024-06-26T10:30:00Z",
      estimatedRemaining: "2 hrs",
    },
    {
      slug: "line-follower-robot",
      title: "Line Follower Robot",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=85&auto=format&fit=crop",
      progress: 45,
      lastOpened: "2024-06-24T15:00:00Z",
      estimatedRemaining: "3 hrs",
    },
    {
      slug: "bluetooth-car",
      title: "Bluetooth Car",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&auto=format&fit=crop",
      progress: 18,
      lastOpened: "2024-06-22T09:15:00Z",
      estimatedRemaining: "5 hrs",
    },
  ],
  roadmap: [
    { label: "Beginner", progress: 100, complete: true },
    { label: "Intermediate", progress: 65, complete: false, current: true },
    { label: "Advanced", progress: 30, complete: false },
    { label: "AI Robotics", progress: 10, complete: false },
    { label: "Industrial Robotics", progress: 0, complete: false },
  ],
  savedProjects: [
    {
      id: "sp-1",
      user_id: "",
      project_slug: "obstacle-avoiding-robot",
      title: "Obstacle Avoiding Robot",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=85&auto=format&fit=crop",
      saved_at: "2024-06-20T12:00:00Z",
    },
    {
      id: "sp-2",
      user_id: "",
      project_slug: "line-follower-robot",
      title: "Line Follower Robot",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=85&auto=format&fit=crop",
      saved_at: "2024-06-18T09:00:00Z",
    },
    {
      id: "sp-3",
      user_id: "",
      project_slug: "bluetooth-car",
      title: "Bluetooth Car",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=85&auto=format&fit=crop",
      saved_at: "2024-06-15T14:30:00Z",
    },
    {
      id: "sp-4",
      user_id: "",
      project_slug: "robotic-arm",
      title: "Robotic Arm",
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=85&auto=format&fit=crop",
      saved_at: "2024-06-10T11:00:00Z",
    },
  ],
  savedComponents: [
    {
      id: "sc-1",
      user_id: "",
      component_slug: "arduino-uno",
      name: "Arduino UNO R3",
      category: "Development Boards",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=85&auto=format&fit=crop",
      specifications: "5V · 14 digital pins · ATmega328P",
      buy_url: "#",
      saved_at: "2024-06-25T08:00:00Z",
    },
    {
      id: "sc-2",
      user_id: "",
      component_slug: "hc-sr04",
      name: "HC-SR04 Ultrasonic",
      category: "Sensors",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=85&auto=format&fit=crop",
      specifications: "2–400 cm · 5V · 15 mA",
      buy_url: "#",
      saved_at: "2024-06-23T16:00:00Z",
    },
    {
      id: "sc-3",
      user_id: "",
      component_slug: "l298n",
      name: "L298N Motor Driver",
      category: "Drivers",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=85&auto=format&fit=crop",
      specifications: "Dual H-bridge · 5–35V · 2A",
      buy_url: "#",
      saved_at: "2024-06-21T10:00:00Z",
    },
  ],
  chatHistory: [
    { id: "ch-1", user_id: "", title: "HC-SR04 Problem", preview: "My HC-SR04 always returns 0 cm...", updated_at: "2024-06-20T14:30:00Z" },
    { id: "ch-2", user_id: "", title: "Motor Not Working", preview: "My DC motor doesn't spin when connected to L298N...", updated_at: "2024-06-18T16:45:00Z" },
    { id: "ch-3", user_id: "", title: "ESP32 WiFi Setup", preview: "How to connect ESP32 to home WiFi network?", updated_at: "2024-06-17T09:20:00Z" },
    { id: "ch-4", user_id: "", title: "Bluetooth Robot", preview: "Help me build an Android-controlled car...", updated_at: "2024-06-16T11:00:00Z" },
  ],
  activity: [
    { id: "a-1", user_id: "", action: "Completed Step 5", detail: "Obstacle Avoiding Robot — Wiring the motors", created_at: "2024-06-26T10:30:00Z" },
    { id: "a-2", user_id: "", action: "Saved Component", detail: "Arduino UNO R3", created_at: "2024-06-25T08:00:00Z" },
    { id: "a-3", user_id: "", action: "Started Project", detail: "Bluetooth Robot", created_at: "2024-06-22T09:15:00Z" },
    { id: "a-4", user_id: "", action: "Asked AI", detail: "About HC-SR04 sensor wiring", created_at: "2024-06-20T14:30:00Z" },
    { id: "a-5", user_id: "", action: "Downloaded", detail: "Circuit Diagram — Line Follower", created_at: "2024-06-19T11:00:00Z" },
  ],
  achievements: [
    { id: "ach-1", slug: "first-project", title: "First Project", description: "Start your first robotics project", unlocked: true, progress: 100, icon: "rocket" },
    { id: "ach-2", slug: "arduino-beginner", title: "Arduino Beginner", description: "Complete an Arduino-based project", unlocked: true, progress: 100, icon: "cpu" },
    { id: "ach-3", slug: "sensor-explorer", title: "Sensor Explorer", description: "Use 3 different sensor types", unlocked: false, progress: 66, icon: "radar" },
    { id: "ach-4", slug: "ai-learner", title: "AI Learner", description: "Have 5 AI conversations", unlocked: true, progress: 100, icon: "bot" },
    { id: "ach-5", slug: "project-master", title: "Project Master", description: "Complete 5 projects", unlocked: false, progress: 20, icon: "trophy" },
  ],
  downloads: [
    { id: "d-1", title: "Obstacle Robot Guide", type: "pdf", project_slug: "obstacle-avoiding-robot", downloaded_at: "2024-06-26T10:00:00Z" },
    { id: "d-2", title: "Line Follower Circuit", type: "circuit", project_slug: "line-follower-robot", downloaded_at: "2024-06-19T11:00:00Z" },
    { id: "d-3", title: "HC-SR04 Arduino Sketch", type: "code", downloaded_at: "2024-06-18T14:00:00Z" },
    { id: "d-4", title: "L298N Datasheet", type: "datasheet", downloaded_at: "2024-06-15T09:00:00Z" },
    { id: "d-5", title: "Servo Library v1.2", type: "library", downloaded_at: "2024-06-12T16:00:00Z" },
  ],
  notifications: [
    { id: "n-1", user_id: "", title: "New Project Added", message: "Self-Balancing Robot is now available", type: "project", read: false, created_at: "2024-06-26T08:00:00Z" },
    { id: "n-2", user_id: "", title: "ESP32 Guide Updated", message: "WiFi setup section has been expanded", type: "guide", read: false, created_at: "2024-06-25T12:00:00Z" },
    { id: "n-3", user_id: "", title: "AI Feature Released", message: "Gemini integration is now live", type: "feature", read: true, created_at: "2024-06-24T10:00:00Z" },
    { id: "n-4", user_id: "", title: "Project Reminder", message: "Continue Obstacle Avoiding Robot — 72% done", type: "reminder", read: false, created_at: "2024-06-23T09:00:00Z" },
  ],
  weeklyProgress: [
    { day: "Mon", projects: 0, hours: 1.5, aiUsage: 1 },
    { day: "Tue", projects: 1, hours: 2, aiUsage: 0 },
    { day: "Wed", projects: 0, hours: 0.5, aiUsage: 2 },
    { day: "Thu", projects: 0, hours: 3, aiUsage: 1 },
    { day: "Fri", projects: 1, hours: 2.5, aiUsage: 0 },
    { day: "Sat", projects: 0, hours: 4, aiUsage: 3 },
    { day: "Sun", projects: 0, hours: 1, aiUsage: 1 },
  ],
  learningStreak: 5,
  hoursLearned: 24,
};

/** Set to true to preview empty states in the dashboard */
export const SHOW_EMPTY_DASHBOARD = false;

export function getDashboardData(): DashboardData {
  if (SHOW_EMPTY_DASHBOARD) {
    return {
      ...demoDashboardData,
      continueProjects: [],
      savedProjects: [],
      savedComponents: [],
      chatHistory: [],
      activity: [],
      downloads: [],
    };
  }
  return demoDashboardData;
}

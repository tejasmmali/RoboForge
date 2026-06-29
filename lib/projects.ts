import { getProjectImage } from "@/lib/images";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type ProjectTechnology =
  | "arduino"
  | "esp32"
  | "raspberry-pi"
  | "sensor"
  | "motor"
  | "servo";

export type FilterChip =
  | "all"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "ai-cv"
  | "iot"
  | "arduino"
  | "esp32"
  | "raspberry-pi";

export type SortOption =
  | "newest"
  | "popular"
  | "difficulty"
  | "cost"
  | "time";

export type Project = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  time: string;
  cost: string;
  costValue: number;
  timeHours: number;
  componentCount: number;
  technologies: ProjectTechnology[];
  complexity: number;
  tags: FilterChip[];
  isNew?: boolean;
  isPopular?: boolean;
  addedAt: string;
  popularity: number;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "line-follower-robot",
    title: "Line Follower Robot",
    description:
      "Build an IR-sensor robot that follows black tape paths using PID motor control and sensor calibration techniques.",
    difficulty: "Beginner",
    category: "Autonomous",
    time: "4–6 hrs",
    cost: "₹800–1,200",
    costValue: 1000,
    timeHours: 5,
    componentCount: 8,
    technologies: ["arduino", "sensor", "motor"],
    complexity: 25,
    tags: ["all", "beginner", "arduino"],
    isPopular: true,
    addedAt: "2025-11-12",
    popularity: 98,
    image: getProjectImage("line-follower-robot"),
  },
  {
    slug: "obstacle-avoiding-robot",
    title: "Obstacle Avoiding Robot",
    description:
      "Navigate autonomously with HC-SR04 ultrasonic sensing, L298N motor driver, and obstacle avoidance algorithms.",
    difficulty: "Beginner",
    category: "Navigation",
    time: "6–8 hrs",
    cost: "₹1,200–1,500",
    costValue: 1350,
    timeHours: 7,
    componentCount: 10,
    technologies: ["arduino", "sensor", "motor"],
    complexity: 35,
    tags: ["all", "beginner", "arduino"],
    isPopular: true,
    addedAt: "2025-10-28",
    popularity: 95,
    image: getProjectImage("obstacle-avoiding-robot"),
  },
  {
    slug: "bluetooth-car",
    title: "Bluetooth RC Car",
    description:
      "Control a 4-wheel chassis from your phone via HC-05 Bluetooth module with PWM motor speed control.",
    difficulty: "Intermediate",
    category: "Remote Control",
    time: "8–10 hrs",
    cost: "₹1,500–2,000",
    costValue: 1750,
    timeHours: 9,
    componentCount: 12,
    technologies: ["arduino", "motor", "servo"],
    complexity: 45,
    tags: ["all", "intermediate", "arduino"],
    addedAt: "2025-09-15",
    popularity: 88,
    image: getProjectImage("bluetooth-car"),
  },
  {
    slug: "robotic-arm",
    title: "Robotic Arm with ESP32",
    description:
      "Assemble a 4-DOF servo arm with ESP32 control, potentiometer input, and serial command interface for precise positioning.",
    difficulty: "Advanced",
    category: "Manipulation",
    time: "12–15 hrs",
    cost: "₹2,500–3,500",
    costValue: 3000,
    timeHours: 14,
    componentCount: 14,
    technologies: ["esp32", "servo", "sensor"],
    complexity: 72,
    tags: ["all", "advanced", "esp32"],
    isPopular: true,
    isNew: true,
    addedAt: "2026-01-08",
    popularity: 92,
    image: getProjectImage("robotic-arm"),
  },
  {
    slug: "smart-dustbin",
    title: "Smart Dustbin",
    description:
      "Automatic lid opener using ultrasonic proximity detection and servo actuation — a practical automation build.",
    difficulty: "Intermediate",
    category: "Automation",
    time: "6–8 hrs",
    cost: "₹1,000–1,400",
    costValue: 1200,
    timeHours: 7,
    componentCount: 9,
    technologies: ["arduino", "sensor", "servo"],
    complexity: 40,
    tags: ["all", "intermediate", "arduino", "iot"],
    addedAt: "2025-08-20",
    popularity: 76,
    image: getProjectImage("smart-dustbin"),
  },
  {
    slug: "iot-weather-station",
    title: "IoT Weather Station",
    description:
      "Log temperature and humidity with DHT22 on ESP32, publish to MQTT, and visualize readings on a live dashboard.",
    difficulty: "Intermediate",
    category: "IoT",
    time: "10–12 hrs",
    cost: "₹1,800–2,200",
    costValue: 2000,
    timeHours: 11,
    componentCount: 11,
    technologies: ["esp32", "sensor"],
    complexity: 55,
    tags: ["all", "intermediate", "esp32", "iot"],
    isPopular: true,
    addedAt: "2025-07-05",
    popularity: 90,
    image: getProjectImage("iot-weather-station"),
  },
  {
    slug: "smart-agriculture",
    title: "Smart Agriculture",
    description:
      "Monitor soil moisture and automate irrigation with capacitive sensors, relay modules, and ESP32 cloud logging.",
    difficulty: "Intermediate",
    category: "IoT",
    time: "10–14 hrs",
    cost: "₹2,000–2,800",
    costValue: 2400,
    timeHours: 12,
    componentCount: 13,
    technologies: ["esp32", "sensor", "motor"],
    complexity: 58,
    tags: ["all", "intermediate", "esp32", "iot"],
    isNew: true,
    addedAt: "2026-02-01",
    popularity: 74,
    image: getProjectImage("smart-agriculture"),
  },
  {
    slug: "gesture-controlled-robot",
    title: "Gesture Controlled Robot",
    description:
      "Control a robot arm using MPU6050 gesture recognition and machine learning inference on ESP32-CAM module.",
    difficulty: "Advanced",
    category: "AI Robotics",
    time: "14–18 hrs",
    cost: "₹3,000–4,500",
    costValue: 3750,
    timeHours: 16,
    componentCount: 15,
    technologies: ["esp32", "sensor", "servo", "motor"],
    complexity: 78,
    tags: ["all", "advanced", "esp32", "ai-cv"],
    isNew: true,
    addedAt: "2026-01-20",
    popularity: 85,
    image: getProjectImage("gesture-controlled-robot"),
  },
  {
    slug: "maze-solving-robot",
    title: "Maze Solving Robot",
    description:
      "Implement wall-following and flood-fill algorithms on an Arduino platform with IR and ultrasonic sensor fusion.",
    difficulty: "Intermediate",
    category: "Algorithms",
    time: "8–12 hrs",
    cost: "₹1,400–1,800",
    costValue: 1600,
    timeHours: 10,
    componentCount: 11,
    technologies: ["arduino", "sensor", "motor"],
    complexity: 50,
    tags: ["all", "intermediate", "arduino"],
    addedAt: "2025-06-10",
    popularity: 82,
    image: getProjectImage("maze-solving-robot"),
  },
  {
    slug: "voice-controlled-home",
    title: "Voice Controlled Home Automation",
    description:
      "Control relays and appliances with voice commands using ESP32, Google Assistant integration, and Blynk app.",
    difficulty: "Intermediate",
    category: "Home Automation",
    time: "8–10 hrs",
    cost: "₹1,600–2,200",
    costValue: 1900,
    timeHours: 9,
    componentCount: 10,
    technologies: ["esp32", "sensor"],
    complexity: 48,
    tags: ["all", "intermediate", "esp32", "iot"],
    addedAt: "2025-05-22",
    popularity: 79,
    image: getProjectImage("voice-controlled-home"),
  },
  {
    slug: "wifi-robot-esp32",
    title: "WiFi Controlled Robot (ESP32)",
    description:
      "Drive a robot over WiFi using ESP32 web server and smartphone browser — no app install required.",
    difficulty: "Intermediate",
    category: "IoT",
    time: "10–12 hrs",
    cost: "₹1,800–2,400",
    costValue: 2100,
    timeHours: 11,
    componentCount: 11,
    technologies: ["esp32", "motor", "sensor"],
    complexity: 52,
    tags: ["all", "intermediate", "esp32", "iot"],
    isNew: true,
    addedAt: "2026-03-01",
    popularity: 86,
    image: getProjectImage("wifi-robot-esp32"),
  },
  {
    slug: "rfid-door-lock",
    title: "RFID Door Lock System",
    description:
      "Secure access control with MFRC522 RFID reader, servo latch, and Arduino — tap card to unlock.",
    difficulty: "Intermediate",
    category: "Automation",
    time: "8–10 hrs",
    cost: "₹1,400–1,900",
    costValue: 1650,
    timeHours: 9,
    componentCount: 10,
    technologies: ["arduino", "sensor", "servo"],
    complexity: 46,
    tags: ["all", "intermediate", "arduino", "iot"],
    addedAt: "2026-02-15",
    popularity: 83,
    image: getProjectImage("rfid-door-lock"),
  },
  {
    slug: "fire-fighting-robot",
    title: "Fire Fighting Robot",
    description:
      "Autonomous robot with flame sensor detection, water pump actuation, and obstacle navigation toward fire source.",
    difficulty: "Advanced",
    category: "Autonomous",
    time: "14–18 hrs",
    cost: "₹2,800–3,800",
    costValue: 3300,
    timeHours: 16,
    componentCount: 14,
    technologies: ["arduino", "sensor", "motor"],
    complexity: 75,
    tags: ["all", "advanced", "arduino"],
    isNew: true,
    addedAt: "2026-02-20",
    popularity: 87,
    image: getProjectImage("fire-fighting-robot"),
  },
  {
    slug: "smart-parking-system",
    title: "Smart Parking System",
    description:
      "Ultrasonic slot detection with ESP32, LED indicators, and optional cloud dashboard for occupancy monitoring.",
    difficulty: "Intermediate",
    category: "IoT",
    time: "10–14 hrs",
    cost: "₹2,200–2,900",
    costValue: 2550,
    timeHours: 12,
    componentCount: 12,
    technologies: ["esp32", "sensor"],
    complexity: 56,
    tags: ["all", "intermediate", "esp32", "iot"],
    addedAt: "2026-01-25",
    popularity: 78,
    image: getProjectImage("smart-parking-system"),
  },
  {
    slug: "solar-tracking-system",
    title: "Solar Tracking System",
    description:
      "Dual LDR light sensors drive a servo to orient a solar panel toward maximum sunlight throughout the day.",
    difficulty: "Intermediate",
    category: "Automation",
    time: "8–10 hrs",
    cost: "₹1,600–2,200",
    costValue: 1900,
    timeHours: 9,
    componentCount: 9,
    technologies: ["arduino", "sensor", "servo"],
    complexity: 44,
    tags: ["all", "intermediate", "arduino", "iot"],
    addedAt: "2026-01-12",
    popularity: 80,
    image: getProjectImage("solar-tracking-system"),
  },
  {
    slug: "self-balancing-robot",
    title: "Self Balancing Robot",
    description:
      "Two-wheeled inverted pendulum robot using MPU6050 IMU, PID control loop, and stepper motor precision drive.",
    difficulty: "Expert",
    category: "Control Systems",
    time: "16–20 hrs",
    cost: "₹3,500–5,000",
    costValue: 4250,
    timeHours: 18,
    componentCount: 16,
    technologies: ["esp32", "sensor", "motor"],
    complexity: 88,
    tags: ["all", "advanced", "esp32"],
    isPopular: true,
    addedAt: "2025-03-01",
    popularity: 94,
    image: getProjectImage("self-balancing-robot"),
  },
];

export const filterChips: { id: FilterChip; label: string }[] = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "ai-cv", label: "AI & Computer Vision" },
  { id: "iot", label: "IoT" },
  { id: "arduino", label: "Arduino" },
  { id: "esp32", label: "ESP32" },
  { id: "raspberry-pi", label: "Raspberry Pi" },
];

export const sortOptions: { id: SortOption; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popular" },
  { id: "difficulty", label: "Difficulty" },
  { id: "cost", label: "Estimated Cost" },
  { id: "time", label: "Estimated Time" },
];

export const projectCategories = [
  { id: "arduino", label: "Arduino", icon: "cpu" as const, count: 0 },
  { id: "esp32", label: "ESP32", icon: "radio" as const, count: 0 },
  { id: "iot", label: "IoT", icon: "wifi" as const, count: 0 },
  { id: "ai", label: "AI Robotics", icon: "brain" as const, count: 0 },
  { id: "automation", label: "Automation", icon: "zap" as const, count: 0 },
  { id: "sensors", label: "Sensors", icon: "gauge" as const, count: 0 },
];

export const featuredProjectSlug = "robotic-arm";

export const difficultyOrder: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

export function getCategoryCounts() {
  return [
    { id: "arduino", label: "Arduino", icon: "cpu" as const, count: projects.filter((p) => p.tags.includes("arduino")).length },
    { id: "esp32", label: "ESP32", icon: "radio" as const, count: projects.filter((p) => p.tags.includes("esp32")).length },
    { id: "iot", label: "IoT", icon: "wifi" as const, count: projects.filter((p) => p.tags.includes("iot")).length },
    { id: "ai", label: "AI Robotics", icon: "brain" as const, count: projects.filter((p) => p.tags.includes("ai-cv")).length },
    { id: "automation", label: "Automation", icon: "zap" as const, count: projects.filter((p) => p.category === "Automation" || p.category === "Home Automation").length },
    { id: "sensors", label: "Sensors", icon: "gauge" as const, count: projects.filter((p) => p.technologies.includes("sensor")).length },
  ];
}

export function filterProjects(
  items: Project[],
  query: string,
  chip: FilterChip,
  sort: SortOption,
): Project[] {
  let result = [...items];

  if (chip !== "all") {
    result = result.filter((p) => p.tags.includes(chip));
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.difficulty.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.includes(q)) ||
        p.tags.some((t) => t.includes(q)),
    );
  }

  switch (sort) {
    case "newest":
      result.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      break;
    case "popular":
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case "difficulty":
      result.sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
      );
      break;
    case "cost":
      result.sort((a, b) => a.costValue - b.costValue);
      break;
    case "time":
      result.sort((a, b) => a.timeHours - b.timeHours);
      break;
  }

  return result;
}

export function getRecentlyAdded(items: Project[], limit = 6): Project[] {
  return [...items]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

/** Legacy type for homepage compatibility */
export type ProjectCardData = Pick<
  Project,
  "slug" | "title" | "description" | "difficulty" | "time" | "cost"
>;

export function toCardData(project: Project): ProjectCardData {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description,
    difficulty: project.difficulty as ProjectCardData["difficulty"],
    time: project.time,
    cost: project.cost.replace("₹", ""),
  };
}

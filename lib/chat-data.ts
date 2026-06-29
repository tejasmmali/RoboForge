import type {
  AIFeature,
  Capability,
  PinnedResource,
  QuickCategory,
  SuggestedPrompt,
} from "@/types/chat";

export const suggestedPrompts: SuggestedPrompt[] = [
  { id: "pwm", label: "Explain PWM", prompt: "Explain how PWM works for motor speed control on Arduino.", category: "arduino" },
  { id: "debug", label: "Debug Arduino Code", prompt: "Help me debug my Arduino sketch that compiles but doesn't run correctly.", category: "programming" },
  { id: "components", label: "Recommend Components", prompt: "Recommend components for building a line follower robot on a budget.", category: "sensors" },
  { id: "hcsr04", label: "Explain HC-SR04", prompt: "Explain how the HC-SR04 ultrasonic sensor works and how to wire it.", category: "sensors" },
  { id: "sketch", label: "Generate Arduino Sketch", prompt: "Generate an Arduino sketch to read a DHT11 sensor and print values to Serial.", category: "arduino" },
  { id: "motor", label: "Motor Wiring Help", prompt: "How do I wire an L298N motor driver to Arduino UNO and two DC motors?", category: "motors" },
  { id: "wifi", label: "ESP32 WiFi", prompt: "How do I connect ESP32 to WiFi and send sensor data?", category: "esp32" },
  { id: "pid", label: "PID Controller", prompt: "Explain PID control for a line follower robot in simple terms.", category: "programming" },
];

export const examplePrompts: SuggestedPrompt[] = [
  { id: "ex1", label: "How do I connect an L298N?", prompt: "How do I connect an L298N motor driver to Arduino UNO?" },
  { id: "ex2", label: "Generate code for HC-SR04", prompt: "Generate Arduino code to measure distance with HC-SR04." },
  { id: "ex3", label: "Arduino vs ESP32?", prompt: "What is the difference between Arduino UNO and ESP32?" },
  { id: "ex4", label: "Servo jittering?", prompt: "Why is my servo motor jittering and how do I fix it?" },
  { id: "ex5", label: "Line follower components", prompt: "Suggest components for a line follower robot under ₹2000." },
  { id: "ex6", label: "Explain interrupts", prompt: "Explain Arduino interrupts with a practical example." },
  { id: "ex7", label: "IoT weather station", prompt: "Help me plan an IoT weather station with ESP32 and DHT22." },
  { id: "ex8", label: "Recommend a battery", prompt: "Recommend a battery setup for a 2WD Arduino robot." },
];

export const quickCategories: { id: QuickCategory; label: string }[] = [
  { id: "arduino", label: "Arduino" },
  { id: "esp32", label: "ESP32" },
  { id: "sensors", label: "Sensors" },
  { id: "motors", label: "Motors" },
  { id: "programming", label: "Programming" },
  { id: "electronics", label: "Electronics" },
  { id: "computer-vision", label: "Computer Vision" },
  { id: "ai-robotics", label: "AI Robotics" },
  { id: "iot", label: "IoT" },
];

export const pinnedResources: PinnedResource[] = [
  { id: "guides", label: "Project Guides", href: "/projects" },
  { id: "components", label: "Components Library", href: "/components" },
  { id: "datasheets", label: "Resources", href: "/projects" },
];

export const aiFeatures: AIFeature[] = [
  { id: "code", title: "Generate Arduino Code", description: "Create sketches from natural language descriptions." },
  { id: "circuit", title: "Explain Circuit", description: "Understand wiring diagrams and pin connections." },
  { id: "sensors", title: "Find Compatible Sensors", description: "Match sensors to your board and project." },
  { id: "compare", title: "Component Comparison", description: "Compare specs between similar components." },
  { id: "power", title: "Power Calculator", description: "Estimate battery life and power requirements." },
  { id: "motor", title: "Motor Recommendation", description: "Choose the right motor for your build." },
  { id: "planner", title: "Project Planner", description: "Plan parts, steps, and timeline." },
  { id: "debug", title: "Debug Wiring", description: "Troubleshoot connections and pin conflicts." },
];

export const capabilities: Capability[] = [
  { id: "code-gen", title: "Code Generation", description: "Arduino, ESP32, and Python sketches tailored to your hardware.", icon: "code" },
  { id: "circuit", title: "Circuit Explanation", description: "Step-by-step wiring guides with pin mapping tables.", icon: "circuit" },
  { id: "debug", title: "Debugging", description: "Identify errors in code, wiring, and sensor readings.", icon: "debug" },
  { id: "components", title: "Component Selection", description: "Budget-aware recommendations for your project goals.", icon: "components" },
  { id: "compare", title: "Sensor Comparison", description: "Compare HC-SR04 vs IR, DHT11 vs DHT22, and more.", icon: "compare" },
  { id: "learning", title: "Learning Mode", description: "Structured lessons with examples and quizzes.", icon: "learning" },
  { id: "planning", title: "Project Planning", description: "Break complex builds into manageable milestones.", icon: "planning" },
  { id: "troubleshoot", title: "Troubleshooting", description: "Fix motors, sensors, compile errors, and power issues.", icon: "troubleshoot" },
];

export type PromptLibraryCategory = {
  id: string;
  label: string;
  prompts: { id: string; label: string; prompt: string }[];
};

export const promptLibrary: PromptLibraryCategory[] = [
  {
    id: "arduino",
    label: "Arduino",
    prompts: [
      { id: "a1", label: "Blink basics", prompt: "Explain Arduino blink sketch line by line for a beginner." },
      { id: "a2", label: "Analog read", prompt: "How do I read analog sensors with Arduino analog pins?" },
      { id: "a3", label: "Serial debug", prompt: "Show me Serial debugging best practices for Arduino." },
    ],
  },
  {
    id: "esp32",
    label: "ESP32",
    prompts: [
      { id: "e1", label: "WiFi connect", prompt: "How do I connect ESP32 to WiFi and handle reconnects?" },
      { id: "e2", label: "MQTT publish", prompt: "Generate ESP32 code to publish sensor data over MQTT." },
      { id: "e3", label: "Deep sleep", prompt: "Explain ESP32 deep sleep for battery-powered IoT nodes." },
    ],
  },
  {
    id: "iot",
    label: "IoT",
    prompts: [
      { id: "i1", label: "Weather station", prompt: "Help me plan an IoT weather station architecture." },
      { id: "i2", label: "Cloud dashboard", prompt: "What is the simplest way to send ESP32 data to a cloud dashboard?" },
      { id: "i3", label: "Security basics", prompt: "IoT security basics for hobby robotics projects." },
    ],
  },
  {
    id: "motors",
    label: "Motors",
    prompts: [
      { id: "m1", label: "L298N wiring", prompt: "How do I wire L298N to Arduino for two DC motors?" },
      { id: "m2", label: "Servo control", prompt: "Explain servo PWM control and fix jitter issues." },
      { id: "m3", label: "Motor selection", prompt: "How do I choose motors for a small 2WD robot?" },
    ],
  },
  {
    id: "sensors",
    label: "Sensors",
    prompts: [
      { id: "s1", label: "HC-SR04", prompt: "Explain HC-SR04 wiring and sample Arduino code." },
      { id: "s2", label: "IR vs ultrasonic", prompt: "Compare IR obstacle sensors vs HC-SR04 for robotics." },
      { id: "s3", label: "IMU basics", prompt: "Introduce IMU sensors for balancing robots." },
    ],
  },
  {
    id: "computer-vision",
    label: "Computer Vision",
    prompts: [
      { id: "cv1", label: "OpenCV intro", prompt: "Introduce OpenCV for a beginner robotics project." },
      { id: "cv2", label: "Line detection", prompt: "How does line detection work for robot navigation?" },
      { id: "cv3", label: "Camera module", prompt: "Compare camera modules for Raspberry Pi robotics." },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    prompts: [
      { id: "el1", label: "Resistor color code", prompt: "Explain resistor color codes with examples." },
      { id: "el2", label: "Breadboard wiring", prompt: "Best practices for clean breadboard wiring." },
      { id: "el3", label: "Voltage dividers", prompt: "When and how to use voltage dividers with microcontrollers?" },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    prompts: [
      { id: "au1", label: "Relay control", prompt: "How do I control a relay safely with Arduino?" },
      { id: "au2", label: "Home automation", prompt: "Plan a simple home automation demo with ESP32." },
      { id: "au3", label: "Scheduling tasks", prompt: "Explain task scheduling patterns for embedded automation." },
    ],
  },
  {
    id: "debugging",
    label: "Debugging",
    prompts: [
      { id: "d1", label: "Compile errors", prompt: "Help me interpret common Arduino compile errors." },
      { id: "d2", label: "Sensor noise", prompt: "My sensor readings are noisy — how do I debug this?" },
      { id: "d3", label: "Motor not spinning", prompt: "My motor doesn't spin — walk me through troubleshooting." },
    ],
  },
  {
    id: "programming",
    label: "Programming",
    prompts: [
      { id: "p1", label: "State machines", prompt: "Explain state machines for robot behavior with an example." },
      { id: "p2", label: "PID intro", prompt: "Explain PID control for line following in simple terms." },
      { id: "p3", label: "Interrupts", prompt: "Explain Arduino interrupts with a practical example." },
    ],
  },
];

export const toolActionPrompts: Record<string, string> = {
  code: "Generate Arduino or ESP32 code for my current robotics task. Use my project context and ask clarifying questions if hardware is unclear.",
  circuit: "Explain the circuit wiring for my current step. Include pin connections and common mistakes.",
  sensors: "Recommend compatible sensors for my current board and project goals.",
  compare: "Compare relevant components for my project with a concise pros/cons table.",
  power: "Calculate power requirements and suggest a battery setup for my robot.",
  motor: "Recommend motors and drivers suitable for my current build.",
  planner: "Create a phased project plan with milestones, parts list, and estimated difficulty.",
  debug: "Help me debug wiring or code issues for my current robotics step.",
};

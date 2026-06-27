import type {
  AIFeature,
  Capability,
  PinnedResource,
  QuickCategory,
  SuggestedPrompt,
} from "@/types/chat";
import type { Conversation } from "@/types/message";

export const HC_SR04_RESPONSE = `## HC-SR04 Returning 0 cm — Troubleshooting

When your ultrasonic sensor always reads **0 cm**, it usually indicates a wiring, timing, or power issue rather than a faulty sensor.

### Possible Causes

1. **Trig and Echo pins swapped** — the most common mistake
2. **Insufficient power** — HC-SR04 needs stable 5V; weak USB power causes erratic readings
3. **Echo pin not receiving the pulse** — loose jumper wire or wrong GPIO
4. **Object too close** — minimum range is ~2 cm; closer objects return 0
5. **Timeout in \`pulseIn()\`** — no echo received within the timeout window

### Pin Wiring

| HC-SR04 | Arduino UNO |
|---------|-------------|
| VCC     | 5V          |
| Trig    | Pin 9       |
| Echo    | Pin 10      |
| GND     | GND         |

> **Note:** Echo outputs 5V logic. For ESP32 (3.3V), use a voltage divider on the Echo pin.

### Example Arduino Code

\`\`\`cpp
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  float distance = duration * 0.034 / 2;

  if (duration == 0) {
    Serial.println("Error: No echo received");
  } else {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }
  delay(500);
}
\`\`\`

### Testing Checklist

- [ ] Verify Trig → Pin 9, Echo → Pin 10
- [ ] Confirm 5V power (not 3.3V on UNO)
- [ ] Point sensor at an object **> 2 cm** away
- [ ] Check Serial Monitor baud rate is **9600**
- [ ] Test with \`Serial.println(duration)\` before calculating distance

### Common Mistakes

- Using \`delay()\` instead of \`delayMicroseconds()\` for the trigger pulse
- Forgetting \`pinMode(echoPin, INPUT)\`
- Connecting Echo to an analog-only pin without digital read support

### Reference Links

- [HC-SR04 Datasheet](#) *(placeholder)*
- [Obstacle Avoiding Robot Guide](/projects/obstacle-avoiding-robot)
- [Ultrasonic Sensor Tutorial](#) *(placeholder)*`;

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
  { id: "datasheets", label: "Datasheets", href: "#" },
  { id: "circuits", label: "Circuit Examples", href: "#" },
  { id: "snippets", label: "Code Snippets", href: "#" },
  { id: "guides", label: "Project Guides", href: "/projects" },
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

export const demoConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "HC-SR04 Problem",
    preview: "My HC-SR04 always returns 0 cm...",
    updatedAt: "2024-06-20T14:30:00Z",
    pinned: true,
    category: "sensors",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "My HC-SR04 always returns 0 cm.",
        createdAt: "2024-06-20T14:28:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: HC_SR04_RESPONSE,
        createdAt: "2024-06-20T14:30:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Arduino Basics",
    preview: "What is the difference between digital and analog pins?",
    updatedAt: "2024-06-19T10:15:00Z",
    category: "arduino",
    messages: [],
  },
  {
    id: "conv-3",
    title: "Motor Not Working",
    preview: "My DC motor doesn't spin when connected to L298N...",
    updatedAt: "2024-06-18T16:45:00Z",
    category: "motors",
    messages: [],
  },
  {
    id: "conv-4",
    title: "ESP32 WiFi Setup",
    preview: "How to connect ESP32 to home WiFi network?",
    updatedAt: "2024-06-17T09:20:00Z",
    category: "esp32",
    messages: [],
  },
  {
    id: "conv-5",
    title: "Bluetooth Robot",
    preview: "Help me build an Android-controlled car...",
    updatedAt: "2024-06-16T11:00:00Z",
    category: "iot",
    messages: [],
  },
  {
    id: "conv-6",
    title: "Robotic Arm",
    preview: "How many servos do I need for a 4-DOF arm?",
    updatedAt: "2024-06-15T13:30:00Z",
    category: "motors",
    messages: [],
  },
  {
    id: "conv-7",
    title: "Smart Dustbin",
    preview: "Ultrasonic sensor for automatic lid opening...",
    updatedAt: "2024-06-14T08:50:00Z",
    category: "sensors",
    messages: [],
  },
];

export const MOCK_ASSISTANT_REPLY =
  "I'm RoboForge AI — Gemini integration is coming soon. For now, explore the demo conversation about HC-SR04, or browse our [projects](/projects) and [components](/components) library.";

export const HC_SR04_DEMO_CODE = `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  float distance = duration * 0.034 / 2;

  if (duration == 0) {
    Serial.println("Error: No echo received");
  } else {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }
  delay(500);
}`;

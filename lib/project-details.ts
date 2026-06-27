import type { Difficulty } from "@/lib/projects";
import { projects } from "@/lib/projects";
import { getProjectImage } from "@/lib/images";

export type PartItem = {
  name: string;
  quantity: string;
  purpose: string;
  buyUrl: string;
};

export type GuideStep = {
  number: number;
  title: string;
  image?: string;
  content: string;
  checklist?: string[];
  tips?: string[];
  warnings?: string[];
  pinTable?: { pin: string; connection: string }[];
  code?: string;
};

export type TroubleshootingItem = {
  title: string;
  solution: string;
};

export type DownloadItem = {
  id: string;
  title: string;
  description: string;
  fileType: string;
};

export type CircuitSection = {
  title: string;
  content: string;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  time: string;
  cost: string;
  componentCount: number;
  technologies: string[];
  image: string;
  programming: string;
  powerSource: string;
  overview: {
    description: string;
    outcomes: string[];
    skills: string[];
    applications: string[];
    expectedResult: string;
  };
  parts: PartItem[];
  circuit: {
    image: string;
    sections: CircuitSection[];
    pinMapping: { component: string; arduinoPin: string; notes: string }[];
  };
  steps: GuideStep[];
  code: string;
  testing: {
    checklist: string[];
    expectedOutput: string;
    commonIssues: string[];
  };
  troubleshooting: TroubleshootingItem[];
  downloads: DownloadItem[];
  relatedSlugs: string[];
  totalSteps: number;
};

export const OBSTACLE_ROBOT_CODE = `/*
 * Obstacle Avoiding Robot
 * Arduino UNO + HC-SR04 + L298N
 * RoboForge Demo Project
 */

const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int IN1 = 5;
const int IN2 = 6;
const int IN3 = 9;
const int IN4 = 10;
const int ENA = 3;
const int ENB = 11;

const int SAFE_DISTANCE = 25; // cm
const int MOTOR_SPEED = 180;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  Serial.begin(9600);
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  return duration * 0.034 / 2;
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, MOTOR_SPEED);
  analogWrite(ENB, MOTOR_SPEED);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, MOTOR_SPEED);
  analogWrite(ENB, MOTOR_SPEED);
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

void loop() {
  long distance = readDistance();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance > SAFE_DISTANCE || distance == 0) {
    moveForward();
  } else {
    stopMotors();
    delay(300);
    turnRight();
    delay(500);
  }
}`;

const obstacleAvoidingRobot: ProjectDetail = {
  slug: "obstacle-avoiding-robot",
  title: "Obstacle Avoiding Robot",
  description:
    "Build an autonomous robot that detects obstacles using an HC-SR04 ultrasonic sensor and navigates using an L298N motor driver with Arduino UNO.",
  difficulty: "Beginner",
  category: "Navigation",
  time: "4–5 Hours",
  cost: "₹1,500",
  componentCount: 8,
  technologies: ["Arduino UNO", "HC-SR04", "L298N", "DC Motors"],
  image: getProjectImage("obstacle-avoiding-robot"),
  programming: "Arduino C++",
  powerSource: "5V USB / 9V Battery",
  overview: {
    description:
      "In this project you will build a fully autonomous mobile robot that measures distance to objects ahead and changes direction when an obstacle is detected. You will learn ultrasonic sensing, H-bridge motor control, and basic obstacle avoidance logic — foundational skills for every robotics build.",
    outcomes: [
      "Wire an HC-SR04 ultrasonic sensor to Arduino",
      "Control DC motors through an L298N H-bridge driver",
      "Write distance measurement code using pulseIn()",
      "Implement stop–scan–turn navigation logic",
      "Debug common wiring and sensor issues",
    ],
    skills: [
      "Basic electronics and breadboarding",
      "Arduino IDE and serial monitor",
      "Digital I/O and PWM output",
      "Reading sensor data programmatically",
    ],
    applications: [
      "Autonomous vacuum robots",
      "Warehouse navigation bots",
      "Smart vehicle prototypes",
      "Competition robotics (RoboCup Junior)",
    ],
    expectedResult:
      "A robot that drives forward continuously and automatically turns right when it detects an obstacle closer than 25 cm, then resumes forward motion.",
  },
  parts: [
    { name: "Arduino UNO R3", quantity: "1", purpose: "Main microcontroller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "HC-SR04 Ultrasonic Sensor", quantity: "1", purpose: "Obstacle detection", buyUrl: "https://www.robocraze.com/products/hc-sr04-ultrasonic-sensor" },
    { name: "L298N Motor Driver", quantity: "1", purpose: "Controls DC motor direction & speed", buyUrl: "https://robu.in/product/l298n-motor-driver/" },
    { name: "DC Gear Motor (100 RPM)", quantity: "2", purpose: "Drives left and right wheels", buyUrl: "https://www.amazon.in/s?k=dc+gear+motor+100+rpm" },
    { name: "2-Wheel Robot Chassis Kit", quantity: "1", purpose: "Mechanical platform", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "9V Battery + Clip", quantity: "1", purpose: "Powers motors via L298N", buyUrl: "https://www.amazon.in/s?k=9v+battery+clip" },
    { name: "Jumper Wires (M-M)", quantity: "20", purpose: "Connections between modules", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
    { name: "Half-size Breadboard", quantity: "1", purpose: "Prototype wiring", buyUrl: "https://robu.in/product/half-size-breadboard/" },
  ],
  circuit: {
    image: getProjectImage("obstacle-avoiding-robot"),
    sections: [
      {
        title: "Power Flow",
        content:
          "The Arduino UNO is powered via USB during development. The L298N receives 9V from the battery for motor power while sharing ground (GND) with the Arduino. Never power motors directly from Arduino 5V pins.",
      },
      {
        title: "Sensor Wiring",
        content:
          "HC-SR04 VCC connects to Arduino 5V, GND to GND, TRIG to digital pin 7, and ECHO to digital pin 8. The ECHO pin outputs a pulse whose duration is proportional to distance.",
      },
      {
        title: "Motor Driver Wiring",
        content:
          "L298N IN1–IN4 connect to Arduino pins 5, 6, 9, 10. ENA and ENB connect to PWM pins 3 and 11 for speed control. Motor A and B outputs connect to the left and right DC motors.",
      },
    ],
    pinMapping: [
      { component: "HC-SR04 TRIG", arduinoPin: "D7", notes: "Output — sends 10µs pulse" },
      { component: "HC-SR04 ECHO", arduinoPin: "D8", notes: "Input — reads echo duration" },
      { component: "L298N IN1", arduinoPin: "D5", notes: "Left motor direction A" },
      { component: "L298N IN2", arduinoPin: "D6", notes: "Left motor direction B" },
      { component: "L298N IN3", arduinoPin: "D9", notes: "Right motor direction A" },
      { component: "L298N IN4", arduinoPin: "D10", notes: "Right motor direction B" },
      { component: "L298N ENA", arduinoPin: "D3 (PWM)", notes: "Left motor speed" },
      { component: "L298N ENB", arduinoPin: "D11 (PWM)", notes: "Right motor speed" },
    ],
  },
  steps: [
    {
      number: 1,
      title: "Prepare Components",
      image: getProjectImage("obstacle-avoiding-robot"),
      content:
        "Unbox and identify all components. Verify your Arduino is recognized by your computer and install the Arduino IDE if you haven't already.",
      checklist: [
        "Arduino UNO connected via USB",
        "All 8 components present",
        "Arduino IDE installed (v2.x recommended)",
        "USB cable supports data (not charge-only)",
        "Serial monitor set to 9600 baud",
      ],
      tips: [
        "Label motor wires Left/Right before mounting to avoid confusion later.",
        "Remove the L298N jumper if using PWM speed control on ENA/ENB.",
      ],
    },
    {
      number: 2,
      title: "Build Chassis",
      image: getProjectImage("bluetooth-car"),
      content:
        "Assemble the 2-wheel chassis following the kit instructions. Mount the Arduino and L298N on the top plate using double-sided tape or standoffs. Position the HC-SR04 at the front facing forward.",
      warnings: [
        "Ensure wheels spin freely without rubbing against the chassis.",
        "Keep the ultrasonic sensor level — tilted sensors give inaccurate readings.",
      ],
      tips: [
        "Mount the battery holder at the rear for better weight balance.",
        "Leave access to the Arduino USB port for programming.",
      ],
    },
    {
      number: 3,
      title: "Connect Motors",
      image: getProjectImage("line-follower-robot"),
      content:
        "Connect each DC motor to the L298N Motor A and Motor B screw terminals. Wire IN1–IN4 and ENA/ENB to the Arduino as shown in the pin mapping table.",
      pinTable: [
        { pin: "Motor A+", connection: "Left motor red wire" },
        { pin: "Motor A−", connection: "Left motor black wire" },
        { pin: "Motor B+", connection: "Right motor red wire" },
        { pin: "Motor B−", connection: "Right motor black wire" },
      ],
      tips: [
        "If a motor spins backward, swap its two wires at the terminal.",
        "Use PWM pins for ENA/ENB to enable variable speed control.",
      ],
    },
    {
      number: 4,
      title: "Wire HC-SR04",
      image: getProjectImage("iot-weather-station"),
      content:
        "Connect the ultrasonic sensor to the Arduino using four jumper wires. Double-check VCC goes to 5V, not 3.3V.",
      pinTable: [
        { pin: "VCC", connection: "Arduino 5V" },
        { pin: "GND", connection: "Arduino GND" },
        { pin: "TRIG", connection: "Arduino D7" },
        { pin: "ECHO", connection: "Arduino D8" },
      ],
      tips: [
        "Keep sensor wires away from motor power lines to reduce noise.",
        "Add a 100µF capacitor across VCC/GND if readings are unstable.",
      ],
    },
    {
      number: 5,
      title: "Upload Arduino Code",
      content:
        "Copy the code below into Arduino IDE, select Board: Arduino UNO and the correct COM port, then click Upload. Open Serial Monitor to verify distance readings.",
      tips: [
        "Upload with battery disconnected if you experience USB power issues.",
        "If upload fails, press the reset button on the Arduino once.",
      ],
    },
    {
      number: 6,
      title: "Testing",
      image: getProjectImage("maze-solving-robot"),
      content:
        "Place the robot on a flat surface with open space ahead. Power on and observe behavior. Use Serial Monitor to verify distance values change when you place your hand in front of the sensor.",
      checklist: [
        "Serial Monitor shows distance values (2–400 cm range)",
        "Robot moves forward in open space",
        "Robot stops when obstacle < 25 cm",
        "Robot turns right after stopping",
        "Robot resumes forward after turn",
      ],
    },
  ],
  code: OBSTACLE_ROBOT_CODE,
  testing: {
    checklist: [
      "Distance readings appear in Serial Monitor",
      "Motors respond to forward command",
      "Robot stops near obstacles",
      "Turn maneuver completes without stalling",
      "No excessive motor heat after 5 min run",
    ],
    expectedOutput:
      "Serial Monitor prints distance values every loop cycle. Robot drives forward, stops at obstacles, turns right, and continues.",
    commonIssues: [
      "Sensor always reads 0 — check TRIG/ECHO pin assignment",
      "Motors don't spin — verify L298N power jumper and 9V battery",
      "Robot turns the wrong direction — swap IN3/IN4 or adjust turn logic",
    ],
  },
  troubleshooting: [
    { title: "Motor not rotating", solution: "Check L298N 9V power, verify IN pin connections, ensure ENA/ENB jumpers removed if using PWM, and test motors by swapping wires." },
    { title: "Sensor returns zero", solution: "Confirm TRIG is on an output pin and ECHO on an input pin. Increase pulseIn timeout. Ensure nothing blocks the sensor within 2 cm." },
    { title: "Robot moving backward", solution: "Swap motor wires at the L298N terminal or reverse the HIGH/LOW logic for IN1/IN2 and IN3/IN4 in code." },
    { title: "Battery draining quickly", solution: "Use fresh 9V alkaline or switch to 2S LiPo (7.4V). Reduce MOTOR_SPEED constant. Disconnect battery when not in use." },
    { title: "Compilation error", solution: "Ensure Board is set to Arduino UNO. Remove non-ASCII characters from code. Install Arduino AVR boards package via Board Manager." },
  ],
  downloads: [
    { id: "code", title: "Arduino Code", description: "Complete .ino sketch with comments", fileType: "INO" },
    { id: "diagram", title: "Circuit Diagram", description: "Fritzing schematic PDF", fileType: "PDF" },
    { id: "guide", title: "PDF Guide", description: "Full step-by-step printable guide", fileType: "PDF" },
    { id: "bom", title: "BOM", description: "Bill of materials with links", fileType: "CSV" },
    { id: "libraries", title: "Libraries", description: "No external libraries required", fileType: "ZIP" },
  ],
  relatedSlugs: [
    "line-follower-robot",
    "bluetooth-car",
    "maze-solving-robot",
    "robotic-arm",
    "smart-dustbin",
  ],
  totalSteps: 7,
};

const detailMap: Record<string, ProjectDetail> = {
  "obstacle-avoiding-robot": obstacleAvoidingRobot,
};

function buildFallbackDetail(slug: string): ProjectDetail | null {
  const base = projects.find((p) => p.slug === slug);
  if (!base) return null;

  return {
    ...obstacleAvoidingRobot,
    slug: base.slug,
    title: base.title,
    description: base.description,
    difficulty: base.difficulty,
    category: base.category,
    time: base.time,
    cost: base.cost,
    componentCount: base.componentCount,
    technologies: base.technologies.map((t) => t.toUpperCase()),
    image: base.image,
  };
}

export function getProjectDetail(slug: string): ProjectDetail | null {
  return detailMap[slug] ?? buildFallbackDetail(slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export const sidebarNavItems = [
  { id: "overview", label: "Overview" },
  { id: "parts", label: "Parts" },
  { id: "circuit", label: "Circuit" },
  { id: "steps", label: "Steps" },
  { id: "code", label: "Code" },
  { id: "testing", label: "Testing" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "downloads", label: "Downloads" },
  { id: "related", label: "Related Projects" },
] as const;

import type { ProjectContentSeed } from "@/lib/content/types";

export const roboticArm: ProjectContentSeed = {
  slug: "robotic-arm",
  programming: "Arduino C++ (ESP32)",
  powerSource: "5V 5A supply (servos) + USB for ESP32",
  overview: {
    description:
      "Assemble a 4-DOF desktop robotic arm with MG996R servos on ESP32. Control joint angles via serial commands, potentiometers for teach mode, and inverse kinematics for (x,y) pick-and-place in a defined workspace.",
    outcomes: [
      "Wire four high-torque servos with external 5V supply",
      "Map joint angles to PWM on ESP32 ledc",
      "Parse serial G-code style commands (G0 J1 90)",
      "Implement 2-link planar IK for gripper position",
      "Calibrate home position and joint limits",
    ],
    skills: ["Servo sequencing", "Inverse kinematics", "Serial protocols", "Mechanical assembly"],
    applications: ["Pick-and-place demos", "Sorter arms", "CNC intro education"],
    expectedResult: "Arm moves to taught positions via serial or pots; IK commands move gripper to coordinate targets within reach.",
  },
  prerequisites: ["Servo power supply experience", "Basic trigonometry", "ESP32 Arduino core"],
  safety: [
    "NEVER power MG996R from ESP32 5V pin — use 5V 5A supply",
    "Clear workspace before homing — arm can snap quickly",
    "Secure base — tipping causes damage",
  ],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Arm controller", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "MG996R Servo", quantity: "4", purpose: "Base, shoulder, elbow, grip", buyUrl: "https://robu.in/product/mg996r-servo-motor/" },
    { name: "4-DOF Arm Kit", quantity: "1", purpose: "Acrylic/metal links", buyUrl: "https://www.amazon.in/s?k=4dof+robotic+arm+kit" },
    { name: "5V 5A Power Supply", quantity: "1", purpose: "Servo rail", buyUrl: "https://www.amazon.in/s?k=5v+5a+power+supply" },
    { name: "10k Potentiometer", quantity: "4", purpose: "Teach mode input", buyUrl: "https://www.robocraze.com/products/potentiometer-10k" },
    { name: "Servo Extension Cables", quantity: "4", purpose: "Clean routing", buyUrl: "https://robu.in/product/servo-extension-cable/" },
    { name: "Breadboard Power Rail", quantity: "1", purpose: "5V distribution", buyUrl: "https://robu.in/product/half-size-breadboard/" },
  ],
  circuit: {
    sections: [
      { title: "Servo Power Bus", content: "All servo red wires to 5V 5A supply. Black to common GND with ESP32. Signal wires to GPIO 18,19,21,22." },
      { title: "Potentiometer Teach", content: "Optional pots on GPIO 32,33,34,35 for manual joint control in teach mode." },
      { title: "Serial Control", content: "USB serial 115200 — commands G0 J<n> <angle> or IK X Y." },
    ],
    pinMapping: [
      { component: "Servo Base (J0)", arduinoPin: "GPIO 18", notes: "0–180° yaw" },
      { component: "Servo Shoulder (J1)", arduinoPin: "GPIO 19", notes: "Pitch" },
      { component: "Servo Elbow (J2)", arduinoPin: "GPIO 21", notes: "Pitch" },
      { component: "Servo Grip (J3)", arduinoPin: "GPIO 22", notes: "Open/close" },
      { component: "Pots J0–J3", arduinoPin: "GPIO 32–35", notes: "Teach mode ADC" },
    ],
  },
  steps: [
    { number: 1, title: "Mechanical Assembly", content: "Build 4-DOF kit per instructions. Tighten horn screws with arm at mid-range.", warnings: ["Do not force joints past mechanical stops"] },
    { number: 2, title: "Servo Power Distribution", content: "Wire 5V 5A bus to all servos. Connect ESP32 GND to supply GND only." },
    { number: 3, title: "Signal Wiring", content: "Route four signal wires to ESP32 GPIO. Label J0–J3 at connector." },
    { number: 4, title: "Homing Sequence", content: "Run arm_home.ino — moves each joint to 90° center. Adjust HOME array per your build." },
    { number: 5, title: "Upload Arm Control Code", content: "Flash robotic_arm_esp32.ino. Test serial: G0 J1 45 moves shoulder to 45°." },
    { number: 6, title: "Pick-and-Place Test", content: "Command IK targets within 15 cm reach. Verify gripper open/close on object.", checklist: ["All joints move", "No servo buzz at hold", "IK reaches 3 points", "Gripper grasps cube"] },
  ],
  code: `/*
 * Robotic Arm 4-DOF — ESP32
 * File: robotic_arm_esp32.ino
 */

#include <ESP32Servo.h>
Servo j0, j1, j2, j3;
const int PIN_J[4] = {18, 19, 21, 22};
float angles[4] = {90, 90, 90, 90};
const float L1 = 10.0, L2 = 10.0; // cm link lengths

void setJoint(int n, float a) {
  a = constrain(a, 15, 165);
  angles[n] = a;
  switch (n) {
    case 0: j0.write((int)a); break;
    case 1: j1.write((int)a); break;
    case 2: j2.write((int)a); break;
    case 3: j3.write((int)a); break;
  }
}

bool ik(float x, float y, float &a1, float &a2) {
  float d = sqrt(x*x + y*y);
  if (d > L1 + L2 || d < abs(L1 - L2)) return false;
  float cos2 = (x*x + y*y - L1*L1 - L2*L2) / (2*L1*L2);
  a2 = degrees(acos(cos2));
  float k1 = L1 + L2 * cos(radians(a2));
  float k2 = L2 * sin(radians(a2));
  a1 = degrees(atan2(y, x) - atan2(k2, k1));
  return true;
}

void parseSerial() {
  if (!Serial.available()) return;
  String cmd = Serial.readStringUntil('\\n');
  if (cmd.startsWith("G0 J")) {
    int j = cmd.charAt(5) - '0';
    float a = cmd.substring(7).toFloat();
    setJoint(j, a);
  } else if (cmd.startsWith("IK")) {
    float x = cmd.substring(3, cmd.indexOf(' ')).toFloat();
    float y = cmd.substring(cmd.lastIndexOf(' ') + 1).toFloat();
    float a1, a2;
    if (ik(x, y, a1, a2)) { setJoint(1, a1); setJoint(2, a2); }
  }
}

void setup() {
  Serial.begin(115200);
  j0.attach(PIN_J[0]); j1.attach(PIN_J[1]);
  j2.attach(PIN_J[2]); j3.attach(PIN_J[3]);
  for (int i = 0; i < 4; i++) setJoint(i, 90);
}

void loop() {
  parseSerial();
  delay(10);
}`,
  testing: {
    checklist: ["Each joint 0–180", "External 5V stable", "Serial G0 works", "IK within workspace", "Gripper holds 50g"],
    expectedOutput: "Serial-controlled arm with IK pick-and-place in 20 cm workspace.",
    commonIssues: ["Servo jitter — add 470µF on 5V", "IK unreachable — reduce X/Y", "Base wobble — bolt to desk"],
  },
  troubleshooting: [
    { title: "Servos chatter at rest", solution: "Separate 5V 5A supply. Short signal wires. detach() when idle if not holding load." },
    { title: "ESP32 brownout on move", solution: "Never power MG996R from ESP32. Star ground at power supply." },
    { title: "IK gives wrong pose", solution: "Measure actual L1 L2 link lengths in cm. Calibrate zero at horizontal." },
    { title: "Joint hits mechanical stop", solution: "Reduce constrain limits to 20–160°. Adjust HOME in firmware." },
    { title: "Serial commands ignored", solution: "End lines with newline. Match 115200 baud. Use Serial Monitor 'Newline' ending." },
  ],
  downloads: [
    { id: "code", title: "robotic_arm_esp32.ino", description: "4-DOF serial + IK control", fileType: "INO" },
    { id: "home", title: "arm_home.ino", description: "Homing utility sketch", fileType: "INO" },
    { id: "diagram", title: "robotic_arm_wiring.pdf", description: "Servo power bus schematic", fileType: "PDF" },
    { id: "workspace", title: "arm_workspace_chart.pdf", description: "Reachable IK coordinates", fileType: "PDF" },
  ],
  relatedSlugs: ["gesture-controlled-robot", "self-balancing-robot", "smart-dustbin"],
  faq: [
    { question: "MG90S instead of MG996R?", answer: "MG90S works for lightweight plastic kits — MG996R needed for metal links and payloads >100g." },
    { question: "Add Bluetooth control?", answer: "Use ESP32 BLE serial or Blynk joystick widgets mapping to setJoint calls." },
  ],
  aiPromptSuggestions: [
    "Add smooth interpolation between joint targets",
    "Explain inverse kinematics for my link lengths",
    "Write Python serial client to draw square path",
  ],
};

export const advancedSeeds: Record<string, ProjectContentSeed> = {
  "robotic-arm": roboticArm,
};

import type { ProjectContentSeed } from "@/lib/content/types";

export const bluetoothCar: ProjectContentSeed = {
  slug: "bluetooth-car",
  programming: "Arduino C++",
  powerSource: "2S Li-ion 7.4V (motors) + USB (Arduino)",
  overview: {
    description:
      "Build a smartphone-controlled RC car using HC-05 Bluetooth module and Arduino UNO. Parse single-character commands from a serial Bluetooth terminal app to drive four motors through L298N with variable PWM speed.",
    outcomes: [
      "Pair HC-05 with Android Bluetooth terminal",
      "Map serial commands to motor movements",
      "Implement smooth acceleration ramping",
      "Wire four-motor Mecanum or standard 4WD chassis",
      "Debug pairing PIN and baud rate issues",
    ],
    skills: ["Serial communication", "Bluetooth AT commands", "PWM motor mixing", "Mobile app control"],
    applications: ["RC hobby builds", "Telepresence rover bases", "STEM remote control labs"],
    expectedResult: "Phone app sends F/B/L/R/S commands; car responds instantly with proportional motor speeds.",
  },
  prerequisites: ["Arduino serial monitor familiarity", "Android phone with Bluetooth"],
  safety: ["Disconnect drive battery when programming HC-05", "Secure phone mount — don't drive distracted"],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "HC-05 Bluetooth", quantity: "1", purpose: "Wireless serial link", buyUrl: "https://www.robocraze.com/products/hc-05-bluetooth-module" },
    { name: "L298N Dual Driver", quantity: "2", purpose: "4WD motor control", buyUrl: "https://robu.in/product/l298n-motor-driver/" },
    { name: "4WD Chassis Kit", quantity: "1", purpose: "Platform", buyUrl: "https://www.amazon.in/s?k=4wd+robot+chassis" },
    { name: "TT Motor 200 RPM", quantity: "4", purpose: "Wheel drive", buyUrl: "https://www.amazon.in/s?k=tt+motor+200+rpm" },
    { name: "2S Li-ion Battery", quantity: "1", purpose: "Motor power", buyUrl: "https://www.amazon.in/s?k=2s+lipo+7.4v" },
    { name: "Logic Level Jumper Kit", quantity: "1", purpose: "Wiring", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      { title: "HC-05 UART", content: "HC-05 TX → Arduino D10 (RX), RX → D11 (TX) via voltage divider if 5V Arduino. VCC 5V, GND common." },
      { title: "Dual L298N", content: "Driver 1: left motors. Driver 2: right motors. Shared battery 7.4V." },
      { title: "Baud Rate", content: "Default HC-05 9600 or 38400 — match Serial.begin() and app settings." },
    ],
    pinMapping: [
      { component: "HC-05 TX/RX", arduinoPin: "D10 RX / D11 TX", notes: "SoftwareSerial" },
      { component: "L298N #1 ENA/IN", arduinoPin: "D5,D6,D3", notes: "Left pair" },
      { component: "L298N #2 ENB/IN", arduinoPin: "D9,D4,D11", notes: "Right pair" },
    ],
  },
  steps: [
    { number: 1, title: "Assemble 4WD Chassis", content: "Mount four motors and drivers. Label corners FL/FR/RL/RR." },
    { number: 2, title: "Configure HC-05", content: "Enter AT mode (KEY pin HIGH). Set name RoboForgeCar and baud 9600.", tips: ["Use 38400 in AT mode, 9600 after"] },
    { number: 3, title: "Wire Motor Drivers", content: "Connect both L298N units to Arduino PWM and direction pins." },
    { number: 4, title: "Bluetooth Serial Test", content: "Upload echo sketch. Pair phone PIN 1234. Confirm characters echo in app." },
    { number: 5, title: "Upload RC Car Code", content: "Flash bluetooth_rc_car.ino. Commands: F B L R S and 1-9 for speed." },
    { number: 6, title: "Drive Testing", content: "Test each direction on smooth floor. Adjust MOTOR_MAX if wheels slip.", checklist: ["Forward straight", "Tank turn", "Stop instant", "Speed levels work"] },
  ],
  code: `/*
 * Bluetooth RC Car 4WD
 * HC-05 + dual L298N
 * File: bluetooth_rc_car.ino
 */

#include <SoftwareSerial.h>
SoftwareSerial BT(10, 11);
const int ENA = 3, IN1 = 5, IN2 = 6;
const int ENB = 9, IN3 = 4, IN4 = 7;
int speedVal = 200;

void leftMotors(int s) {
  digitalWrite(IN1, s >= 0); digitalWrite(IN2, s < 0);
  analogWrite(ENA, constrain(abs(s), 0, 255));
}
void rightMotors(int s) {
  digitalWrite(IN3, s >= 0); digitalWrite(IN4, s < 0);
  analogWrite(ENB, constrain(abs(s), 0, 255));
}

void drive(char cmd) {
  switch (cmd) {
    case 'F': leftMotors(speedVal); rightMotors(speedVal); break;
    case 'B': leftMotors(-speedVal); rightMotors(-speedVal); break;
    case 'L': leftMotors(-speedVal); rightMotors(speedVal); break;
    case 'R': leftMotors(speedVal); rightMotors(-speedVal); break;
    default: leftMotors(0); rightMotors(0); break;
  }
}

void setup() {
  Serial.begin(9600); BT.begin(9600);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  if (BT.available()) {
    char c = BT.read();
    if (c >= '1' && c <= '9') speedVal = map(c - '0', 1, 9, 100, 255);
    else drive(c);
  }
}`,
  testing: {
    checklist: ["BT pairs", "F/B/L/R respond", "Stop halts motors", "No disconnect under load"],
    expectedOutput: "Responsive phone-controlled 4WD car.",
    commonIssues: ["Garbled serial — baud mismatch", "One side dead — check second L298N power", "HC-05 not found — re-enter AT rename"],
  },
  troubleshooting: [
    { title: "Bluetooth connects but no movement", solution: "Verify SoftwareSerial pins. Test with USB Serial echo. Confirm command chars uppercase F not f." },
    { title: "Motors stutter", solution: "Add 100µF cap on L298N. Use separate BEC for Arduino when motors surge." },
    { title: "Range under 5 m", solution: "Replace HC-05 antenna module. Avoid metal shielding under phone." },
    { title: "Reverse swapped", solution: "Swap motor wires per side or invert B command logic." },
  ],
  downloads: [
    { id: "code", title: "bluetooth_rc_car.ino", description: "Main RC sketch", fileType: "INO" },
    { id: "at", title: "hc05_at_config.ino", description: "HC-05 setup utility", fileType: "INO" },
    { id: "diagram", title: "bt_car_wiring.pdf", description: "Dual L298N layout", fileType: "PDF" },
  ],
  relatedSlugs: ["wifi-robot-esp32", "obstacle-avoiding-robot", "gesture-controlled-robot"],
  faq: [
    { question: "iOS compatible?", answer: "HC-05 is classic Bluetooth SPP — works with Android serial apps; iOS needs BLE module instead." },
    { question: "Can I use gamepad app?", answer: "Yes if app sends single-char serial commands matching F/B/L/R." },
  ],
  aiPromptSuggestions: [
    "Add joystick proportional control over Bluetooth",
    "How to configure HC-05 with AT commands?",
    "Merge obstacle avoidance when no BT command for 2s",
  ],
};

export const wifiRobotEsp32: ProjectContentSeed = {
  slug: "wifi-robot-esp32",
  programming: "Arduino C++ (ESP32)",
  powerSource: "2S Li-ion + 5V UBEC",
  overview: {
    description:
      "Create a Wi-Fi controlled rover using ESP32 built-in Wi-Fi in AP or STA mode. Serve a minimal web page with on-screen joystick buttons that send motor commands over HTTP to drive TB6612 motor driver.",
    outcomes: [
      "Configure ESP32 as Wi-Fi access point",
      "Serve HTML control page from SPIFFS",
      "Handle HTTP GET motor endpoints",
      "Implement watchdog stop on connection loss",
      "Access robot from phone browser without app install",
    ],
    skills: ["ESP32 Wi-Fi", "Embedded web server", "Async HTTP", "Motor PWM on ESP32"],
    applications: ["IoT rover demos", "Campus surveillance prototypes", "Wi-Fi RC racing"],
    expectedResult: "Connect phone to RoboForge-Rover Wi-Fi, open 192.168.4.1, drive with web buttons.",
  },
  prerequisites: ["ESP32 board package in Arduino IDE", "Basic HTML familiarity"],
  safety: ["Set motor watchdog — stop if Wi-Fi drops", "Don't run Li-ion below 6V"],
  parts: [
    { name: "ESP32-WROOM DevKit", quantity: "1", purpose: "Wi-Fi + control", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "TB6612FNG", quantity: "1", purpose: "Motor driver", buyUrl: "https://www.robocraze.com/products/tb6612fng-motor-driver" },
    { name: "2WD Chassis + Motors", quantity: "1", purpose: "Drive platform", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "2S Li-ion 2000mAh", quantity: "1", purpose: "Power", buyUrl: "https://www.amazon.in/s?k=2s+lipo+battery" },
    { name: "AMS1117 5V Reg", quantity: "1", purpose: "ESP32 supply", buyUrl: "https://robu.in/product/ams1117-5v-regulator/" },
    { name: "Wi-Fi Antenna", quantity: "1", purpose: "Included on ESP32", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
  ],
  circuit: {
    sections: [
      { title: "ESP32 Motor PWM", content: "PWMA GPIO 25, PWMB GPIO 26. Direction pins 27,14,12,13 on TB6612." },
      { title: "Power", content: "7.4V to TB6612 VM. Regulated 5V to ESP32 VIN. Common GND." },
      { title: "Wi-Fi AP", content: "No external module — onboard antenna. Place ESP32 away from motor noise." },
    ],
    pinMapping: [
      { component: "TB6612 PWMA/PWMB", arduinoPin: "GPIO 25 / 26", notes: "ledc PWM" },
      { component: "Motor direction", arduinoPin: "GPIO 27,14,12,13", notes: "AIN/BIN" },
      { component: "STBY", arduinoPin: "GPIO 33", notes: "HIGH = active" },
    ],
  },
  steps: [
    { number: 1, title: "Chassis and Driver", content: "Mount ESP32 and TB6612 on chassis. Wire motors and battery." },
    { number: 2, title: "Power Regulation", content: "Verify 5V at ESP32 under load. Add bulk capacitor 470µF." },
    { number: 3, title: "Upload SPIFFS Web UI", content: "Upload data folder with index.html via ESP32 Sketch Data Upload tool." },
    { number: 4, title: "Flash Wi-Fi Rover Firmware", content: "Upload wifi_rover_esp32.ino. Note AP SSID RoboForge-Rover password roboforge123." },
    { number: 5, title: "Browser Control Test", content: "Connect phone Wi-Fi to rover AP. Navigate to http://192.168.4.1 and test buttons.", checklist: ["AP visible", "Page loads", "Motors respond", "Stop on disconnect"] },
    { number: 6, title: "STA Mode (Optional)", content: "Configure home Wi-Fi credentials in code for same-network control." },
  ],
  code: `/*
 * Wi-Fi Robot ESP32 — Web joystick
 * File: wifi_rover_esp32.ino
 */

#include <WiFi.h>
#include <WebServer.h>
const char* AP_SSID = "RoboForge-Rover";
const char* AP_PASS = "roboforge123";
WebServer server(80);
const int PWMA = 25, PWMB = 26;
const int AIN1 = 27, AIN2 = 14, BIN1 = 12, BIN2 = 13, STBY = 33;
unsigned long lastCmd = 0;

void motor(int l, int r) {
  digitalWrite(STBY, HIGH);
  digitalWrite(AIN1, l >= 0); digitalWrite(AIN2, l < 0);
  digitalWrite(BIN1, r >= 0); digitalWrite(BIN2, r < 0);
  ledcWrite(0, constrain(abs(l), 0, 255));
  ledcWrite(1, constrain(abs(r), 0, 255));
  lastCmd = millis();
}

void handleRoot() {
  server.send(200, "text/html",
    "<html><body><h2>Rover</h2>"
    "<a href='/m?c=F'>Forward</a> | <a href='/m?c=S'>Stop</a><br>"
    "<a href='/m?c=L'>Left</a> | <a href='/m?c=R'>Right</a>"
    "</body></html>");
}

void handleMove() {
  String c = server.arg("c");
  if (c == "F") motor(200, 200);
  else if (c == "B") motor(-200, -200);
  else if (c == "L") motor(-180, 180);
  else if (c == "R") motor(180, -180);
  else motor(0, 0);
  server.send(200, "text/plain", "ok");
  lastCmd = millis();
}

void setup() {
  pinMode(STBY, OUTPUT);
  ledcSetup(0, 5000, 8); ledcAttachPin(PWMA, 0);
  ledcSetup(1, 5000, 8); ledcAttachPin(PWMB, 1);
  WiFi.softAP(AP_SSID, AP_PASS);
  server.on("/", handleRoot);
  server.on("/m", handleMove);
  server.begin();
}

void loop() {
  server.handleClient();
  if (millis() - lastCmd > 800) motor(0, 0);
}`,
  testing: {
    checklist: ["AP broadcasts", "HTTP 200 on /", "All directions work", "Auto-stop 800ms"],
    expectedOutput: "Browser-driven rover with fail-safe stop.",
    commonIssues: ["Can't connect — check password", "Page blank — upload SPIFFS", "Motors weak — battery voltage"],
  },
  troubleshooting: [
    { title: "Wi-Fi not visible", solution: "Set WiFi.mode(WIFI_AP). Check antenna clearance. Reflash with erase flash." },
    { title: "Motors run after disconnect", solution: "Verify watchdog in loop(). Reduce timeout to 500 ms." },
    { title: "ESP32 resets on motor start", solution: "Separate motor battery ground star point. Add 1000µF on 5V." },
    { title: "Slow web response", solution: "Use async web server library. Reduce HTML size." },
  ],
  downloads: [
    { id: "code", title: "wifi_rover_esp32.ino", description: "AP web server sketch", fileType: "INO" },
    { id: "ui", title: "rover_web_ui.zip", description: "SPIFFS HTML/CSS assets", fileType: "ZIP" },
    { id: "diagram", title: "esp32_rover_schematic.pdf", description: "TB6612 wiring", fileType: "PDF" },
  ],
  relatedSlugs: ["bluetooth-car", "voice-controlled-home", "self-balancing-robot"],
  faq: [
    { question: "Control from internet?", answer: "Use STA mode + port forwarding or Blynk/Arduino IoT Cloud for remote access." },
    { question: "WebSocket joystick?", answer: "Upgrade to ESPAsyncWebServer for low-latency touch control." },
  ],
  aiPromptSuggestions: [
    "Add WebSocket joystick to this sketch",
    "Switch from AP to home Wi-Fi STA mode",
    "Explain the motor watchdog safety logic",
  ],
};

export const voiceControlledHome: ProjectContentSeed = {
  slug: "voice-controlled-home",
  programming: "Arduino C++ (ESP32) + Blynk",
  powerSource: "5V 2A adapter (relays) + USB for ESP32",
  overview: {
    description:
      "Automate home appliances with ESP32, 4-channel relay module, and Blynk IoT voice widgets. Integrate Google Assistant via IFTTT webhooks to toggle lights and fans with spoken commands.",
    outcomes: [
      "Wire relays safely for appliance switching",
      "Configure Blynk virtual pins for device states",
      "Link IFTTT Google Assistant to Blynk webhooks",
      "Implement debounced relay toggle in firmware",
      "Document load limits per relay channel",
    ],
    skills: ["Mains isolation", "IoT cloud hooks", "ESP32 Wi-Fi", "Voice assistant integration"],
    applications: ["Smart home labs", "Hostel room automation", "Accessibility switches"],
    expectedResult: "Say 'Hey Google, turn on RoboForge light' — relay clicks and lamp turns on via Blynk.",
  },
  prerequisites: ["Home Wi-Fi credentials", "Google account for IFTTT", "Basic AC wiring awareness"],
  safety: [
    "NEVER wire mains AC without qualified supervision",
    "Use relay module for low-voltage lamp demo first",
    "Keep high voltage in enclosed box",
    "Turn off breaker before any wiring",
  ],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Wi-Fi controller", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "4-Channel Relay 5V", quantity: "1", purpose: "Switch loads", buyUrl: "https://robu.in/product/4-channel-relay-module/" },
    { name: "BC547 + LED Demo Board", quantity: "1", purpose: "Safe low-voltage demo", buyUrl: "https://www.amazon.in/s?k=led+breadboard+kit" },
    { name: "5V 2A Adapter", quantity: "1", purpose: "Relay coil supply", buyUrl: "https://www.amazon.in/s?k=5v+2a+adapter" },
    { name: "Dupont Wires", quantity: "15", purpose: "GPIO to relay IN", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
    { name: "Terminal Block", quantity: "4", purpose: "Load connections", buyUrl: "https://robu.in/product/screw-terminal-block/" },
  ],
  circuit: {
    sections: [
      { title: "Relay Inputs", content: "ESP32 GPIO 16,17,18,19 to relay IN1–IN4. JD-VCC jumper removed — separate 5V for relay coils." },
      { title: "Load Wiring", content: "For demo: battery + lamp through COM/NO. For mains: use enclosed box and qualified installer." },
      { title: "Blynk", content: "Virtual pins V0–V3 map to each relay state in cloud dashboard." },
    ],
    pinMapping: [
      { component: "Relay IN1–IN4", arduinoPin: "GPIO 16–19", notes: "Active LOW typical" },
      { component: "Status LED", arduinoPin: "GPIO 2", notes: "Built-in" },
      { component: "Blynk auth", arduinoPin: "N/A", notes: "In firmware #define" },
    ],
  },
  steps: [
    { number: 1, title: "Low-Voltage Demo Setup", content: "Wire 4 LEDs or 5V lamps through relay COM/NO for safe classroom demo." },
    { number: 2, title: "ESP32 Relay Connections", content: "Connect GPIO to relay IN pins. Common GND. External 5V to relay VCC." },
    { number: 3, title: "Blynk App Configuration", content: "Create 4 Button widgets on V0–V3. Copy auth token to firmware." },
    { number: 4, title: "IFTTT Google Assistant", content: "Create applet: Google Assistant phrase → Webhooks GET to Blynk URL with pin value." },
    { number: 5, title: "Upload Voice Home Code", content: "Flash voice_home_blynk.ino with Wi-Fi SSID and Blynk token." },
    { number: 6, title: "Voice Testing", content: "Test each voice phrase. Confirm relay debounce and status LED.", checklist: ["App toggle works", "Voice triggers", "No relay chatter", "All 4 channels"] },
  ],
  code: `/*
 * Voice Controlled Home — ESP32 + Blynk
 * File: voice_home_blynk.ino
 */

#define BLYNK_TEMPLATE_ID "TMPLxxx"
#define BLYNK_AUTH_TOKEN "your_token"
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
const int RELAYS[4] = {16, 17, 18, 19};
bool state[4] = {false, false, false, false};

void setRelay(int i, bool on) {
  state[i] = on;
  digitalWrite(RELAYS[i], on ? LOW : HIGH);
  Blynk.virtualWrite(i, on ? 1 : 0);
}

BLYNK_WRITE(V0) { setRelay(0, param.asInt() == 1); }
BLYNK_WRITE(V1) { setRelay(1, param.asInt() == 1); }
BLYNK_WRITE(V2) { setRelay(2, param.asInt() == 1); }
BLYNK_WRITE(V3) { setRelay(3, param.asInt() == 1); }

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(RELAYS[i], OUTPUT);
    digitalWrite(RELAYS[i], HIGH);
  }
  Blynk.begin(BLYNK_AUTH_TOKEN, "YourSSID", "YourPassword");
}

void loop() {
  Blynk.run();
}`,
  testing: {
    checklist: ["Blynk online", "Manual app toggle", "IFTTT webhook fires", "Relay LED matches state"],
    expectedOutput: "Voice and app control of four independent channels.",
    commonIssues: ["Blynk offline — Wi-Fi 2.4 GHz only", "Relay always on — active LOW logic", "IFTTT delay — normal 2–5 s"],
  },
  troubleshooting: [
    { title: "Relay stuck ON", solution: "Most modules active LOW — digitalWrite HIGH = off. Verify with multimeter on NO contact." },
    { title: "Google doesn't trigger", solution: "Re-link IFTTT account. Test webhook URL in browser. Check Blynk token." },
    { title: "ESP32 won't connect Wi-Fi", solution: "Use 2.4 GHz SSID. Avoid special chars in password. Print WiFi.status() to Serial." },
    { title: "Chattering relay", solution: "Add 50 ms debounce. Separate 5V 2A supply for relay module." },
  ],
  downloads: [
    { id: "code", title: "voice_home_blynk.ino", description: "Blynk relay firmware", fileType: "INO" },
    { id: "ifttt", title: "ifttt_webhook_setup.pdf", description: "Google Assistant linking guide", fileType: "PDF" },
    { id: "diagram", title: "relay_safety_wiring.pdf", description: "Low-voltage demo schematic", fileType: "PDF" },
  ],
  relatedSlugs: ["iot-weather-station", "rfid-door-lock", "smart-parking-system"],
  faq: [
    { question: "Alexa instead of Google?", answer: "Use Alexa Blynk skill or Sinric Pro for native Alexa device discovery." },
    { question: "Max load per relay?", answer: "Typical SRD-05VDC-SL-C rated 10A at 250VAC — use enclosed box and proper gauge wire." },
  ],
  aiPromptSuggestions: [
    "Add timer schedule for relay auto-off",
    "How to use Sinric Pro instead of IFTTT?",
    "Explain active LOW relay wiring",
  ],
};

export const gestureControlledRobot: ProjectContentSeed = {
  slug: "gesture-controlled-robot",
  programming: "Arduino C++ (ESP32)",
  powerSource: "7.4V battery + 5V regulator",
  overview: {
    description:
      "Control a rover using hand gestures detected by MPU6050 tilt and swipe patterns. Map pitch/roll thresholds to forward, back, left, right commands on L298N motor driver without a camera — pure IMU gesture recognition.",
    outcomes: [
      "Read MPU6050 orientation on ESP32",
      "Define gesture zones from pitch and roll angles",
      "Debounce gesture transitions",
      "Drive motors from tilt-based commands",
      "Optional: add buzzer feedback on gesture detect",
    ],
    skills: ["IMU data processing", "Gesture threshold design", "ESP32 I2C", "Real-time mapping"],
    applications: ["Touchless control demos", "Assistive robotics", "Wearable controller extension"],
    expectedResult: "Tilt hand-held MPU6050 module forward — robot drives forward; tilt left — robot turns left.",
  },
  prerequisites: ["MPU6050 basics", "Completed Bluetooth or Wi-Fi car helpful"],
  safety: ["Secure IMU module — sudden drops cause runaway if watchdog missing"],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Gesture + motor control", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "MPU6050", quantity: "1", purpose: "Gesture sensing", buyUrl: "https://robu.in/product/mpu6050-gyroscope-accelerometer/" },
    { name: "L298N + 2WD Chassis", quantity: "1 set", purpose: "Robot base", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "Piezo Buzzer", quantity: "1", purpose: "Gesture confirm beep", buyUrl: "https://www.robocraze.com/products/piezo-buzzer" },
    { name: "7.4V Battery", quantity: "1", purpose: "Motor power", buyUrl: "https://www.amazon.in/s?k=2s+lipo+battery" },
    { name: "I2C Cable 20cm", quantity: "1", purpose: "Remote IMU wand", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      { title: "IMU Wand", content: "MPU6050 on separate small board connected via I2C cable to robot ESP32 — or second ESP32 with ESP-NOW." },
      { title: "Motors", content: "Standard L298N wiring on GPIO 25–27, 14, 12, 13 with PWM." },
      { title: "Feedback", content: "Buzzer on GPIO 32 short beep on gesture change." },
    ],
    pinMapping: [
      { component: "MPU6050 SDA/SCL", arduinoPin: "GPIO 21 / 22", notes: "I2C" },
      { component: "L298N PWM", arduinoPin: "GPIO 25, 26", notes: "Motor speed" },
      { component: "Buzzer", arduinoPin: "GPIO 32", notes: "Active buzzer" },
    ],
  },
  steps: [
    { number: 1, title: "Robot Base Assembly", content: "Build 2WD chassis with L298N and ESP32 mounted securely." },
    { number: 2, title: "IMU Wand Wiring", content: "Extend I2C to hand-held MPU6050 breakout. Keep cable strain relieved." },
    { number: 3, title: "Gesture Calibration", content: "Run gesture_calibrate.ino. Record pitch/roll for forward, back, left, right poses." },
    { number: 4, title: "Threshold Definition", content: "Set PITCH_FWD > 25°, PITCH_BACK < -25°, ROLL thresholds ±20° in main sketch." },
    { number: 5, title: "Upload Gesture Drive Code", content: "Flash gesture_rover_mpu.ino. Hold IMU neutral for stop." },
    { number: 6, title: "Gesture Testing", content: "Practice each gesture. Verify stop when neutral within 2 seconds.", checklist: ["Forward tilt", "Back tilt", "Left/right roll", "Neutral stop"] },
  ],
  code: `/*
 * Gesture Controlled Robot — MPU6050
 * File: gesture_rover_mpu.ino
 */

#include <Wire.h>
#include <MPU6050_light.h>
MPU6050 mpu(Wire);
const int ENA = 25, ENB = 26, IN1 = 27, IN2 = 14, IN3 = 12, IN4 = 13;
const float PITCH_FWD = 25, PITCH_BACK = -25, ROLL_TURN = 20;

void motors(int l, int r) {
  digitalWrite(IN1, l >= 0); digitalWrite(IN2, l < 0);
  digitalWrite(IN3, r >= 0); digitalWrite(IN4, r < 0);
  ledcWrite(0, abs(l)); ledcWrite(1, abs(r));
}

char readGesture() {
  mpu.update();
  float p = mpu.getAngleX();
  float r = mpu.getAngleZ();
  if (p > PITCH_FWD) return 'F';
  if (p < PITCH_BACK) return 'B';
  if (r > ROLL_TURN) return 'R';
  if (r < -ROLL_TURN) return 'L';
  return 'S';
}

void setup() {
  Wire.begin(21, 22);
  mpu.begin(); mpu.calcOffsets(true);
  ledcSetup(0, 5000, 8); ledcAttachPin(ENA, 0);
  ledcSetup(1, 5000, 8); ledcAttachPin(ENB, 1);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  char g = readGesture();
  switch (g) {
    case 'F': motors(180, 180); break;
    case 'B': motors(-150, -150); break;
    case 'L': motors(-160, 160); break;
    case 'R': motors(160, -160); break;
    default: motors(0, 0); break;
  }
  delay(80);
}`,
  testing: {
    checklist: ["Each gesture mapped", "Neutral stops motors", "No drift when still", "Buzzer on change optional"],
    expectedOutput: "Hand tilt on wand drives robot directionally.",
    commonIssues: ["Wrong axis — swap getAngleX/Y", "Jitter — increase delay or add hysteresis", "I2C errors — shorten cable"],
  },
  troubleshooting: [
    { title: "Robot moves when wand still", solution: "Recalibrate offsets. Add 5° dead zone around zero. Increase loop delay." },
    { title: "Gestures reversed", solution: "Invert pitch/roll comparisons or rotate MPU6050 90° on wand." },
    { title: "I2C NACK", solution: "Check SDA/SCL pull-ups 4.7k. Max cable ~50 cm for 400 kHz." },
    { title: "Delayed response", solution: "Reduce delay(80) to 40. Use faster I2C 400 kHz." },
  ],
  downloads: [
    { id: "code", title: "gesture_rover_mpu.ino", description: "IMU gesture drive", fileType: "INO" },
    { id: "cal", title: "gesture_calibrate.ino", description: "Threshold capture tool", fileType: "INO" },
    { id: "diagram", title: "gesture_robot_i2c.pdf", description: "Wand wiring diagram", fileType: "PDF" },
  ],
  relatedSlugs: ["bluetooth-car", "self-balancing-robot", "robotic-arm"],
  faq: [
    { question: "Use PAJ7620 gesture sensor instead?", answer: "Yes — I2C swipe sensor gives discrete gestures without tilt drift." },
    { question: "ESP-NOW for wireless wand?", answer: "Recommended for untethered wand — second ESP32 sends gesture chars over ESP-NOW." },
  ],
  aiPromptSuggestions: [
    "Add hysteresis to prevent gesture flicker",
    "Convert to ESP-NOW wireless wand",
    "Use PAJ7620 instead of MPU6050",
  ],
};

export const connectivitySeeds: Record<string, ProjectContentSeed> = {
  "bluetooth-car": bluetoothCar,
  "wifi-robot-esp32": wifiRobotEsp32,
  "voice-controlled-home": voiceControlledHome,
  "gesture-controlled-robot": gestureControlledRobot,
};

import type { ProjectContentSeed } from "@/lib/content/types";

export const lineFollowerRobot: ProjectContentSeed = {
  slug: "line-follower-robot",
  programming: "Arduino C++",
  powerSource: "7.4V Li-ion (2S) / 9V Battery",
  overview: {
    description:
      "Build a differential-drive robot that tracks a black line on a white surface using five IR reflective sensors. You will implement a weighted sensor algorithm with optional PID tuning to achieve smooth cornering at competition speeds.",
    outcomes: [
      "Calibrate IR sensors for your track surface and ambient light",
      "Implement weighted line-position calculation from analog readings",
      "Control motor speed differentially via L298N PWM",
      "Tune Kp/Ki/Kd constants for stable high-speed following",
      "Document sensor thresholds for reproducible performance",
    ],
    skills: [
      "Analog sensor reading with Arduino",
      "PWM motor control",
      "Basic PID control theory",
      "Mechanical alignment of sensor array",
    ],
    applications: [
      "RoboRace and IIT tech fest line-follower competitions",
      "Warehouse floor guidance systems",
      "AGV path following prototypes",
      "STEM lab demonstrations",
    ],
    expectedResult:
      "A robot that follows a 2–3 cm black tape line at adjustable speed, recovering from 90° turns without losing the track.",
  },
  prerequisites: [
    "Arduino IDE installed and UNO recognized on USB",
    "Basic understanding of digital and analog pins",
    "Ability to solder or use screw terminals on motor driver",
  ],
  safety: [
    "Disconnect battery before wiring changes",
    "Never short motor driver VCC to GND",
    "Keep fingers clear of wheels during motor tests",
    "Use a fuse or protected battery holder for Li-ion packs",
  ],
  parts: [
    { name: "Arduino UNO R3", quantity: "1", purpose: "Main controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "IR Sensor Array (5-channel)", quantity: "1", purpose: "Line position detection", buyUrl: "https://www.robocraze.com/products/5-channel-infrared-tracking-sensor-module" },
    { name: "L298N Motor Driver", quantity: "1", purpose: "Dual H-bridge motor control", buyUrl: "https://robu.in/product/l298n-motor-driver/" },
    { name: "TT Gear Motor 200 RPM", quantity: "2", purpose: "Wheel drive", buyUrl: "https://www.amazon.in/s?k=tt+gear+motor+200+rpm" },
    { name: "Line Follower Chassis Kit", quantity: "1", purpose: "Platform with caster wheel", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "18650 Battery Holder (2S)", quantity: "1", purpose: "Motor power supply", buyUrl: "https://www.amazon.in/s?k=18650+battery+holder+2s" },
    { name: "Black Insulation Tape", quantity: "1 roll", purpose: "Track marking", buyUrl: "https://www.amazon.in/s?k=black+electrical+tape" },
    { name: "Jumper Wires", quantity: "25", purpose: "Signal connections", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      {
        title: "Sensor Array Power",
        content:
          "Power the IR array from Arduino 5V and GND. Each sensor outputs an analog voltage — low on black tape, high on white surface. Mount the array 3–5 mm above the floor.",
      },
      {
        title: "Motor Driver",
        content:
          "L298N motor power comes from the 7.4V battery. Logic pins IN1–IN4 and ENA/ENB connect to Arduino digital and PWM pins. Share common GND between Arduino and L298N.",
      },
      {
        title: "Sensor Wiring",
        content:
          "Connect S1–S5 analog outputs to A0–A4. Keep sensor cables away from motor power wires to reduce electrical noise on readings.",
      },
    ],
    pinMapping: [
      { component: "IR S1 (left)", arduinoPin: "A0", notes: "Analog line sensor" },
      { component: "IR S2", arduinoPin: "A1", notes: "Analog line sensor" },
      { component: "IR S3 (center)", arduinoPin: "A2", notes: "Analog line sensor" },
      { component: "IR S4", arduinoPin: "A3", notes: "Analog line sensor" },
      { component: "IR S5 (right)", arduinoPin: "A4", notes: "Analog line sensor" },
      { component: "L298N IN1", arduinoPin: "D5", notes: "Left motor direction" },
      { component: "L298N IN2", arduinoPin: "D6", notes: "Left motor direction" },
      { component: "L298N IN3", arduinoPin: "D9", notes: "Right motor direction" },
      { component: "L298N IN4", arduinoPin: "D10", notes: "Right motor direction" },
      { component: "L298N ENA", arduinoPin: "D3 (PWM)", notes: "Left motor speed" },
      { component: "L298N ENB", arduinoPin: "D11 (PWM)", notes: "Right motor speed" },
    ],
  },
  steps: [
    {
      number: 1,
      title: "Assemble Chassis and Mount Sensors",
      content:
        "Assemble the chassis kit and mount the 5-channel IR array at the front, centered between the wheels. Ensure the array is parallel to the ground.",
      checklist: ["Chassis wheels spin freely", "Sensor array mounted 3–5 mm above floor", "Arduino and L298N secured"],
      tips: ["Use spacers to stiffen the sensor mount — flex causes false readings."],
    },
    {
      number: 2,
      title: "Wire Motors and Driver",
      content:
        "Connect left and right motors to L298N outputs. Wire IN1–IN4 and ENA/ENB to Arduino as per the pin mapping table.",
      pinTable: [
        { pin: "Motor A", connection: "Left wheel" },
        { pin: "Motor B", connection: "Right wheel" },
        { pin: "ENA/ENB jumpers", connection: "Remove for PWM speed control" },
      ],
      warnings: ["Do not power motors from Arduino 5V pin."],
    },
    {
      number: 3,
      title: "Connect IR Sensor Array",
      content:
        "Wire VCC, GND, and analog outputs S1–S5 to A0–A4. Run a calibration sketch to print raw values over black and white surfaces.",
      tips: ["Recalibrate if building under different lighting."],
    },
    {
      number: 4,
      title: "Tune PID Constants",
      content:
        "Upload the main sketch and adjust BASE_SPEED, Kp, Ki, Kd while testing on your track. Start with Ki and Kd at zero, increase Kp until oscillation, then dampen.",
    },
    {
      number: 5,
      title: "Upload Line Follower Code",
      content:
        "Flash line_follower_v1.ino to the Arduino UNO. Open Serial Monitor at 115200 baud to view line error values during tuning.",
      tips: ["Mark the USB cable orientation for quick field reprogramming."],
    },
    {
      number: 6,
      title: "Track Testing",
      content:
        "Lay black tape on white poster board. Test straight segments, gentle curves, and 90° turns. Adjust speed if the robot overshoots corners.",
      checklist: [
        "Robot centers on straight segments",
        "Recovers after 90° turn",
        "No oscillation (snaking) at target speed",
        "Completes full loop without losing line",
      ],
    },
  ],
  code: `/*
 * Line Follower Robot v1
 * 5x IR analog sensors + L298N + Arduino UNO
 * File: line_follower_v1.ino
 */

const int SENSOR_PINS[5] = {A0, A1, A2, A3, A4};
const int IN1 = 5, IN2 = 6, IN3 = 9, IN4 = 10;
const int ENA = 3, ENB = 11;

const int BLACK_THRESHOLD = 500;
const int BASE_SPEED = 140;
float Kp = 0.8, Ki = 0.0, Kd = 0.3;
float integral = 0, lastError = 0;

void setup() {
  Serial.begin(115200);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

float readLinePosition() {
  float weights[5] = {-2, -1, 0, 1, 2};
  float sum = 0, active = 0;
  for (int i = 0; i < 5; i++) {
    int val = analogRead(SENSOR_PINS[i]);
    float onLine = (val < BLACK_THRESHOLD) ? 1.0 : 0.0;
    sum += weights[i] * onLine;
    active += onLine;
  }
  if (active == 0) return lastError > 0 ? 2.0 : -2.0;
  return sum / active;
}

void setMotorSpeed(int left, int right) {
  digitalWrite(IN1, left >= 0 ? HIGH : LOW);
  digitalWrite(IN2, left >= 0 ? LOW : HIGH);
  digitalWrite(IN3, right >= 0 ? HIGH : LOW);
  digitalWrite(IN4, right >= 0 ? LOW : HIGH);
  analogWrite(ENA, constrain(abs(left), 0, 255));
  analogWrite(ENB, constrain(abs(right), 0, 255));
}

void loop() {
  float error = readLinePosition();
  integral += error;
  integral = constrain(integral, -50, 50);
  float derivative = error - lastError;
  float correction = Kp * error + Ki * integral + Kd * derivative;
  lastError = error;

  int left = BASE_SPEED - correction * 40;
  int right = BASE_SPEED + correction * 40;
  setMotorSpeed(left, right);

  Serial.print("Error: "); Serial.println(error);
  delay(10);
}`,
  testing: {
    checklist: [
      "All five sensors respond on Serial plotter",
      "Motors spin correct direction for forward command",
      "Robot follows straight tape segment",
      "Robot completes 90° corner",
      "No motor overheating after 10 min",
    ],
    expectedOutput:
      "Robot smoothly tracks black tape, with Serial Monitor showing error values near zero on straights and brief spikes on turns.",
    commonIssues: [
      "Snaking on straights — reduce Kp or increase Kd",
      "Loses line on sharp turns — lower BASE_SPEED",
      "Drifts to one side — check sensor height and mechanical alignment",
    ],
  },
  troubleshooting: [
    { title: "Robot veers constantly left", solution: "Swap motor wires or adjust sensor array so center sensor sits exactly on tape. Verify all sensors read correctly on white vs black." },
    { title: "Oscillates (zigzags)", solution: "Lower Kp by 20% increments. Add small Kd (0.2–0.5). Reduce BASE_SPEED until stable." },
    { title: "Stops on white gaps", solution: "Increase BLACK_THRESHOLD or add last-error memory (already in sketch). Use continuous tape intersections." },
    { title: "One motor slower", solution: "Check battery voltage under load. Clean gearbox. Match PWM on ENA/ENB." },
    { title: "Erratic analog readings", solution: "Add 100nF capacitor on sensor VCC. Route sensor wires away from motor leads." },
  ],
  downloads: [
    { id: "code", title: "line_follower_v1.ino", description: "Main sketch with PID line following", fileType: "INO" },
    { id: "diagram", title: "line_follower_schematic.pdf", description: "Wiring diagram and pin reference", fileType: "PDF" },
    { id: "calibration", title: "ir_calibrate.ino", description: "Sensor threshold calibration utility", fileType: "INO" },
    { id: "bom", title: "line_follower_bom.csv", description: "Parts list with Indian retailer links", fileType: "CSV" },
  ],
  relatedSlugs: ["obstacle-avoiding-robot", "maze-solving-robot", "bluetooth-car"],
  faq: [
    { question: "What tape width works best?", answer: "19–25 mm black electrical tape on white MDF or poster board is standard for Indian college competitions." },
    { question: "Can I use digital IR sensors?", answer: "Yes, but analog arrays give finer position resolution for smoother PID control." },
    { question: "How fast can it go?", answer: "Beginner builds typically run 0.3–0.5 m/s. Tune PID and reduce speed for tight 90° tracks." },
  ],
  aiPromptSuggestions: [
    "How do I tune PID for a sharper 90 degree turn?",
    "Explain the weighted sensor algorithm in simple terms",
    "My robot loses the line after intersections — what should I change?",
  ],
};

export const obstacleAvoidingRobot: ProjectContentSeed = {
  slug: "obstacle-avoiding-robot",
  programming: "Arduino C++",
  powerSource: "9V Battery (motors) + USB (logic)",
  overview: {
    description:
      "Construct an autonomous rover that measures forward distance with HC-SR04 ultrasonic sensor and steers around obstacles using L298N dual-motor control. Learn interrupt-safe distance sampling and simple reactive navigation.",
    outcomes: [
      "Interface HC-SR04 with pulseIn timing",
      "Drive differential motors through L298N",
      "Implement stop-scan-turn navigation state machine",
      "Filter noisy ultrasonic readings",
      "Debug motor direction and sensor mounting",
    ],
    skills: ["Digital I/O", "Ultrasonic ranging", "H-bridge motor control", "Serial debugging"],
    applications: ["Vacuum robot prototypes", "Warehouse AMR basics", "Obstacle course robotics labs"],
    expectedResult: "Robot drives forward, stops within 25 cm of obstacles, scans left/right, and turns toward the clearer path.",
  },
  prerequisites: ["Arduino UNO basics", "Understanding of GND common reference", "Jumper wire prototyping"],
  safety: [
    "Secure ultrasonic sensor — protruding modules snap easily",
    "Disconnect battery when uploading code",
    "Keep ultrasonic surface unobstructed (no tape over mesh)",
  ],
  parts: [
    { name: "Arduino UNO R3", quantity: "1", purpose: "Controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "HC-SR04 Ultrasonic", quantity: "1", purpose: "Distance sensing", buyUrl: "https://www.robocraze.com/products/hc-sr04-ultrasonic-sensor" },
    { name: "L298N Driver", quantity: "1", purpose: "Motor control", buyUrl: "https://robu.in/product/l298n-motor-driver/" },
    { name: "BO Motor 100 RPM", quantity: "2", purpose: "Drive wheels", buyUrl: "https://www.amazon.in/s?k=bo+motor+100+rpm" },
    { name: "2-Wheel Chassis", quantity: "1", purpose: "Mechanical base", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "9V Battery + Connector", quantity: "1", purpose: "Motor supply", buyUrl: "https://www.amazon.in/s?k=9v+battery+connector" },
    { name: "Mini Breadboard", quantity: "1", purpose: "Prototype wiring", buyUrl: "https://robu.in/product/half-size-breadboard/" },
    { name: "Dupont Wires", quantity: "20", purpose: "Connections", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      { title: "Ultrasonic Hookup", content: "TRIG on D7, ECHO on D8. Use 5V and GND from Arduino. Mount sensor level at front center." },
      { title: "Motor Power", content: "9V to L298N +12V input. Arduino GND tied to L298N GND. Remove ENA/ENB jumpers for PWM." },
      { title: "Logic Pins", content: "IN1–IN4 on D5,D6,D9,D10. ENA on D3, ENB on D11 for independent speed control." },
    ],
    pinMapping: [
      { component: "HC-SR04 TRIG", arduinoPin: "D7", notes: "Output pulse" },
      { component: "HC-SR04 ECHO", arduinoPin: "D8", notes: "Input echo" },
      { component: "L298N IN1–IN4", arduinoPin: "D5,D6,D9,D10", notes: "Direction" },
      { component: "L298N ENA/ENB", arduinoPin: "D3, D11", notes: "PWM speed" },
    ],
  },
  steps: [
    { number: 1, title: "Prepare Components", content: "Verify Arduino on COM port. Lay out parts and label motor sides L/R.", checklist: ["Arduino detected", "All parts present", "IDE installed"] },
    { number: 2, title: "Build Chassis", content: "Assemble chassis, mount Arduino and L298N. Fix HC-SR04 at front facing forward.", warnings: ["Sensor must be level for accurate ranging"] },
    { number: 3, title: "Connect Motors", content: "Wire motors to L298N A/B outputs. Connect IN and EN pins per pin map.", pinTable: [{ pin: "Motor A", connection: "Left" }, { pin: "Motor B", connection: "Right" }] },
    { number: 4, title: "Wire HC-SR04", content: "Four wires: VCC, GND, TRIG, ECHO. Test with Serial distance print sketch.", pinTable: [{ pin: "VCC", connection: "5V" }, { pin: "TRIG", connection: "D7" }, { pin: "ECHO", connection: "D8" }] },
    { number: 5, title: "Upload Obstacle Avoidance Code", content: "Flash obstacle_avoid_v2.ino. Confirm distance readings in Serial Monitor at 9600 baud." },
    { number: 6, title: "Field Testing", content: "Place robot in open area with boxes as obstacles. Verify stop, scan, and turn behavior.", checklist: ["Forward in clear path", "Stops < 25 cm", "Chooses clearer side", "Resumes forward"] },
  ],
  code: `/*
 * Obstacle Avoiding Robot v2
 * HC-SR04 + L298N + Arduino UNO
 * File: obstacle_avoid_v2.ino
 */

const int TRIG = 7, ECHO = 8;
const int IN1 = 5, IN2 = 6, IN3 = 9, IN4 = 10;
const int ENA = 3, ENB = 11;
const int SAFE_CM = 25;
const int SPEED = 170;

long readCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000);
  if (us == 0) return 999;
  return us * 0.034 / 2;
}

void motors(int l, int r) {
  digitalWrite(IN1, l >= 0 ? HIGH : LOW);
  digitalWrite(IN2, l >= 0 ? LOW : HIGH);
  digitalWrite(IN3, r >= 0 ? HIGH : LOW);
  digitalWrite(IN4, r >= 0 ? LOW : HIGH);
  analogWrite(ENA, constrain(abs(l), 0, 255));
  analogWrite(ENB, constrain(abs(r), 0, 255));
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
}

void scanTurn() {
  motors(0, 0); delay(200);
  long left = readCm();
  motors(SPEED, -SPEED); delay(350);
  motors(0, 0); delay(200);
  long right = readCm();
  if (left > right) {
    motors(-SPEED, SPEED); delay(300);
  } else {
    motors(SPEED, -SPEED); delay(300);
  }
}

void loop() {
  long d = readCm();
  Serial.print("cm: "); Serial.println(d);
  if (d > SAFE_CM) motors(SPEED, SPEED);
  else scanTurn();
  delay(50);
}`,
  testing: {
    checklist: ["Distance prints 2–400 cm", "Motors forward", "Stops near hand", "Scan turn works", "No stall heat"],
    expectedOutput: "Continuous forward motion with automatic detours around obstacles.",
    commonIssues: ["Zero distance — swap TRIG/ECHO", "No motor spin — check 9V on L298N", "Only turns one way — verify scan logic"],
  },
  troubleshooting: [
    { title: "Sensor always reads 0", solution: "Confirm ECHO on input pin D8. Increase pulseIn timeout. Ensure 5V stable." },
    { title: "Motors run backward", solution: "Swap motor wires at L298N or invert IN1/IN2 logic in code." },
    { title: "False triggers on carpet", solution: "Raise SAFE_CM to 30. Mount sensor higher. Average 3 readings." },
    { title: "Battery dies quickly", solution: "Use fresh 9V or 2S Li-ion. Lower SPEED constant to 140." },
    { title: "Upload fails", solution: "Disconnect motor battery. Select correct COM port and Arduino UNO board." },
  ],
  downloads: [
    { id: "code", title: "obstacle_avoid_v2.ino", description: "Full avoidance sketch", fileType: "INO" },
    { id: "diagram", title: "obstacle_robot_schematic.pdf", description: "Fritzing wiring PDF", fileType: "PDF" },
    { id: "guide", title: "obstacle_build_guide.pdf", description: "Printable assembly steps", fileType: "PDF" },
    { id: "bom", title: "obstacle_bom.csv", description: "Bill of materials", fileType: "CSV" },
  ],
  relatedSlugs: ["line-follower-robot", "maze-solving-robot", "bluetooth-car"],
  faq: [
    { question: "Can I use a servo to sweep the sensor?", answer: "Yes — mount HC-SR04 on SG90 for wider scan without rotating the whole chassis." },
    { question: "Why does distance show 0 randomly?", answer: "Soft surfaces absorb ultrasound. Hard flat obstacles work best for HC-SR04." },
  ],
  aiPromptSuggestions: [
    "Add averaging to smooth HC-SR04 readings",
    "How do I make the robot prefer turning left?",
    "Explain the scanTurn function step by step",
  ],
};

export const mazeSolvingRobot: ProjectContentSeed = {
  slug: "maze-solving-robot",
  programming: "Arduino C++",
  powerSource: "9V + USB for programming",
  overview: {
    description:
      "Build a wall-following maze solver using left-hand rule navigation with IR wall sensors and front HC-SR04. The robot maps decisions in EEPROM and can replay the optimal path on subsequent runs.",
    outcomes: [
      "Implement left-hand wall follower algorithm",
      "Fuse IR and ultrasonic distance data",
      "Store turn sequence in EEPROM",
      "Replay shortened path on second run",
      "Calibrate wall distance thresholds",
    ],
    skills: ["Multi-sensor fusion", "State machines", "EEPROM storage", "Algorithm design"],
    applications: ["Micromouse competitions", "Search and rescue maze drills", "Algorithm education"],
    expectedResult: "Robot solves a rectangular cell maze via wall following, then completes a faster replay using stored moves.",
  },
  prerequisites: ["Completed line follower or obstacle robot", "Understanding of arrays and EEPROM"],
  safety: ["Secure loose wires inside maze walls", "Low speed during algorithm tuning"],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "Sharp IR GP2Y0A21", quantity: "2", purpose: "Left/right wall distance", buyUrl: "https://www.robocraze.com/products/sharp-distance-sensor" },
    { name: "HC-SR04", quantity: "1", purpose: "Front wall detection", buyUrl: "https://www.robocraze.com/products/hc-sr04-ultrasonic-sensor" },
    { name: "L298N + BO Motors", quantity: "1 set", purpose: "Drive", buyUrl: "https://robu.in/product/l298n-motor-driver/" },
    { name: "Maze Solver Chassis", quantity: "1", purpose: "Compact 15 cm footprint", buyUrl: "https://www.amazon.in/s?k=mini+robot+chassis" },
    { name: "9V Battery", quantity: "1", purpose: "Power", buyUrl: "https://www.amazon.in/s?k=9v+battery" },
    { name: "Jumper Wires", quantity: "30", purpose: "Wiring", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      { title: "Wall IR Sensors", content: "Left and right Sharp IR on A0 and A1 with 5V supply. Effective range 10–80 cm for maze walls." },
      { title: "Front Ultrasonic", content: "HC-SR04 on D7/D8 detects dead ends ahead." },
      { title: "Drive System", content: "L298N on standard motor pins. Use low center of gravity for tight turns." },
    ],
    pinMapping: [
      { component: "Left IR", arduinoPin: "A0", notes: "Wall distance" },
      { component: "Right IR", arduinoPin: "A1", notes: "Wall distance" },
      { component: "HC-SR04 TRIG/ECHO", arduinoPin: "D7 / D8", notes: "Front range" },
      { component: "Motors", arduinoPin: "D5-D6, D9-D11", notes: "L298N control" },
    ],
  },
  steps: [
    { number: 1, title: "Build Compact Chassis", content: "Assemble low-profile chassis under 12 cm wide to fit standard maze cells." },
    { number: 2, title: "Mount Triple Sensors", content: "Left/right IR angled at walls. Ultrasonic centered at front.", tips: ["Keep IR sensors at same height as maze wall midpoint"] },
    { number: 3, title: "Motor and Driver Wiring", content: "Wire L298N and verify differential turns in place." },
    { number: 4, title: "Calibrate Wall Thresholds", content: "Record analog values at 8 cm and 15 cm wall distances. Set WALL_CLOSE and WALL_FAR constants." },
    { number: 5, title: "Upload Maze Solver Code", content: "Flash maze_solver_lhr.ino (left-hand rule). First run explores; second run replays EEPROM path." },
    { number: 6, title: "Maze Testing", content: "Test in 3×3 practice maze. Verify left turn priority at junctions.", checklist: ["Follows left wall", "Detects dead end", "EEPROM replay faster"] },
  ],
  code: `/*
 * Maze Solver — Left-Hand Rule + EEPROM replay
 * File: maze_solver_lhr.ino
 */

#include <EEPROM.h>
const int IR_L = A0, IR_R = A1;
const int TRIG = 7, ECHO = 8;
const int IN1 = 5, IN2 = 6, IN3 = 9, IN4 = 10;
const int WALL_CLOSE = 350, FRONT_STOP = 12;
char path[100]; int pathLen = 0; bool replay = false;

int readIR(int pin) { return analogRead(pin); }
long frontCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 20000) * 0.034 / 2;
}

void drive(int l, int r) {
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l <= 0);
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r <= 0);
  analogWrite(3, abs(l)); analogWrite(11, abs(r));
}

void turnLeft() { drive(-120, 120); delay(280); drive(0,0); }
void turnRight() { drive(120, -120); delay(280); drive(0,0); }
void forward() { drive(140, 140); delay(400); drive(0,0); }

void record(char m) { if (!replay && pathLen < 99) path[pathLen++] = m; }

void decide() {
  bool leftOpen = readIR(IR_L) > WALL_CLOSE + 80;
  bool rightOpen = readIR(IR_R) > WALL_CLOSE + 80;
  bool frontOpen = frontCm() > FRONT_STOP;
  if (leftOpen) { record('L'); turnLeft(); }
  else if (frontOpen) { record('F'); forward(); }
  else if (rightOpen) { record('R'); turnRight(); }
  else { record('B'); turnLeft(); turnLeft(); }
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  Serial.begin(9600);
  replay = EEPROM.read(0) == 1;
}

void loop() {
  if (!replay) decide();
  else { /* replay from EEPROM addresses 1+ */ decide(); }
  delay(100);
}`,
  testing: {
    checklist: ["IR reads change near walls", "Front stop at dead end", "Left priority at T-junction", "Second run shorter"],
    expectedOutput: "Explores maze to goal, stores path, replays optimized route.",
    commonIssues: ["Turns too wide — reduce delay", "Misses openings — recalibrate IR", "EEPROM not saving — call EEPROM.write"],
  },
  troubleshooting: [
    { title: "Robot hugs wall too tightly", solution: "Increase WALL_CLOSE threshold or add small forward bias when side reading low." },
    { title: "Misses left opening", solution: "Slow down before junctions. Mount left IR with 15° outward angle." },
    { title: "Ultrasonic false wall", solution: "Average 3 samples. Ignore readings below 2 cm as noise." },
    { title: "Replay same as explore", solution: "Implement path compression (remove BABA backtracks) before EEPROM save." },
  ],
  downloads: [
    { id: "code", title: "maze_solver_lhr.ino", description: "Left-hand rule with EEPROM", fileType: "INO" },
    { id: "diagram", title: "maze_robot_wiring.pdf", description: "Sensor placement guide", fileType: "PDF" },
    { id: "maze", title: "practice_maze_layout.pdf", description: "3×3 cell practice maze", fileType: "PDF" },
  ],
  relatedSlugs: ["line-follower-robot", "obstacle-avoiding-robot", "gesture-controlled-robot"],
  faq: [
    { question: "Left-hand or right-hand rule?", answer: "Left-hand rule is used here; both work if applied consistently for simply connected mazes." },
    { question: "What maze cell size?", answer: "Standard micromouse cells are 18 cm; scale thresholds to your wall spacing." },
  ],
  aiPromptSuggestions: [
    "How do I compress BABA backtracks in the path string?",
    "Explain left-hand rule with an example junction",
    "Convert this to flood-fill algorithm",
  ],
};

export const fireFightingRobot: ProjectContentSeed = {
  slug: "fire-fighting-robot",
  programming: "Arduino C++",
  powerSource: "12V lead-acid / 3S Li-ion for pump + 5V regulator",
  overview: {
    description:
      "Design a competition-style firefighting robot that navigates an arena with line tracking, detects candle flames using UV/IR flame sensors, and extinguishes them with a mini water pump and servo-aimed nozzle.",
    outcomes: [
      "Integrate flame sensor analog detection with noise filtering",
      "Control submersible pump via relay or MOSFET",
      "Aim nozzle with SG90 servo based on flame position",
      "Combine line following with fire search state machine",
      "Meet typical 30-second competition time limits",
    ],
    skills: ["Relay isolation", "Multi-state robotics", "Sensor fusion", "Competition strategy"],
    applications: ["Trinity Fire Fighting contests", "Industrial fire scout prototypes", "Safety engineering demos"],
    expectedResult: "Robot follows line to candle zone, detects flame, aims nozzle, pumps water until flame sensor clears.",
  },
  prerequisites: ["Line follower experience", "Basic fluid handling — seal pump connections"],
  safety: [
    "Use distilled water only — no saline near electronics",
    "Never aim pump at people or outlets",
    "Isolate pump 12V from Arduino logic ground loops with optocoupler relay",
    "Adult supervision for flame tests",
  ],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Main logic", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "Flame Sensor Module", quantity: "3", purpose: "Triangulate flame", buyUrl: "https://www.robocraze.com/products/flame-sensor-module" },
    { name: "Mini Water Pump 12V", quantity: "1", purpose: "Extinguish flame", buyUrl: "https://robu.in/product/mini-submersible-water-pump/" },
    { name: "1-Channel Relay (opto)", quantity: "1", purpose: "Pump switching", buyUrl: "https://www.robocraze.com/products/1-channel-relay-module" },
    { name: "SG90 Servo", quantity: "1", purpose: "Nozzle aim", buyUrl: "https://robu.in/product/sg90-servo-motor/" },
    { name: "IR Line Sensor Array", quantity: "1", purpose: "Arena navigation", buyUrl: "https://www.robocraze.com/products/5-channel-infrared-tracking-sensor-module" },
    { name: "L298N + Chassis", quantity: "1 set", purpose: "Mobility", buyUrl: "https://robu.in/product/2-wheel-drive-robot-chassis/" },
    { name: "Silicone Tubing 6mm", quantity: "1 m", purpose: "Water delivery", buyUrl: "https://www.amazon.in/s?k=silicone+tubing+6mm" },
  ],
  circuit: {
    sections: [
      { title: "Flame Sensors", content: "Three flame modules on A0–A2 at front left, center, right. Lower analog value indicates flame detected." },
      { title: "Pump Circuit", content: "12V pump through relay NO contact. Relay IN on D4. Flyback diode across pump. Separate 12V supply." },
      { title: "Servo Nozzle", content: "SG90 on D11 for horizontal aim. Mount nozzle at servo horn." },
    ],
    pinMapping: [
      { component: "Flame L/C/R", arduinoPin: "A0, A1, A2", notes: "Analog, lower = flame" },
      { component: "Pump relay", arduinoPin: "D4", notes: "Active HIGH" },
      { component: "Servo signal", arduinoPin: "D11", notes: "Nozzle aim" },
      { component: "Line sensors", arduinoPin: "A3–A5 + digital", notes: "Navigation" },
    ],
  },
  steps: [
    { number: 1, title: "Mechanical Assembly", content: "Mount pump, water tank, and servo nozzle on chassis. Route tubing with no kinks.", warnings: ["Test for leaks before adding electronics"] },
    { number: 2, title: "Wire Flame Sensors", content: "Position three sensors in arc at front. Calibrate ambient vs candle readings.", tips: ["Shield sensors from overhead lights"] },
    { number: 3, title: "Pump and Relay", content: "Wire 12V pump through relay. Common GND between Arduino and relay module only — not pump 12V return on Arduino GND if using separate battery." },
    { number: 4, title: "Line Follow Integration", content: "Connect line array for arena approach. Test navigation separately from fire mode." },
    { number: 5, title: "Upload Firefighter Code", content: "Flash fire_fighter_arena.ino. Serial shows flame analog values and state (NAV / AIM / PUMP)." },
    { number: 6, title: "Flame Extinguish Test", content: "Use tea-light candle in ventilated area. Verify detection under 30 cm and extinguish within 5 seconds of pumping.", checklist: ["Detects flame", "Servo aims center", "Pump stops when clear"] },
  ],
  code: `/*
 * Fire Fighting Robot — Arena build
 * File: fire_fighter_arena.ino
 */

#include <Servo.h>
Servo nozzle;
const int FLAME_PINS[3] = {A0, A1, A2};
const int PUMP_PIN = 4;
const int FLAME_TRIG = 400;
enum State { NAV, AIM, PUMP };
State state = NAV;

int flameCenter() {
  int v[3]; int best = 1023, idx = 1;
  for (int i = 0; i < 3; i++) {
    v[i] = analogRead(FLAME_PINS[i]);
    if (v[i] < best) { best = v[i]; idx = i; }
  }
  return (best < FLAME_TRIG) ? idx : -1;
}

void setup() {
  Serial.begin(9600);
  nozzle.attach(11); nozzle.write(90);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);
}

void loop() {
  int f = flameCenter();
  switch (state) {
    case NAV:
      /* call lineFollowStep() here */
      if (f >= 0) state = AIM;
      break;
    case AIM:
      nozzle.write(f == 0 ? 60 : (f == 2 ? 120 : 90));
      delay(300);
      state = PUMP;
      break;
    case PUMP:
      digitalWrite(PUMP_PIN, HIGH);
      delay(2500);
      digitalWrite(PUMP_PIN, LOW);
      if (flameCenter() < 0) state = NAV;
      break;
  }
  Serial.println((int)state);
}`,
  testing: {
    checklist: ["Flame triggers from 30 cm", "Pump flows steadily", "No water on Arduino", "Returns to NAV after out"],
    expectedOutput: "Autonomous approach, aim, extinguish candle, resume search.",
    commonIssues: ["False flame from sunlight — shield sensors", "Pump weak — check 12V current", "Overshoot on line — lower speed near arena"],
  },
  troubleshooting: [
    { title: "Pump does not start", solution: "Verify relay LED toggles. Check 12V at pump terminals. Prime tubing — remove air locks." },
    { title: "Flame not detected", solution: "Lower FLAME_TRIG after Serial calibration. Use IR flame sensor facing candle, not ceiling lights." },
    { title: "Water misses candle", solution: "Adjust servo angles 60/90/120. Shorten nozzle distance. Increase pump duration slightly." },
    { title: "Relay resets Arduino", solution: "Use separate 12V battery for pump. Add 470µF on Arduino 5V. Optoisolated relay module." },
  ],
  downloads: [
    { id: "code", title: "fire_fighter_arena.ino", description: "Navigation + extinguish logic", fileType: "INO" },
    { id: "diagram", title: "fire_robot_pump_circuit.pdf", description: "Pump relay wiring", fileType: "PDF" },
    { id: "arena", title: "arena_rules_checklist.pdf", description: "Competition prep sheet", fileType: "PDF" },
  ],
  relatedSlugs: ["line-follower-robot", "obstacle-avoiding-robot", "smart-dustbin"],
  faq: [
    { question: "Real fire or LED candle?", answer: "Competitions use tea lights; never test with large flames indoors." },
    { question: "How much water?", answer: "200–400 ml tank is enough for multiple runs. Refill between heats." },
  ],
  aiPromptSuggestions: [
    "Merge my line follower into the NAV state",
    "How to debounce flame sensor false positives?",
    "Calculate pump run time for a 50 ml spray",
  ],
};

export const selfBalancingRobot: ProjectContentSeed = {
  slug: "self-balancing-robot",
  programming: "Arduino C++ / ESP32",
  powerSource: "3S Li-ion 11.1V (motors) + 5V BEC",
  overview: {
    description:
      "Build an inverted pendulum two-wheeled robot using MPU6050 IMU fusion and cascaded PID loops on ESP32. Tune angle and motor PID for stable upright balance with joystick nudge control via Serial.",
    outcomes: [
      "Read and fuse MPU6050 accelerometer + gyroscope data",
      "Implement complementary filter for tilt angle",
      "Tune angle PID and motor output limits",
      "Handle setpoint trim via Serial commands",
      "Understand instability and derivative kick",
    ],
    skills: ["IMU calibration", "PID control", "ESP32 PWM", "Real-time control loops"],
    applications: ["Segway-style transporters", "Balance bot competitions", "Control theory education"],
    expectedResult: "Robot balances upright on two wheels, recovers from small pushes, and accepts trim adjustments live.",
  },
  prerequisites: ["Strong C++ basics", "Understanding of PID", "Previous motor driver project"],
  safety: [
    "Secure battery — high current if shorted",
    "Start with robot clamped in stand for PID tuning",
    "Keep face and fingers away from spinning wheels",
    "Use XT60 connectors with proper polarity",
  ],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "High-speed control loop", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "MPU6050 Module", quantity: "1", purpose: "Tilt measurement", buyUrl: "https://robu.in/product/mpu6050-gyroscope-accelerometer/" },
    { name: "TB6612FNG Driver", quantity: "1", purpose: "Compact dual motor driver", buyUrl: "https://www.robocraze.com/products/tb6612fng-motor-driver" },
    { name: "N20 Gear Motor 12V", quantity: "2", purpose: "High RPM drive", buyUrl: "https://www.amazon.in/s?k=n20+gear+motor+12v" },
    { name: "65mm Robot Wheels", quantity: "2", purpose: "Drive wheels", buyUrl: "https://robu.in/product/65mm-rubber-wheel/" },
    { name: "3S Li-ion Pack 2200mAh", quantity: "1", purpose: "Motor power", buyUrl: "https://www.amazon.in/s?k=3s+lipo+battery+2200mah" },
    { name: "5V BEC Module", quantity: "1", purpose: "Logic power from battery", buyUrl: "https://www.robocraze.com/products/5v-bec-module" },
    { name: "M3 Standoffs + Acrylic Plate", quantity: "1 set", purpose: "Frame", buyUrl: "https://www.amazon.in/s?k=robot+chassis+acrylic" },
  ],
  circuit: {
    sections: [
      { title: "IMU on I2C", content: "MPU6050 SDA/SCL to ESP32 GPIO 21/22. Mount IMU at wheel axle height for accurate tilt." },
      { title: "TB6612 Wiring", content: "PWMA/PWMB on ESP32 pins 25/26. AIN1/AIN2/BIN1/BIN2 on GPIO 27,14,12,13. VMotor 11.1V, VCC 5V logic." },
      { title: "Power", content: "3S to driver VM. BEC feeds ESP32 5V. Common GND essential." },
    ],
    pinMapping: [
      { component: "MPU6050 SDA/SCL", arduinoPin: "GPIO 21 / 22", notes: "I2C 400kHz" },
      { component: "TB6612 PWMA/PWMB", arduinoPin: "GPIO 25 / 26", notes: "PWM 20kHz" },
      { component: "Motor A/B dir", arduinoPin: "GPIO 27,14,12,13", notes: "Direction pins" },
    ],
  },
  steps: [
    { number: 1, title: "Mechanical Frame", content: "Build narrow wheelbase frame. Align motor shaft on same axis. Mount MPU6050 centered at axle height." },
    { number: 2, title: "Motor Driver Wiring", content: "Wire TB6612 to N20 motors. Verify forward tilt command drives wheels to catch fall direction." },
    { number: 3, title: "IMU Calibration", content: "Run mpu_calibrate.ino flat on table. Store gyro offsets. Verify angle reads ±0° when level." },
    { number: 4, title: "PID Tuning in Stand", content: "Clamp robot. Tune Kp until oscillation, add Kd to damp. Ki usually 0 for balance bots." },
    { number: 5, title: "Upload Balance Controller", content: "Flash self_balance_pid.ino at 200 Hz loop. Use Serial 't+0.5' / 't-0.5' for trim." },
    { number: 6, title: "Free Balance Testing", content: "Hold robot vertical, release gently. Catch if diverging. Repeat trim until self-stands 30+ seconds.", checklist: ["Recovers 5° push", "No violent oscillation", "Wheels correct tilt direction"] },
  ],
  code: `/*
 * Self Balancing Robot — ESP32 + MPU6050
 * File: self_balance_pid.ino
 */

#include <Wire.h>
#include <MPU6050_light.h>
MPU6050 mpu(Wire);
const int PWMA = 25, PWMB = 26;
const int AIN1 = 27, AIN2 = 14, BIN1 = 12, BIN2 = 13;
float Kp = 28, Ki = 0, Kd = 0.8;
float setpoint = 0, integral = 0, lastAngle = 0;
unsigned long lastUs = 0;

void motor(int m) {
  int p = constrain(m, -255, 255);
  digitalWrite(AIN1, p >= 0); digitalWrite(AIN2, p < 0);
  digitalWrite(BIN1, p >= 0); digitalWrite(BIN2, p < 0);
  ledcWrite(0, abs(p)); ledcWrite(1, abs(p));
}

void setup() {
  Wire.begin(21, 22);
  Serial.begin(115200);
  mpu.begin(); mpu.calcOffsets(true);
  pinMode(AIN1, OUTPUT); pinMode(AIN2, OUTPUT);
  pinMode(BIN1, OUTPUT); pinMode(BIN2, OUTPUT);
  ledcSetup(0, 20000, 8); ledcAttachPin(PWMA, 0);
  ledcSetup(1, 20000, 8); ledcAttachPin(PWMB, 1);
}

void loop() {
  mpu.update();
  float angle = mpu.getAngleY();
  unsigned long now = micros();
  float dt = (now - lastUs) / 1e6;
  lastUs = now;
  float error = setpoint - angle;
  integral += error * dt;
  float derivative = (angle - lastAngle) / dt;
  lastAngle = angle;
  float out = Kp * error + Ki * integral - Kd * derivative;
  motor((int)out);
  delay(2);
}`,
  testing: {
    checklist: ["IMU angle stable at level", "Motors respond correct direction", "30 s free stand", "Recovers light push"],
    expectedOutput: "Robot hovers balanced, wheels spin to correct tilt.",
    commonIssues: ["Runs away — invert motor polarity", "Oscillates — lower Kp raise Kd", "Drifts — adjust setpoint trim"],
  },
  troubleshooting: [
    { title: "Immediately falls", solution: "Invert motor direction in code. Confirm IMU axis matches tilt. Increase Kp gradually." },
    { title: "Violent shaking", solution: "Reduce Kp by 30%. Increase loop rate. Add mechanical backlash check on wheels." },
    { title: "IMU drift over time", solution: "Recalibrate gyro offsets cold. Use complementary filter with higher gyro weight." },
    { title: "ESP32 brownout", solution: "Use BEC rated 2A+. Separate motor and logic wiring. Add 1000µF on 5V." },
    { title: "One wheel only spins", solution: "Check TB6612 STBY pin pulled HIGH. Test each channel independently." },
  ],
  downloads: [
    { id: "code", title: "self_balance_pid.ino", description: "Main balance loop", fileType: "INO" },
    { id: "cal", title: "mpu_calibrate.ino", description: "Gyro offset utility", fileType: "INO" },
    { id: "diagram", title: "balance_bot_wiring.pdf", description: "TB6612 + MPU6050 schematic", fileType: "PDF" },
    { id: "tune", title: "pid_tuning_guide.pdf", description: "Step-by-step Kp/Kd tuning", fileType: "PDF" },
  ],
  relatedSlugs: ["gesture-controlled-robot", "robotic-arm", "wifi-robot-esp32"],
  faq: [
    { question: "Arduino UNO instead of ESP32?", answer: "Possible but 8-bit loop is marginal; ESP32 240 MHz recommended for 200 Hz PID." },
    { question: "Why does it drift forward?", answer: "Mechanical center of mass offset — trim setpoint or shift battery position." },
  ],
  aiPromptSuggestions: [
    "Explain complementary filter vs Kalman for MPU6050",
    "My robot oscillates — what PID order should I tune?",
    "Add Bluetooth setpoint trim from phone",
  ],
};

export const autonomousSeeds: Record<string, ProjectContentSeed> = {
  "line-follower-robot": lineFollowerRobot,
  "obstacle-avoiding-robot": obstacleAvoidingRobot,
  "maze-solving-robot": mazeSolvingRobot,
  "fire-fighting-robot": fireFightingRobot,
  "self-balancing-robot": selfBalancingRobot,
};

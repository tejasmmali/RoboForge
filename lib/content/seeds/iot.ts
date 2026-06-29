import type { ProjectContentSeed } from "@/lib/content/types";

export const smartDustbin: ProjectContentSeed = {
  slug: "smart-dustbin",
  programming: "Arduino C++",
  powerSource: "5V 2A adapter / 4×AA battery pack",
  overview: {
    description:
      "Build a touchless dustbin that opens its lid automatically when you approach. Use HC-SR04 to detect hand proximity and an SG90 servo to lift the lid — a practical intro to automation and servo control.",
    outcomes: [
      "Measure proximity with ultrasonic sensor",
      "Control SG90 servo sweep angles for lid open/close",
      "Add debounce and minimum open duration",
      "Mount mechanics on standard pedal bin",
      "Tune detection range for Indian kitchen use",
    ],
    skills: ["Servo PWM", "Ultrasonic ranging", "Mechanical linkage design", "Power budgeting"],
    applications: ["Hygiene-focused bins", "Hospital waste lids", "IoT waste level monitoring extension"],
    expectedResult: "Hand within 15 cm triggers lid to open 90° for 3 seconds, then closes smoothly.",
  },
  prerequisites: ["Arduino UNO setup", "Basic soldering for servo horn linkage"],
  safety: ["Keep electronics away from liquid waste", "Don't block sensor with wet hands dripping"],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "HC-SR04", quantity: "1", purpose: "Proximity detect", buyUrl: "https://www.robocraze.com/products/hc-sr04-ultrasonic-sensor" },
    { name: "SG90 Servo", quantity: "1", purpose: "Lid actuator", buyUrl: "https://robu.in/product/sg90-servo-motor/" },
    { name: "Pedal Bin 10L", quantity: "1", purpose: "Mechanical base", buyUrl: "https://www.amazon.in/s?k=pedal+dustbin+10l" },
    { name: "5V 2A Adapter", quantity: "1", purpose: "Servo power", buyUrl: "https://www.amazon.in/s?k=5v+2a+adapter" },
    { name: "Acrylic Lid Bracket", quantity: "1", purpose: "Servo linkage", buyUrl: "https://www.amazon.in/s?k=acrylic+sheet+a4" },
    { name: "Jumper Wires", quantity: "10", purpose: "Connections", buyUrl: "https://www.robocraze.com/products/jumper-wires" },
  ],
  circuit: {
    sections: [
      { title: "Ultrasonic", content: "HC-SR04 on D7/D8 facing upward at lid opening. Detect hand approach from 5–30 cm." },
      { title: "Servo Power", content: "Servo on D9. Power servo from 5V adapter — not Arduino 5V pin for torque reliability." },
      { title: "Shared GND", content: "Arduino GND, adapter GND, and sensor GND tied together." },
    ],
    pinMapping: [
      { component: "HC-SR04 TRIG/ECHO", arduinoPin: "D7 / D8", notes: "Ultrasonic" },
      { component: "SG90 signal", arduinoPin: "D9", notes: "Servo PWM" },
    ],
  },
  steps: [
    { number: 1, title: "Mount Servo Linkage", content: "Fabricate horn arm to lift lid. Test 0° closed and 90° open without binding." },
    { number: 2, title: "Install Ultrasonic", content: "Mount sensor under lid rim pointing outward/down at approach zone." },
    { number: 3, title: "Wire Circuit", content: "Connect sensor and servo. Use external 5V for servo red wire." },
    { number: 4, title: "Calibrate Range", content: "Set OPEN_CM = 15 in sketch. Test false triggers from walls." },
    { number: 5, title: "Upload Smart Dustbin Code", content: "Flash smart_dustbin_v1.ino. Adjust LID_OPEN_ANGLE if needed." },
    { number: 6, title: "User Testing", content: "Verify open duration, close speed, and no pinch on fingers.", checklist: ["Opens at 15 cm", "Auto-closes", "No chatter", "Servo not overheating"] },
  ],
  code: `/*
 * Smart Dustbin — HC-SR04 + SG90
 * File: smart_dustbin_v1.ino
 */

#include <Servo.h>
Servo lid;
const int TRIG = 7, ECHO = 8;
const int OPEN_CM = 15;
const int LID_CLOSED = 10, LID_OPEN = 95;
unsigned long openUntil = 0;

long distanceCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 20000) * 0.034 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  lid.attach(9);
  lid.write(LID_CLOSED);
  Serial.begin(9600);
}

void loop() {
  long d = distanceCm();
  if (d > 0 && d < OPEN_CM) openUntil = millis() + 3000;
  if (millis() < openUntil) lid.write(LID_OPEN);
  else lid.write(LID_CLOSED);
  delay(50);
}`,
  testing: {
    checklist: ["Opens on hand wave", "Stays open 3 s", "Closes fully", "No false opens from distance"],
    expectedOutput: "Touchless lid operation with smooth servo motion.",
    commonIssues: ["Servo buzz — separate 5V 2A supply", "Opens randomly — raise OPEN_CM threshold", "Weak lift — shorten linkage arm"],
  },
  troubleshooting: [
    { title: "Servo jitters at rest", solution: "detach() after write when closed, or use metal gear MG90S. Add 470µF on 5V." },
    { title: "Lid doesn't open fully", solution: "Increase LID_OPEN angle to 100. Check mechanical binding. Use higher torque servo." },
    { title: "Sensor false triggers", solution: "Require 3 consecutive readings below threshold. Angle sensor away from walls." },
    { title: "Arduino resets on open", solution: "Power servo from external 5V 2A — never from Arduino 5V pin." },
  ],
  downloads: [
    { id: "code", title: "smart_dustbin_v1.ino", description: "Proximity lid control", fileType: "INO" },
    { id: "diagram", title: "smart_dustbin_wiring.pdf", description: "Sensor and servo layout", fileType: "PDF" },
    { id: "cad", title: "lid_bracket_template.pdf", description: "Servo bracket cut pattern", fileType: "PDF" },
  ],
  relatedSlugs: ["rfid-door-lock", "voice-controlled-home", "smart-parking-system"],
  faq: [
    { question: "Add fill-level sensor?", answer: "Add second HC-SR04 pointing down into bin — alert via buzzer when >80% full." },
    { question: "Battery portable version?", answer: "Use 4×AA pack with 5V boost — expect 1–2 weeks with sleep mode between triggers." },
  ],
  aiPromptSuggestions: [
    "Add OLED showing fill percentage",
    "Implement sleep mode to save battery",
    "Why does my servo buzz when holding lid open?",
  ],
};

export const iotWeatherStation: ProjectContentSeed = {
  slug: "iot-weather-station",
  programming: "Arduino C++ (ESP32) + MQTT",
  powerSource: "5V USB / 18650 with solar panel (optional)",
  overview: {
    description:
      "Deploy a Wi-Fi weather node with DHT22 temperature/humidity sensor on ESP32. Publish readings to a public MQTT broker (or HiveMQ Cloud) and visualize on a Node-RED or RoboForge dashboard every 30 seconds.",
    outcomes: [
      "Read DHT22 with error handling",
      "Connect ESP32 to Wi-Fi and MQTT broker",
      "Publish JSON telemetry topics",
      "Handle reconnection on network drop",
      "Calibrate humidity offset for your enclosure",
    ],
    skills: ["MQTT pub/sub", "ESP32 Wi-Fi", "Sensor drivers", "JSON payloads"],
    applications: ["Balcony weather logging", "Greenhouse monitoring", "School science stations"],
    expectedResult: "Live temperature and humidity appear on MQTT dashboard within 30 s of power-on.",
  },
  prerequisites: ["Wi-Fi network", "Free HiveMQ or Mosquitto broker account"],
  safety: ["DHT22 not waterproof — use Stevenson screen outdoors"],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Wi-Fi MCU", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "DHT22 AM2302", quantity: "1", purpose: "Temp + humidity", buyUrl: "https://robu.in/product/dht22-temperature-humidity-sensor/" },
    { name: "10k Pull-up Resistor", quantity: "1", purpose: "DHT data line", buyUrl: "https://www.robocraze.com/products/resistor-kit" },
    { name: "OLED 0.96\" SSD1306", quantity: "1", purpose: "Local display", buyUrl: "https://robu.in/product/0-96-inch-oled-display/" },
    { name: "Breadboard + Wires", quantity: "1 set", purpose: "Prototype", buyUrl: "https://robu.in/product/half-size-breadboard/" },
    { name: "USB Cable", quantity: "1", purpose: "Power/program", buyUrl: "https://www.amazon.in/s?k=micro+usb+cable" },
  ],
  circuit: {
    sections: [
      { title: "DHT22", content: "Data on GPIO 4 with 10k pull-up to 3.3V. VCC 3.3V recommended for ESP32." },
      { title: "OLED I2C", content: "SDA GPIO 21, SCL GPIO 22 for local readout before cloud sync." },
      { title: "MQTT", content: "Broker broker.hivemq.com port 1883 for testing — use TLS in production." },
    ],
    pinMapping: [
      { component: "DHT22 data", arduinoPin: "GPIO 4", notes: "With 10k pull-up" },
      { component: "OLED SDA/SCL", arduinoPin: "GPIO 21 / 22", notes: "I2C address 0x3C" },
    ],
  },
  steps: [
    { number: 1, title: "Sensor Bench Test", content: "Wire DHT22 on breadboard. Run DHTtester example — verify sane readings." },
    { number: 2, title: "Add OLED Display", content: "Show temp/humidity locally on 0.96\" SSD1306 via U8g2 or Adafruit library." },
    { number: 3, title: "Wi-Fi Connection", content: "Add SSID/password. Confirm Serial prints IP address on boot." },
    { number: 4, title: "MQTT Publish", content: "Publish to topic roboforge/weather/station1 with JSON payload." },
    { number: 5, title: "Upload Weather Station Code", content: "Flash iot_weather_mqtt.ino. Subscribe with MQTT Explorer to verify." },
    { number: 6, title: "Dashboard Hookup", content: "Import Node-RED flow or use HiveMQ web client. Confirm 30 s interval updates.", checklist: ["DHT reads OK", "MQTT connected", "OLED matches cloud", "Reconnect works"] },
  ],
  code: `/*
 * IoT Weather Station — ESP32 + DHT22 + MQTT
 * File: iot_weather_mqtt.ino
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#define DHT_PIN 4
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient mqtt(espClient);
const char* ssid = "YourSSID";
const char* pass = "YourPassword";
const char* topic = "roboforge/weather/station1";

void reconnect() {
  while (!mqtt.connected()) {
    if (mqtt.connect("esp32-weather")) mqtt.publish(topic, "online");
    delay(2000);
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  mqtt.setServer("broker.hivemq.com", 1883);
}

void loop() {
  if (!mqtt.connected()) reconnect();
  mqtt.loop();
  static unsigned long last = 0;
  if (millis() - last > 30000) {
    last = millis();
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (!isnan(t)) {
      char buf[64];
      snprintf(buf, sizeof(buf), "{\"temp\":%.1f,\"hum\":%.1f}", t, h);
      mqtt.publish(topic, buf);
    }
  }
}`,
  testing: {
    checklist: ["DHT valid readings", "Wi-Fi connects <30s", "MQTT publish visible", "OLED updates", "Survives router reboot"],
    expectedOutput: "JSON telemetry every 30 s on MQTT topic.",
    commonIssues: ["DHT nan — add delay between reads", "MQTT disconnect — mqtt.loop() in loop", "High humidity — ventilate enclosure"],
  },
  troubleshooting: [
    { title: "DHT returns NaN", solution: "Wait 2 s between reads. Check 10k pull-up. Use 3.3V not 5V on ESP32." },
    { title: "MQTT won't connect", solution: "Verify broker host/port. ESP32 needs internet DNS. Try IP 1.1.1.1." },
    { title: "Humidity reads 99%", solution: "Sensor saturation — improve ventilation. Apply -5% calibration offset." },
    { title: "Wi-Fi drops overnight", solution: "Enable WiFi.setAutoReconnect(true). esp_wifi_set_ps(WIFI_PS_NONE)." },
  ],
  downloads: [
    { id: "code", title: "iot_weather_mqtt.ino", description: "ESP32 MQTT weather node", fileType: "INO" },
    { id: "nodered", title: "weather_dashboard_flow.json", description: "Node-RED import file", fileType: "JSON" },
    { id: "diagram", title: "weather_station_wiring.pdf", description: "DHT22 + OLED schematic", fileType: "PDF" },
  ],
  relatedSlugs: ["smart-agriculture", "solar-tracking-system", "voice-controlled-home"],
  faq: [
    { question: "Add BMP280 pressure?", answer: "Yes — I2C BMP280 on same bus extends payload with barometric pressure." },
    { question: "Free MQTT broker limits?", answer: "HiveMQ public broker is for testing only — use HiveMQ Cloud free tier for projects." },
  ],
  aiPromptSuggestions: [
    "Add BMP280 pressure to the JSON payload",
    "Store readings to SPIFFS when Wi-Fi down",
    "Explain MQTT topic naming best practices",
  ],
};

export const smartAgriculture: ProjectContentSeed = {
  slug: "smart-agriculture",
  programming: "Arduino C++ (ESP32)",
  powerSource: "5V solar panel + 18650 charger / mains adapter",
  overview: {
    description:
      "Monitor soil moisture with capacitive sensor and automate a 12V water pump through relay when moisture drops below threshold. Log readings to ThingSpeak and send email alerts via IFTTT webhook.",
    outcomes: [
      "Read capacitive soil moisture without corrosion",
      "Control pump with hysteresis (on/off thresholds)",
      "Upload data to ThingSpeak channel",
      "Implement daily max pump runtime safety",
      "Calibrate dry/wet ADC endpoints for local soil",
    ],
    skills: ["Analog scaling", "Relay control", "Cloud logging", "Irrigation logic"],
    applications: ["Balcony planters", "Small greenhouse", "School agriculture labs"],
    expectedResult: "Pump runs 10 s when soil dry; ThingSpeak chart shows moisture trending upward after watering.",
  },
  prerequisites: ["iot-weather-station helpful", "Outdoor-safe enclosure"],
  safety: ["Keep 12V pump wiring away from water splash on ESP32", "Use GFCI outlet for mains-powered pump"],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Controller + Wi-Fi", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "Capacitive Soil Moisture", quantity: "1", purpose: "Corrosion-resistant sensing", buyUrl: "https://www.robocraze.com/products/capacitive-soil-moisture-sensor" },
    { name: "12V Mini Water Pump", quantity: "1", purpose: "Irrigation", buyUrl: "https://robu.in/product/mini-submersible-water-pump/" },
    { name: "1-Channel Relay", quantity: "1", purpose: "Pump switch", buyUrl: "https://www.robocraze.com/products/1-channel-relay-module" },
    { name: "12V 2A Adapter", quantity: "1", purpose: "Pump supply", buyUrl: "https://www.amazon.in/s?k=12v+2a+adapter" },
    { name: "Drip Irrigation Kit", quantity: "1", purpose: "Water delivery", buyUrl: "https://www.amazon.in/s?k=drip+irrigation+kit" },
    { name: "IP65 Enclosure", quantity: "1", purpose: "Outdoor ESP32", buyUrl: "https://robu.in/product/ip65-enclosure/" },
  ],
  circuit: {
    sections: [
      { title: "Moisture Sensor", content: "Analog out to GPIO 34 (input only). Power sensor only during read to reduce corrosion — or use capacitive type." },
      { title: "Pump Relay", content: "GPIO 26 to relay IN. Pump 12V through NO. Flyback diode on pump." },
      { title: "ThingSpeak", content: "HTTP GET to api.thingspeak.com/update with field1=moisture." },
    ],
    pinMapping: [
      { component: "Soil moisture AO", arduinoPin: "GPIO 34", notes: "ADC input" },
      { component: "Pump relay", arduinoPin: "GPIO 26", notes: "Active LOW" },
      { component: "Sensor VCC control", arduinoPin: "GPIO 25", notes: "Optional power gate" },
    ],
  },
  steps: [
    { number: 1, title: "Sensor Calibration", content: "Record ADC in dry air (~4095) and water cup (~1500). Map to 0–100% moisture." },
    { number: 2, title: "Pump Plumbing", content: "Install drip lines in planter. Prime pump — remove air locks." },
    { number: 3, title: "Relay Wiring", content: "Isolate 12V pump from ESP32. Common GND at star point." },
    { number: 4, title: "ThingSpeak Setup", content: "Create channel with field1 Moisture. Copy Write API Key." },
    { number: 5, title: "Upload Agriculture Firmware", content: "Flash smart_agri_thingspeak.ino with thresholds DRY=35 WET=55." },
    { number: 6, title: "Field Testing", content: "Let soil dry. Verify pump triggers once per cycle with 5 min cooldown.", checklist: ["Moisture % sane", "Pump runs 10 s", "ThingSpeak updates", "Cooldown works"] },
  ],
  code: `/*
 * Smart Agriculture — soil moisture + pump
 * File: smart_agri_thingspeak.ino
 */

#include <WiFi.h>
#include <HTTPClient.h>
const int MOIST_PIN = 34, RELAY = 26;
const int DRY = 35, WET = 55;
const char* TS_KEY = "YOUR_WRITE_KEY";
unsigned long lastPump = 0;

int moisturePct() {
  int raw = analogRead(MOIST_PIN);
  return map(raw, 4095, 1500, 0, 100);
}

void pumpPulse() {
  if (millis() - lastPump < 300000) return;
  digitalWrite(RELAY, LOW);
  delay(10000);
  digitalWrite(RELAY, HIGH);
  lastPump = millis();
}

void sendThingSpeak(int m) {
  HTTPClient http;
  String url = "http://api.thingspeak.com/update?api_key=" + String(TS_KEY) + "&field1=" + m;
  http.begin(url);
  http.GET();
  http.end();
}

void setup() {
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, HIGH);
  WiFi.begin("SSID", "PASS");
  while (WiFi.status() != WL_CONNECTED) delay(300);
}

void loop() {
  int m = moisturePct();
  if (m < DRY) pumpPulse();
  static unsigned long last = 0;
  if (millis() - last > 60000) {
    last = millis();
    sendThingSpeak(m);
  }
  delay(1000);
}`,
  testing: {
    checklist: ["Calibration in dry/wet", "Pump doesn't run when wet", "ThingSpeak chart updates", "No relay stuck on"],
    expectedOutput: "Automated irrigation with cloud moisture history.",
    commonIssues: ["Always dry reading — check AO pin", "Pump runs forever — verify relay active LOW", "ThingSpeak 403 — API key wrong"],
  },
  troubleshooting: [
    { title: "Moisture always 100%", solution: "Recalibrate map endpoints. Sensor may be submerged — reposition mid-root zone." },
    { title: "Pump never runs", solution: "Lower DRY threshold. Check relay LED. Test relay with manual digitalWrite." },
    { title: "ESP32 crashes on pump", solution: "Separate 12V supply. Optoisolated relay. Capacitor on ESP32 5V." },
    { title: "ThingSpeak gaps", solution: "Free tier limits 15 s interval. Add error logging on HTTP response code." },
  ],
  downloads: [
    { id: "code", title: "smart_agri_thingspeak.ino", description: "Irrigation + cloud log", fileType: "INO" },
    { id: "diagram", title: "agri_pump_relay.pdf", description: "Pump relay schematic", fileType: "PDF" },
    { id: "cal", title: "soil_calibrate.ino", description: "ADC calibration sketch", fileType: "INO" },
  ],
  relatedSlugs: ["iot-weather-station", "solar-tracking-system", "smart-dustbin"],
  faq: [
    { question: "Resistive vs capacitive sensor?", answer: "Capacitive lasts longer — resistive probes corrode in weeks with constant DC." },
    { question: "Solar power?", answer: "5V panel + TP4056 charging 18650 — enough for 15-min interval ESP32 + sensor." },
  ],
  aiPromptSuggestions: [
    "Add rain sensor to skip watering",
    "Send WhatsApp alert when moisture critical",
    "Explain hysteresis DRY vs WET thresholds",
  ],
};

export const rfidDoorLock: ProjectContentSeed = {
  slug: "rfid-door-lock",
  programming: "Arduino C++",
  powerSource: "12V adapter (solenoid) + 5V for Arduino",
  overview: {
    description:
      "Secure a door or locker with MFRC522 RFID reader and solenoid lock. Register authorized UID cards in EEPROM and trigger unlock for 5 seconds on valid tap — with buzzer feedback for denied cards.",
    outcomes: [
      "Interface MFRC522 over SPI",
      "Store up to 10 authorized UIDs in EEPROM",
      "Drive solenoid lock via MOSFET or relay",
      "Add master card enrollment mode",
      "Log access attempts on Serial",
    ],
    skills: ["SPI communication", "EEPROM management", "Solenoid driving", "Access control logic"],
    applications: ["Hostel lockers", "Lab equipment access", "Makerspace door entry"],
    expectedResult: "Registered RFID card unlocks solenoid for 5 s; unknown card triggers error buzz.",
  },
  prerequisites: ["Arduino IDE with MFRC522 library", "Basic understanding of SPI"],
  safety: ["Solenoid gets hot if energized continuously — firmware must timeout", "12V lock — fused supply"],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Controller", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "MFRC522 RFID Module", quantity: "1", purpose: "Card read", buyUrl: "https://www.robocraze.com/products/mfrc522-rfid-reader" },
    { name: "RFID Cards/Tags", quantity: "5", purpose: "Access tokens", buyUrl: "https://robu.in/product/rfid-card-13-56mhz/" },
    { name: "12V Solenoid Lock", quantity: "1", purpose: "Bolt actuator", buyUrl: "https://www.robocraze.com/products/12v-solenoid-lock" },
    { name: "IRLZ44N MOSFET", quantity: "1", purpose: "Solenoid switch", buyUrl: "https://robu.in/product/irlz44n-mosfet/" },
    { name: "1N4007 Flyback Diode", quantity: "1", purpose: "Protect MOSFET", buyUrl: "https://www.robocraze.com/products/1n4007-diode" },
    { name: "Piezo Buzzer", quantity: "1", purpose: "Access feedback", buyUrl: "https://www.robocraze.com/products/piezo-buzzer" },
  ],
  circuit: {
    sections: [
      { title: "MFRC522 SPI", content: "SDA(SS) D10, SCK D13, MOSI D11, MISO D12, RST D9. 3.3V logic — use level shifter if needed." },
      { title: "Solenoid Driver", content: "MOSFET gate D8 via 220Ω. Diode across solenoid cathode to +12V. 12V supply rated 1A+." },
      { title: "Buzzer", content: "D6 active buzzer — 200 ms beep granted, 3× short denied." },
    ],
    pinMapping: [
      { component: "MFRC522 SS/RST", arduinoPin: "D10 / D9", notes: "SPI" },
      { component: "Solenoid MOSFET", arduinoPin: "D8", notes: "HIGH = unlock" },
      { component: "Buzzer", arduinoPin: "D6", notes: "Feedback" },
    ],
  },
  steps: [
    { number: 1, title: "Install MFRC522 Library", content: "Arduino Library Manager: install MFRC522 by GithubCommunity. Run DumpInfo example." },
    { number: 2, title: "Mount Reader and Lock", content: "Position RFID coil outside door frame. Align solenoid bolt with strike plate." },
    { number: 3, title: "Solenoid Driver Circuit", content: "Build MOSFET + flyback on perfboard. Test 12V pulse with multimeter." },
    { number: 4, title: "Enroll Master Card", content: "Hold master card on first boot — stores UID in EEPROM slot 0." },
    { number: 5, title: "Upload RFID Lock Code", content: "Flash rfid_door_lock_v1.ino. Add user cards in enroll mode (hold master 5 s)." },
    { number: 6, title: "Access Testing", content: "Test valid, invalid, and timeout relock.", checklist: ["Valid unlocks 5s", "Invalid buzzes", "Relocks auto", "EEPROM persists"] },
  ],
  code: `/*
 * RFID Door Lock — MFRC522 + solenoid
 * File: rfid_door_lock_v1.ino
 */

#include <SPI.h>
#include <MFRC522.h>
#define SS_PIN 10
#define RST_PIN 9
#define LOCK_PIN 8
#define BUZZER 6
MFRC522 rfid(SS_PIN, RST_PIN);
byte allowed[][4] = {{0xDE,0xAD,0xBE,0xEF}}; // replace after enroll

bool isAllowed(byte *uid) {
  for (int i = 0; i < 1; i++)
    if (memcmp(uid, allowed[i], 4) == 0) return true;
  return false;
}

void unlock() {
  digitalWrite(LOCK_PIN, HIGH);
  tone(BUZZER, 2000, 200);
  delay(5000);
  digitalWrite(LOCK_PIN, LOW);
}

void deny() {
  for (int i = 0; i < 3; i++) { tone(BUZZER, 800, 80); delay(120); }
}

void setup() {
  SPI.begin();
  rfid.PCD_Init();
  pinMode(LOCK_PIN, OUTPUT);
  digitalWrite(LOCK_PIN, LOW);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  if (isAllowed(rfid.uid.uidByte)) unlock();
  else deny();
  rfid.PICC_HaltA();
}`,
  testing: {
    checklist: ["Reads card UID", "Unlock duration 5s", "Deny pattern on bad card", "Lock cold after cycle"],
    expectedOutput: "Reliable RFID access control with audio feedback.",
    commonIssues: ["Can't read card — 3.3V SPI", "Solenoid weak — 12V 1A supply", "UID changes — use full 4-byte UID"],
  },
  troubleshooting: [
    { title: "Reader not detecting", solution: "Set SS pin correctly. Use 3.3V. Increase antenna gain rc522.PCD_AntennaOn()." },
    { title: "Solenoid doesn't pull", solution: "Check MOSFET gate voltage. Diode polarity. Strike plate alignment." },
    { title: "Lock stays hot", solution: "Ensure digitalWrite LOW after timeout. Fail-safe: NC lock with power loss secure." },
    { title: "UID changes each read", solution: "Use uid.uidByte first 4 bytes only. Some cards use 7-byte UID — store full length." },
  ],
  downloads: [
    { id: "code", title: "rfid_door_lock_v1.ino", description: "Access control firmware", fileType: "INO" },
    { id: "diagram", title: "rfid_lock_schematic.pdf", description: "MOSFET solenoid driver", fileType: "PDF" },
    { id: "enroll", title: "rfid_enroll_utility.ino", description: "Card UID capture tool", fileType: "INO" },
  ],
  relatedSlugs: ["smart-dustbin", "voice-controlled-home", "smart-parking-system"],
  faq: [
    { question: "Phone NFC work?", answer: "Most phones emulate different UIDs — use dedicated 13.56 MHz MIFARE cards." },
    { question: "Fail secure or fail safe?", answer: "Solenoid fail-secure needs power to unlock — battery backup recommended for outages." },
  ],
  aiPromptSuggestions: [
    "Store 10 UIDs in EEPROM with wear leveling",
    "Add keypad backup PIN entry",
    "Log access to SD card with timestamp",
  ],
};

export const smartParkingSystem: ProjectContentSeed = {
  slug: "smart-parking-system",
  programming: "Arduino C++ (ESP32)",
  powerSource: "5V 3A adapter per slot controller",
  overview: {
    description:
      "Build a two-slot parking monitor using IR obstacle sensors per bay and ESP32 to publish occupancy to a web dashboard. Green/red LEDs indicate free/full; OLED shows slot status locally.",
    outcomes: [
      "Detect vehicle presence with IR slot sensors",
      "Drive status LEDs per bay",
      "Serve REST API /slots JSON on ESP32",
      "Display counts on OLED",
      "Extend to ultrasonic for higher vehicles",
    ],
    skills: ["Multi-sensor digital read", "REST API on ESP32", "Parking logic", "Dashboard integration"],
    applications: ["Apartment parking", "Mall basement prototypes", "College lot monitoring"],
    expectedResult: "Dashboard shows Slot1: occupied, Slot2: free with live LED indication at entrance.",
  },
  prerequisites: ["Basic ESP32 web server knowledge"],
  safety: ["Sensors mounted low — avoid vehicle tire impact", "Waterproof enclosure for outdoor lots"],
  parts: [
    { name: "ESP32 DevKit", quantity: "1", purpose: "Controller + API", buyUrl: "https://www.robocraze.com/products/esp32-development-board" },
    { name: "IR Obstacle Sensor", quantity: "2", purpose: "Per-slot detect", buyUrl: "https://www.robocraze.com/products/ir-obstacle-sensor" },
    { name: "Green/Red LED 5mm", quantity: "4", purpose: "Status per slot", buyUrl: "https://www.robocraze.com/products/led-5mm-assorted" },
    { name: "OLED 0.96\"", quantity: "1", purpose: "Local UI", buyUrl: "https://robu.in/product/0-96-inch-oled-display/" },
    { name: "220Ω Resistors", quantity: "4", purpose: "LED current limit", buyUrl: "https://www.robocraze.com/products/resistor-kit" },
    { name: "Aluminum Mount Brackets", quantity: "2", purpose: "Sensor per slot", buyUrl: "https://www.amazon.in/s?k=sensor+mount+bracket" },
  ],
  circuit: {
    sections: [
      { title: "IR Sensors", content: "Slot1 IR on GPIO 14, Slot2 on GPIO 27. Digital OUT — LOW when object detected." },
      { title: "LEDs", content: "Slot1 green GPIO 16, red GPIO 17. Slot2 green 18, red 19 through 220Ω." },
      { title: "API", content: "GET /api/slots returns {\"s1\":0,\"s2\":1} where 1=occupied." },
    ],
    pinMapping: [
      { component: "IR Slot 1/2", arduinoPin: "GPIO 14 / 27", notes: "Digital in" },
      { component: "LED S1 G/R", arduinoPin: "GPIO 16 / 17", notes: "Status" },
      { component: "LED S2 G/R", arduinoPin: "GPIO 18 / 19", notes: "Status" },
      { component: "OLED I2C", arduinoPin: "GPIO 21 / 22", notes: "Display" },
    ],
  },
  steps: [
    { number: 1, title: "Sensor Placement", content: "Mount IR sensors 30 cm high at slot entry — detects car bumper interruption." },
    { number: 2, title: "LED Indicator Panel", content: "Build panel with 2× green/red pairs labeled Slot 1 and Slot 2." },
    { number: 3, title: "Wire ESP32", content: "Connect sensors, LEDs with resistors, and OLED on I2C." },
    { number: 4, title: "API Test", content: "Upload stub server. curl http://IP/api/slots returns JSON." },
    { number: 5, title: "Upload Parking Firmware", content: "Flash smart_parking_esp32.ino with Wi-Fi credentials." },
    { number: 6, title: "Occupancy Testing", content: "Walk through beam — verify LED and API update within 200 ms.", checklist: ["Both slots detect", "LED logic correct", "API JSON valid", "OLED matches"] },
  ],
  code: `/*
 * Smart Parking System — 2 slots
 * File: smart_parking_esp32.ino
 */

#include <WiFi.h>
#include <WebServer.h>
WebServer server(80);
const int IR1 = 14, IR2 = 27;
const int S1G = 16, S1R = 17, S2G = 18, S2R = 19;

bool occupied(int pin) { return digitalRead(pin) == LOW; }

void updateLeds() {
  bool o1 = occupied(IR1), o2 = occupied(IR2);
  digitalWrite(S1G, !o1); digitalWrite(S1R, o1);
  digitalWrite(S2G, !o2); digitalWrite(S2R, o2);
}

void handleApi() {
  bool o1 = occupied(IR1), o2 = occupied(IR2);
  String json = "{\"s1\":" + String(o1?1:0) + ",\"s2\":" + String(o2?1:0) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  pinMode(IR1, INPUT); pinMode(IR2, INPUT);
  pinMode(S1G, OUTPUT); pinMode(S1R, OUTPUT);
  pinMode(S2G, OUTPUT); pinMode(S2R, OUTPUT);
  WiFi.begin("SSID", "PASS");
  while (WiFi.status() != WL_CONNECTED) delay(200);
  server.on("/api/slots", handleApi);
  server.begin();
}

void loop() {
  server.handleClient();
  updateLeds();
  delay(100);
}`,
  testing: {
    checklist: ["IR triggers on body", "LEDs exclusive G/R", "API matches sensors", "Wi-Fi stable 24h"],
    expectedOutput: "Real-time slot occupancy via LEDs and JSON API.",
    commonIssues: ["False occupied — sunlight on IR", "LED dim — check resistor value", "API 404 — route typo"],
  },
  troubleshooting: [
    { title: "Sensor always occupied", solution: "Adjust potentiometer on IR module. Shield from direct sunlight. Increase mounting height." },
    { title: "Misses low cars", solution: "Use paired sensors or ultrasonic HC-SR04 at bumper height." },
    { title: "API unreachable", solution: "Print WiFi.localIP() to Serial. Phone on same LAN. Disable AP isolation on router." },
    { title: "LED both on", solution: "Code should be mutually exclusive — verify wiring to correct GPIO." },
  ],
  downloads: [
    { id: "code", title: "smart_parking_esp32.ino", description: "2-slot parking API", fileType: "INO" },
    { id: "dashboard", title: "parking_dashboard.html", description: "Simple web UI", fileType: "HTML" },
    { id: "diagram", title: "parking_sensor_layout.pdf", description: "Mounting guide", fileType: "PDF" },
  ],
  relatedSlugs: ["rfid-door-lock", "iot-weather-station", "voice-controlled-home"],
  faq: [
    { question: "Scale to 10 slots?", answer: "Use MCP23017 GPIO expander or second ESP32 with MQTT aggregation." },
    { question: "Outdoor rain?", answer: "Use IP65 ultrasonic sensors instead of IR in exposed lots." },
  ],
  aiPromptSuggestions: [
    "Add MQTT publish for slot changes",
    "Build React dashboard for /api/slots",
    "Count total cars today with NVS storage",
  ],
};

export const solarTrackingSystem: ProjectContentSeed = {
  slug: "solar-tracking-system",
  programming: "Arduino C++",
  powerSource: "5V USB (demo) / panel-powered in deployment",
  overview: {
    description:
      "Maximize solar panel output with a dual-LDR tracking system that rotates a small panel on a servo azimuth mount toward the brightest light source. Compare fixed vs tracking voltage on multimeter.",
    outcomes: [
      "Read dual LDR voltage dividers on analog pins",
      "Compute light differential for east/west tracking",
      "Drive SG90 or MG995 servo for panel azimuth",
      "Implement deadband to prevent hunting",
      "Measure output gain vs fixed panel",
    ],
    skills: ["Analog comparison", "Servo positioning", "Renewable energy basics", "Feedback control"],
    applications: ["Solar lab demos", "Rooftop tracker prototypes", "Renewable energy education"],
    expectedResult: "Panel rotates to face brightest lamp; stops when LDR difference within deadband.",
  },
  prerequisites: ["Understanding voltage dividers", "Servo basics"],
  safety: ["Demo uses LED lamp — not direct sun focusing", "Secure panel — servo stall can strip gears"],
  parts: [
    { name: "Arduino UNO", quantity: "1", purpose: "Tracker brain", buyUrl: "https://robu.in/product/arduino-uno-r3/" },
    { name: "LDR 5mm", quantity: "2", purpose: "East/west light sense", buyUrl: "https://www.robocraze.com/products/ldr-5mm" },
    { name: "10k Resistors", quantity: "2", purpose: "LDR dividers", buyUrl: "https://www.robocraze.com/products/resistor-kit" },
    { name: "MG995 Servo", quantity: "1", purpose: "Panel rotation", buyUrl: "https://robu.in/product/mg995-servo-motor/" },
    { name: "Mini Solar Panel 6V", quantity: "1", purpose: "Tracked load", buyUrl: "https://www.robocraze.com/products/6v-mini-solar-panel" },
    { name: "Servo Mount Bracket", quantity: "1", purpose: "Panel holder", buyUrl: "https://www.amazon.in/s?k=servo+bracket+mg995" },
    { name: "Cardboard/Acrylic Frame", quantity: "1", purpose: "LDR shade partition", buyUrl: "https://www.amazon.in/s?k=acrylic+sheet" },
  ],
  circuit: {
    sections: [
      { title: "LDR Dividers", content: "East LDR on A0, West on A1 — each with 10k to GND forming voltage divider on 5V." },
      { title: "Partition", content: "Vertical divider between LDRs so only one sees light when off-center." },
      { title: "Servo", content: "MG995 on D9 — panel mounted on horn. Range 0–180° azimuth." },
    ],
    pinMapping: [
      { component: "LDR East", arduinoPin: "A0", notes: "Voltage divider" },
      { component: "LDR West", arduinoPin: "A1", notes: "Voltage divider" },
      { component: "Servo signal", arduinoPin: "D9", notes: "Panel azimuth" },
    ],
  },
  steps: [
    { number: 1, title: "Build Sensor Head", content: "Mount two LDRs with center partition on panel edge. Shade from ambient rear light." },
    { number: 2, title: "Panel on Servo", content: "Attach 6V panel to MG995 horn. Balance weight to reduce servo load." },
    { number: 3, title: "Wire Dividers", content: "Build identical east/west dividers. Verify equal readings when lamp centered." },
    { number: 4, title: "Calibrate Deadband", content: "Set DEADBAND = 15 ADC counts in sketch to stop hunting." },
    { number: 5, title: "Upload Solar Tracker Code", content: "Flash solar_tracker_dual_ldr.ino. Use desk lamp as sun simulator." },
    { number: 6, title: "Tracking Test", content: "Move lamp left/right — panel follows. Measure panel voltage fixed vs tracking.", checklist: ["Follows lamp", "Stops at center", "No oscillation", "Voltage gain >10%"] },
  ],
  code: `/*
 * Solar Tracking — dual LDR azimuth
 * File: solar_tracker_dual_ldr.ino
 */

#include <Servo.h>
Servo azimuth;
const int LDR_E = A0, LDR_W = A1;
int angle = 90;
const int DEADBAND = 15;
const int STEP = 2;

void setup() {
  azimuth.attach(9);
  azimuth.write(angle);
  Serial.begin(9600);
}

void loop() {
  int e = analogRead(LDR_E);
  int w = analogRead(LDR_W);
  int diff = e - w;
  Serial.print("E:"); Serial.print(e);
  Serial.print(" W:"); Serial.println(w);
  if (diff > DEADBAND && angle < 175) angle += STEP;
  else if (diff < -DEADBAND && angle > 5) angle -= STEP;
  azimuth.write(angle);
  delay(200);
}`,
  testing: {
    checklist: ["Centered lamp = stable angle", "Lamp left → rotates left", "Deadband prevents jitter", "Panel voltage improves"],
    expectedOutput: "Smooth azimuth tracking toward light source.",
    commonIssues: ["Hunts — increase DEADBAND", "Wrong direction — swap LDR pins", "Servo hum — panel too heavy for SG90"],
  },
  troubleshooting: [
    { title: "Panel oscillates", solution: "Increase DEADBAND to 25. Slow STEP to 1. Add delay(400)." },
    { title: "Doesn't track", solution: "Check divider wiring. LDRs must be matched pair. Lamp bright enough." },
    { title: "Servo overheats", solution: "Upgrade MG995. Reduce panel size. Only move when diff > deadband." },
    { title: "Equal LDR different readings", solution: "Cover both — should match. Replace mismatched LDR. Add fixed resistors trim." },
  ],
  downloads: [
    { id: "code", title: "solar_tracker_dual_ldr.ino", description: "Dual LDR tracker", fileType: "INO" },
    { id: "diagram", title: "solar_tracker_schematic.pdf", description: "LDR divider wiring", fileType: "PDF" },
    { id: "report", title: "tracking_efficiency_sheet.pdf", description: "Voltage log template", fileType: "PDF" },
  ],
  relatedSlugs: ["iot-weather-station", "smart-agriculture", "smart-parking-system"],
  faq: [
    { question: "Single-axis enough?", answer: "Azimuth tracking gives most gain for fixed latitude — elevation axis adds ~5% more." },
    { question: "Use real sun?", answer: "Outdoor OK with waterproof enclosure — never focus concentrated sun on LDR without shield." },
  ],
  aiPromptSuggestions: [
    "Add elevation axis with second servo",
    "Log panel voltage to SD card",
    "Calculate theoretical vs measured gain",
  ],
};

export const iotSeeds: Record<string, ProjectContentSeed> = {
  "smart-dustbin": smartDustbin,
  "iot-weather-station": iotWeatherStation,
  "smart-agriculture": smartAgriculture,
  "rfid-door-lock": rfidDoorLock,
  "smart-parking-system": smartParkingSystem,
  "solar-tracking-system": solarTrackingSystem,
};

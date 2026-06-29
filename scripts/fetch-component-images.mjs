import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "components");

/** slug -> Wikimedia Commons search query */
const SEARCHES = {
  "arduino-uno-r3": "Arduino Uno R3 board",
  "esp32-devkit": "ESP32 DevKitC",
  "raspberry-pi-5": "Raspberry Pi 5 board",
  "hc-sr04": "HC-SR04 ultrasonic sensor module",
  "ir-sensor": "IR obstacle sensor module arduino",
  "l298n": "L298N motor driver module",
  "servo-sg90": "SG90 micro servo motor",
  "dc-geared-motor": "DC geared motor yellow robot",
  "stepper-nema17": "NEMA 17 stepper motor",
  "jumper-wires": "Dupont jumper wires breadboard",
  breadboard: "solderless breadboard white",
  "oled-display": "SSD1306 OLED display module",
  "lcd-16x2": "LCD 1602 display module",
  "relay-module": "relay module 5V arduino",
  "bluetooth-hc05": "HC-05 bluetooth module",
  "wifi-esp8266": "ESP8266 NodeMCU module",
  mpu6050: "MPU6050 gyroscope accelerometer module",
  "flame-sensor": "flame sensor module arduino",
  "gas-sensor-mq2": "MQ-2 gas sensor module",
  "soil-moisture": "soil moisture sensor module",
  "pir-motion": "PIR motion sensor HC-SR501",
  dht11: "DHT11 temperature humidity sensor",
  dht22: "DHT22 AM2302 sensor module",
  buzzer: "piezo buzzer module arduino",
  "led-pack": "LED assortment electronics",
  "resistor-kit": "resistor assortment kit",
  "capacitor-kit": "electrolytic capacitor assortment",
  "battery-holder": "AA battery holder electronics",
  "18650-battery": "18650 lithium ion battery",
  "power-module": "LM2596 buck converter module",
};

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "5",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "800",
    format: "json",
    origin: "*",
  });

  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
    { headers: { "User-Agent": "RoboForge/1.0 (educational robotics catalog)" } },
  );
  if (!res.ok) throw new Error(`API ${res.status} for ${query}`);
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl && !info?.url) continue;
    const mime = info.mime ?? "";
    if (!mime.startsWith("image/")) continue;
    if ((info.size ?? 0) < 8000) continue;
    return {
      url: info.thumburl ?? info.url,
      ext: mime.includes("png") ? "png" : "jpg",
    };
  }
  return null;
}

async function download(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "RoboForge/1.0 (educational robotics catalog)" },
  });
  if (!res.ok) throw new Error(`Download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

await mkdir(OUT_DIR, { recursive: true });

const mapping = {};
const failures = [];

for (const [slug, query] of Object.entries(SEARCHES)) {
  try {
    const hit = await searchCommons(query);
    if (!hit) {
      failures.push(slug);
      console.warn(`No image found: ${slug}`);
      continue;
    }
    const filename = `${slug}.${hit.ext}`;
    const bytes = await download(hit.url);
    await writeFile(path.join(OUT_DIR, filename), bytes);
    mapping[slug] = `/components/${filename}`;
    console.log(`OK ${slug} -> ${filename}`);
    await new Promise((r) => setTimeout(r, 300));
  } catch (err) {
    failures.push(slug);
    console.warn(`FAIL ${slug}:`, err.message);
  }
}

console.log("\n--- mapping ---");
console.log(JSON.stringify(mapping, null, 2));
if (failures.length) console.log("\nFailures:", failures.join(", "));

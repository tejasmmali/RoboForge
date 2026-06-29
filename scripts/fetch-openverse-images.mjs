import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "components");

const QUERIES = {
  "esp32-devkit": "ESP32 development board",
  "hc-sr04": "HC-SR04 ultrasonic sensor",
  "ir-sensor": "IR sensor module arduino",
  "l298n": "L298N motor driver",
  "dc-geared-motor": "DC geared motor robot",
  "jumper-wires": "dupont jumper wires",
  breadboard: "solderless breadboard",
  "oled-display": "OLED display SSD1306",
  "lcd-16x2": "LCD 1602 display",
  "relay-module": "relay module arduino",
  "bluetooth-hc05": "HC-05 bluetooth module",
  "wifi-esp8266": "ESP8266 NodeMCU",
  mpu6050: "MPU6050 module",
  "flame-sensor": "flame sensor module",
  "gas-sensor-mq2": "MQ2 gas sensor",
  "pir-motion": "PIR motion sensor",
  dht11: "DHT11 sensor",
  dht22: "DHT22 sensor",
  buzzer: "piezo buzzer arduino",
  "led-pack": "LED diodes assortment",
  "resistor-kit": "resistor kit electronics",
  "capacitor-kit": "capacitor assortment",
  "battery-holder": "battery holder AA",
  "18650-battery": "18650 battery cell",
  "power-module": "buck converter LM2596",
};

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function searchOpenverse(query) {
  const params = new URLSearchParams({
    q: query,
    license: "cc0,pdm,by,by-sa",
    page_size: "5",
    aspect_ratio: "square,tall,wide",
  });
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { "User-Agent": "RoboForge/1.0" },
  });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = await res.json();
  return data.results?.find((r) => r.url && r.height >= 300) ?? null;
}

await mkdir(OUT_DIR, { recursive: true });

const mapping = {};
const failures = [];

for (const [slug, query] of Object.entries(QUERIES)) {
  const existing = (await exists(path.join(OUT_DIR, `${slug}.jpg`)))
    ? `${slug}.jpg`
    : (await exists(path.join(OUT_DIR, `${slug}.png`)))
      ? `${slug}.png`
      : null;
  if (existing) {
    mapping[slug] = `/components/${existing}`;
    console.log(`SKIP ${slug} (exists)`);
    continue;
  }

  try {
    const hit = await searchOpenverse(query);
    if (!hit) throw new Error("No results");
    const ext = hit.url.includes(".png") ? "png" : "jpg";
    const res = await fetch(hit.url, {
      headers: { "User-Agent": "RoboForge/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Download ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    const filename = `${slug}.${ext}`;
    await writeFile(path.join(OUT_DIR, filename), bytes);
    mapping[slug] = `/components/${filename}`;
    console.log(`OK ${slug} <- ${hit.source ?? hit.provider}`);
    await new Promise((r) => setTimeout(r, 500));
  } catch (err) {
    failures.push(slug);
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}

console.log("\n--- mapping ---");
console.log(JSON.stringify(mapping, null, 2));
if (failures.length) console.log("\nFailures:", failures.join(", "));

import { writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "projects");

const RETRY = {
  "line-follower-robot-3": ["robot competition", "Arduino robot"],
  "obstacle-avoiding-robot-2": ["ultrasonic sensor robot", "mobile robot sensors"],
  "robotic-arm-3": ["industrial robot arm", "servo motor robot"],
  "smart-dustbin-2": ["automatic trash bin", "waste management technology"],
  "smart-dustbin-3": ["recycling bin sensor", "smart city waste"],
  "iot-weather-station-2": ["weather monitoring", "meteorological instruments"],
  "iot-weather-station-3": ["temperature humidity sensor", "environmental sensor station"],
  "smart-agriculture-2": ["drip irrigation farm", "agricultural technology"],
  "gesture-controlled-robot-3": ["wearable gesture control", "motion control technology"],
  "maze-solving-robot-3": ["robot maze", "autonomous robot navigation"],
  "wifi-robot-esp32-2": ["ESP32 microcontroller", "wireless IoT device"],
  "wifi-robot-esp32-3": ["robotics workshop", "electronics prototyping"],
  "rfid-door-lock-2": ["electronic lock", "security access card"],
  "fire-fighting-robot-2": ["firefighter equipment", "fire suppression"],
  "fire-fighting-robot-3": ["rescue robot", "emergency response robot"],
  "smart-parking-system-2": ["parking lot technology", "car parking sensors"],
  "self-balancing-robot-2": ["two wheel robot", "inverted pendulum robot"],
  "self-balancing-robot-3": ["gyroscope sensor", "balance robot Arduino"],
};

const WIKI = {
  "line-follower-robot-3": "Robot",
  "obstacle-avoiding-robot-2": "Sonar",
  "robotic-arm-3": "Industrial_robot",
  "smart-dustbin-2": "Waste_container",
  "smart-dustbin-3": "Recycling",
  "iot-weather-station-2": "Meteorology",
  "iot-weather-station-3": "Hygrometer",
  "smart-agriculture-2": "Irrigation",
  "gesture-controlled-robot-3": "Motion_capture",
  "maze-solving-robot-3": "Artificial_intelligence",
  "wifi-robot-esp32-2": "Microcontroller",
  "wifi-robot-esp32-3": "Printed_circuit_board",
  "rfid-door-lock-2": "Electronic_lock",
  "fire-fighting-robot-2": "Fire_extinguisher",
  "fire-fighting-robot-3": "Search_and_rescue_robot",
  "smart-parking-system-2": "Parking_lot",
  "self-balancing-robot-2": "Segway",
  "self-balancing-robot-3": "Gyroscope",
};

async function existsBase(name) {
  for (const ext of ["jpg", "png", "webp"]) {
    try {
      await access(path.join(OUT, `${name}.${ext}`));
      return ext;
    } catch {
      /* continue */
    }
  }
  return null;
}

async function openverse(query) {
  const params = new URLSearchParams({
    q: query,
    license: "cc0,pdm,by,by-sa",
    page_size: "12",
  });
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { "User-Agent": "RoboForge/1.0" },
  });
  const data = await res.json();
  return data.results?.find((r) => r.url && r.height >= 250) ?? null;
}

async function wiki(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { "User-Agent": "RoboForge/1.0" } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnail?.source ?? null;
}

for (const [name, queries] of Object.entries(RETRY)) {
  if (await existsBase(name)) {
    console.log(`SKIP ${name}`);
    continue;
  }

  let url = null;
  for (const q of queries) {
    const hit = await openverse(q);
    if (hit?.url) {
      url = hit.url;
      break;
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  if (!url && WIKI[name]) url = await wiki(WIKI[name]);
  if (!url) {
    console.warn(`FAIL ${name}`);
    continue;
  }

  try {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: { "User-Agent": "RoboForge/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ext = url.includes(".png") ? "png" : "jpg";
    await writeFile(
      path.join(OUT, `${name}.${ext}`),
      Buffer.from(await res.arrayBuffer()),
    );
    console.log(`OK ${name}`);
  } catch (e) {
    console.warn(`FAIL ${name}: ${e.message}`);
  }
}

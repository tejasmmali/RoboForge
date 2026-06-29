import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "projects");

/** slug -> [hero query, gallery query 2, gallery query 3] */
const PROJECT_QUERIES = {
  "line-follower-robot": [
    "line follower robot arduino",
    "IR sensor robot track",
    "PID robot line tracking",
  ],
  "obstacle-avoiding-robot": [
    "obstacle avoiding robot ultrasonic",
    "HC-SR04 robot navigation",
    "autonomous mobile robot sensors",
  ],
  "bluetooth-car": [
    "bluetooth controlled RC car robot",
    "Arduino robot car chassis",
    "wireless robot vehicle",
  ],
  "robotic-arm": [
    "robotic arm servo arduino",
    "pick and place robot arm",
    "4 DOF robot arm",
  ],
  "smart-dustbin": [
    "smart dustbin ultrasonic sensor",
    "automatic waste bin IoT",
    "smart trash can sensor",
  ],
  "iot-weather-station": [
    "Arduino weather station sensors",
    "IoT weather monitoring station",
    "DHT11 weather station display",
  ],
  "smart-agriculture": [
    "smart agriculture soil moisture",
    "automated irrigation Arduino",
    "precision farming sensors",
  ],
  "gesture-controlled-robot": [
    "gesture controlled robot hand",
    "accelerometer robot control",
    "MPU6050 gesture robot",
  ],
  "maze-solving-robot": [
    "maze solving robot",
    "wall follower robot maze",
    "micromouse robot competition",
  ],
  "voice-controlled-home": [
    "voice controlled home automation",
    "smart home relay Arduino",
    "home automation IoT devices",
  ],
  "wifi-robot-esp32": [
    "ESP32 WiFi robot",
    "wireless robot ESP32 camera",
    "IoT robot ESP32",
  ],
  "rfid-door-lock": [
    "RFID door lock Arduino",
    "access control RFID module",
    "electronic door lock RFID",
  ],
  "fire-fighting-robot": [
    "fire fighting robot",
    "flame sensor robot firefighter",
    "autonomous fire detection robot",
  ],
  "smart-parking-system": [
    "smart parking ultrasonic sensor",
    "parking space detection IoT",
    "automatic parking system sensor",
  ],
  "solar-tracking-system": [
    "solar panel tracking system Arduino",
    "sun tracking solar panel",
    "dual axis solar tracker",
  ],
  "self-balancing-robot": [
    "self balancing robot two wheel",
    "segway style balancing robot",
    "gyroscope self balancing robot",
  ],
};

const WIKI_FALLBACK = {
  "line-follower-robot": "Mobile_robot",
  "obstacle-avoiding-robot": "Obstacle_avoidance",
  "bluetooth-car": "Radio-controlled_car",
  "robotic-arm": "Robotic_arm",
  "smart-dustbin": "Internet_of_things",
  "iot-weather-station": "Weather_station",
  "smart-agriculture": "Precision_agriculture",
  "gesture-controlled-robot": "Gesture_recognition",
  "maze-solving-robot": "Micromouse",
  "voice-controlled-home": "Home_automation",
  "wifi-robot-esp32": "ESP32",
  "rfid-door-lock": "RFID",
  "fire-fighting-robot": "Firefighting",
  "smart-parking-system": "Parking_sensor",
  "solar-tracking-system": "Solar_tracker",
  "self-balancing-robot": "Self-balancing_unicycle",
};

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function searchOpenverse(query, excludeUrls = new Set()) {
  const params = new URLSearchParams({
    q: query,
    license: "cc0,pdm,by,by-sa",
    page_size: "15",
  });
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { "User-Agent": "RoboForge/1.0" },
  });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = await res.json();
  return (
    data.results?.find(
      (r) =>
        r.url &&
        r.height >= 300 &&
        r.width >= 400 &&
        !excludeUrls.has(r.url),
    ) ?? null
  );
}

async function wikiThumb(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { "User-Agent": "RoboForge/1.0" } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnail?.source ?? data.originalimage?.source ?? null;
}

async function download(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "RoboForge/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Download ${res.status}`);
  const contentType = res.headers.get("content-type") ?? "";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : url.includes(".png")
        ? "png"
        : "jpg";
  return { bytes: Buffer.from(await res.arrayBuffer()), ext };
}

await mkdir(OUT_DIR, { recursive: true });

const mapping = { heroes: {}, galleries: {} };
const usedUrls = new Set();

for (const [slug, queries] of Object.entries(PROJECT_QUERIES)) {
  const gallery = [];

  for (let i = 0; i < queries.length; i++) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const filename = `${slug}${suffix}`;
    const outPath = (ext) => path.join(OUT_DIR, `${filename}.${ext}`);

    const hasFile =
      (await exists(outPath("jpg"))) ||
      (await exists(outPath("png"))) ||
      (await exists(outPath("webp")));
    if (hasFile) {
      const ext = (await exists(outPath("jpg")))
        ? "jpg"
        : (await exists(outPath("png")))
          ? "png"
          : "webp";
      const local = `/projects/${filename}.${ext}`;
      if (i === 0) mapping.heroes[slug] = local;
      else gallery.push(local);
      console.log(`SKIP ${filename}`);
      continue;
    }

    try {
      let url = null;
      const hit = await searchOpenverse(queries[i], usedUrls);
      if (hit?.url) url = hit.url;
      if (!url && i === 0 && WIKI_FALLBACK[slug]) {
        url = await wikiThumb(WIKI_FALLBACK[slug]);
      }
      if (!url) throw new Error(`No image for: ${queries[i]}`);

      await new Promise((r) => setTimeout(r, 1200));
      const { bytes, ext } = await download(url);
      usedUrls.add(url);
      await writeFile(outPath(ext), bytes);
      const local = `/projects/${filename}.${ext}`;
      if (i === 0) mapping.heroes[slug] = local;
      else gallery.push(local);
      console.log(`OK ${filename}`);
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.warn(`FAIL ${filename}: ${err.message}`);
    }
  }

  if (gallery.length) mapping.galleries[slug] = gallery;
}

console.log("\n--- heroes ---");
console.log(JSON.stringify(mapping.heroes, null, 2));
console.log("\n--- galleries ---");
console.log(JSON.stringify(mapping.galleries, null, 2));

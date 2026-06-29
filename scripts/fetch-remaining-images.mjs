import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "components");

const QUERIES = {
  "esp32-devkit": "ESP32 DevKit microcontroller",
  "hc-sr04": "ultrasonic distance sensor module",
  "ir-sensor": "infrared obstacle avoidance sensor",
  "l298n": "H bridge motor driver board",
  "dc-geared-motor": "yellow DC gear motor",
  "jumper-wires": "breadboard jumper wire cable",
  "lcd-16x2": "16x2 character LCD module",
  "bluetooth-hc05": "serial bluetooth module",
  "wifi-esp8266": "WiFi microcontroller module",
  "flame-sensor": "flame detection sensor",
  "pir-motion": "passive infrared motion detector",
  "18650-battery": "18650 rechargeable lithium cell",
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
    page_size: "10",
  });
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { "User-Agent": "RoboForge/1.0" },
  });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = await res.json();
  return (
    data.results?.find((r) => r.url && r.height >= 250 && r.width >= 250) ??
    null
  );
}

await mkdir(OUT_DIR, { recursive: true });
const mapping = {};

for (const [slug, query] of Object.entries(QUERIES)) {
  const hasJpg = await exists(path.join(OUT_DIR, `${slug}.jpg`));
  const hasPng = await exists(path.join(OUT_DIR, `${slug}.png`));
  if (hasJpg || hasPng) {
    mapping[slug] = `/components/${slug}.${hasJpg ? "jpg" : "png"}`;
    console.log(`SKIP ${slug}`);
    continue;
  }

  try {
    const hit = await searchOpenverse(query);
    if (!hit) throw new Error("No results");
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(hit.url, {
      headers: { "User-Agent": "RoboForge/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Download ${res.status}`);
    const ext = hit.url.includes(".png") ? "png" : "jpg";
    await writeFile(
      path.join(OUT_DIR, `${slug}.${ext}`),
      Buffer.from(await res.arrayBuffer()),
    );
    mapping[slug] = `/components/${slug}.${ext}`;
    console.log(`OK ${slug}`);
    await new Promise((r) => setTimeout(r, 2500));
  } catch (err) {
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}

console.log(JSON.stringify(mapping, null, 2));

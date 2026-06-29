import { writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "components");

const WIKI = {
  "esp32-devkit": "ESP32",
  "hc-sr04": "Ultrasonic_transducer",
  "jumper-wires": "Jumper_wire",
  "lcd-16x2": "Liquid-crystal_display",
  "pir-motion": "Passive_infrared_sensor",
  "18650-battery": "18650_battery",
};

async function has(slug) {
  for (const ext of ["jpg", "png", "webp"]) {
    try {
      await access(path.join(OUT, `${slug}.${ext}`));
      return true;
    } catch {
      /* continue */
    }
  }
  return false;
}

for (const [slug, title] of Object.entries(WIKI)) {
  if (await has(slug)) {
    console.log(`SKIP ${slug}`);
    continue;
  }
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { "User-Agent": "RoboForge/1.0" } },
    );
    if (!res.ok) throw new Error(`Wiki ${res.status}`);
    const data = await res.json();
    const url = data.thumbnail?.source ?? data.originalimage?.source;
    if (!url) throw new Error("No thumbnail");
    await new Promise((r) => setTimeout(r, 1500));
    const img = await fetch(url, {
      headers: { "User-Agent": "RoboForge/1.0" },
    });
    if (!img.ok) throw new Error(`Img ${img.status}`);
    const ext = url.includes(".png") ? "png" : "jpg";
    await writeFile(
      path.join(OUT, `${slug}.${ext}`),
      Buffer.from(await img.arrayBuffer()),
    );
    console.log(`OK ${slug}`);
  } catch (e) {
    console.warn(`FAIL ${slug}: ${e.message}`);
  }
}

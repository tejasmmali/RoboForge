import { writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "components");

/** slug -> direct Wikimedia Commons file title */
const FILES = {
  "esp32-devkit": "ESP32-DevKitC-32E-V4-wide_perspective.jpg",
  "hc-sr04": "HC-SR04_Ultrasonic_Distance_Sensor.jpg",
  "jumper-wires": "Dupont_cables.jpg",
  "lcd-16x2": "LCD_1602_Display.jpg",
  "wifi-esp8266": "NodeMCU_DEVKIT_1.0.jpg",
  "pir-motion": "HCSR501.jpg",
  "18650-battery": "18650.jpg",
};

async function has(slug) {
  for (const ext of ["jpg", "png", "webp"]) {
    try {
      await access(path.join(OUT, `${slug}.${ext}`));
      return ext;
    } catch {
      /* continue */
    }
  }
  return null;
}

async function commonsUrl(filename) {
  const title = `File:${filename}`;
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "900",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "RoboForge/1.0 (educational catalog)" },
  });
  const data = await res.json();
  const page = Object.values(data?.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
}

for (const [slug, file] of Object.entries(FILES)) {
  const ext = await has(slug);
  if (ext) {
    console.log(`SKIP ${slug}`);
    continue;
  }
  await new Promise((r) => setTimeout(r, 4000));
  try {
    const url = await commonsUrl(file);
    if (!url) throw new Error(`No commons file: ${file}`);
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(url, {
      headers: { "User-Agent": "RoboForge/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const outExt = url.includes(".png") ? "png" : "jpg";
    await writeFile(
      path.join(OUT, `${slug}.${outExt}`),
      Buffer.from(await res.arrayBuffer()),
    );
    console.log(`OK ${slug}`);
  } catch (e) {
    console.warn(`FAIL ${slug}: ${e.message}`);
  }
}

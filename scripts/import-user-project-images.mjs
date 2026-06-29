import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "projects");

const PROJECT_IMAGES = {
  "line-follower-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0eD4uBCgz3jKfIDqZqACxa7kJGa4y6tvlwmmfg1J4ag&s=10",
  "obstacle-avoiding-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPanatDCcn9p0rJoMXjCGLEGWM2GyHzsvM5ESnZU0cQ&s=10",
  "bluetooth-car":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS0Dpm-JSTu1rT-VHXdo1xWnO8aJLnc56jUj6VcGLmMA&s=10",
  "robotic-arm":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS9rAQehbWdbjbsi4ty1QcN6Wf_ZuQjkLljUb3qYsqsg&s=10",
  "smart-dustbin":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uFdKvoSs80baXZ5wgYmGph3YOekBdUo-6h5_Y0VH5Q&s",
  "iot-weather-station":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSucPHVMK9Xetnsl4tel-PXS20tsEtmr7U12RykdQGW3w&s=10",
  "smart-agriculture":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjuhYS6JoctS6m9eIxbodtu5Y7WhAjslMDAVDzgJ3L8Q&s=10",
  "gesture-controlled-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjgGWto5VqdZSvqSvugjy3tW9Ycxit1DerEUbr7ksRpA&s=10",
  "maze-solving-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOwBsgBoRyWyjLTHC8Vsuq7HUJNcDiQfIQpAFB_h8PkQ&s=10",
  "voice-controlled-home":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyv3tjuseZYF1PXEUGqTcyuVrjdFZbwIX04MKc-yUtgQ&s=10",
  "wifi-robot-esp32":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Iv_i82jNPjUYXIaePaUnyeCOe97igl8JPBgPR9OmhA&s=10",
  "rfid-door-lock":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmAYeT6SiFStNiIYE-92VzpZ4-WwI3ykEtjXXK-80t6Q&s=10",
  "fire-fighting-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuvz9VUJMglqtEx1ZvqR3pe1DHB3fYtAp5yjDn8jAZzQ&s=10",
  "smart-parking-system":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPJ_vD4rTORsVVpR81I7MpO33prcSCj8Ppc03CPUFHLg&s",
  "solar-tracking-system":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53OJQ27X8JMETEM-xritoN4FkH0opbr3o8zLTj1F6Ng&s=10",
  "self-balancing-robot":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU914xZ0DKOAfoGYp8FXiCRpBC5l9YGAd-_QY4JyzkFw&s=10",
};

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, url] of Object.entries(PROJECT_IMAGES)) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 RoboForge/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    const ext = contentType.includes("png") ? "png" : "jpg";
    const filename = `${slug}.${ext}`;
    await writeFile(
      path.join(OUT_DIR, filename),
      Buffer.from(await res.arrayBuffer()),
    );
    console.log(`OK ${filename}`);
  } catch (err) {
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}

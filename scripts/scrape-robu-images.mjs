import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "components");
const CATALOG = path.join(process.cwd(), "lib", "components-catalog.ts");

const catalogText = await readFile(CATALOG, "utf8");
const entries = [...catalogText.matchAll(/slug:\s*"([^"]+)"[\s\S]*?buyUrl:\s*"([^"]+)"/g)];

await mkdir(OUT_DIR, { recursive: true });

const mapping = {};
const failures = [];

for (const [, slug, buyUrl] of entries) {
  if (buyUrl === "#") {
    failures.push(slug);
    continue;
  }
  try {
    const res = await fetch(buyUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const og =
      html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1] ??
      html.match(/content="([^"]+)"\s+property="og:image"/i)?.[1] ??
      html.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i)?.[1];

    if (!og) throw new Error("No image found");

    const imageUrl = og.startsWith("//") ? `https:${og}` : og;
    const imgRes = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 RoboForge/1.0" },
    });
    if (!imgRes.ok) throw new Error(`Image ${imgRes.status}`);

    const contentType = imgRes.headers.get("content-type") ?? "";
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : "jpg";
    const filename = `${slug}.${ext}`;
    const bytes = Buffer.from(await imgRes.arrayBuffer());
    await writeFile(path.join(OUT_DIR, filename), bytes);
    mapping[slug] = `/components/${filename}`;
    console.log(`OK ${slug}`);
    await new Promise((r) => setTimeout(r, 800));
  } catch (err) {
    failures.push(slug);
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}

console.log("\n--- mapping ---");
console.log(JSON.stringify(mapping, null, 2));
if (failures.length) console.log("\nFailures:", failures.join(", "));

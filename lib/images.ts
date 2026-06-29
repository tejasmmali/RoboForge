/** Local project photography — sourced from Openverse and Wikipedia */

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;

export const heroImage = img("photo-1485827404703-89b55fcc595e", 1400);

const PROJECT_SLUGS = [
  "line-follower-robot",
  "obstacle-avoiding-robot",
  "bluetooth-car",
  "wifi-robot-esp32",
  "robotic-arm",
  "smart-dustbin",
  "voice-controlled-home",
  "iot-weather-station",
  "smart-agriculture",
  "rfid-door-lock",
  "fire-fighting-robot",
  "gesture-controlled-robot",
  "maze-solving-robot",
  "smart-parking-system",
  "solar-tracking-system",
  "self-balancing-robot",
] as const;

const LOCAL_FALLBACK = "/projects/line-follower-robot.jpg";

function projectHeroPath(slug: string): string {
  return `/projects/${slug}.jpg`;
}

function projectGalleryPath(slug: string, index: 2 | 3): string {
  return `/projects/${slug}-${index}.jpg`;
}

export const projectImages: Record<string, string> = Object.fromEntries(
  PROJECT_SLUGS.map((slug) => [slug, projectHeroPath(slug)]),
);

/** Three unique gallery images per project — hero plus two build/detail shots. */
export const projectGalleryImages: Record<string, string[]> = Object.fromEntries(
  PROJECT_SLUGS.map((slug) => [
    slug,
    [
      projectHeroPath(slug),
      projectGalleryPath(slug, 2),
      projectGalleryPath(slug, 3),
    ],
  ]),
);

export const bentoImages = {
  projects: img("photo-1581092918056-0c4c3acd3789", 1000),
  community: img("photo-1522071820081-009f0129c71c", 800),
  roadmap: img("photo-1581092160562-40aa08e78837", 800),
} as const;

export const pillarImages = {
  learn: img("photo-1501504905252-473bdc47e830", 800),
  practice: img("photo-1581091226825-a6a2a5aee158", 800),
  build: img("photo-1518770660439-4636190af475", 800),
} as const;

export function getProjectImage(slug: string): string {
  return projectImages[slug] ?? LOCAL_FALLBACK;
}

export function getProjectGalleryImages(slug: string): string[] {
  return projectGalleryImages[slug] ?? [getProjectImage(slug)];
}

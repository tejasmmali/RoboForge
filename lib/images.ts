/** Curated Unsplash photography — robotics, electronics, and lab imagery */

export const heroImage =
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&q=85&auto=format&fit=crop";

export const projectImages: Record<string, string> = {
  "line-follower-robot":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=85&auto=format&fit=crop",
  "obstacle-avoiding-robot":
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=85&auto=format&fit=crop",
  "bluetooth-car":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format&fit=crop",
  "robotic-arm":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=85&auto=format&fit=crop",
  "smart-dustbin":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=85&auto=format&fit=crop",
  "iot-weather-station":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop",
  "smart-agriculture":
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=85&auto=format&fit=crop",
  "gesture-controlled-robot":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=85&auto=format&fit=crop",
  "maze-solving-robot":
    "https://images.unsplash.com/photo-1535378917022-76240dbc3f92?w=900&q=85&auto=format&fit=crop",
  "voice-controlled-home":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=900&q=85&auto=format&fit=crop",
  "weather-monitoring-station":
    "https://images.unsplash.com/photo-1592214539128-2d9a2d0949b2?w=900&q=85&auto=format&fit=crop",
  "self-balancing-robot":
    "https://images.unsplash.com/photo-1473965768615-bbb7acb08979?w=900&q=85&auto=format&fit=crop",
  drone:
    "https://images.unsplash.com/photo-1473965768615-bbb7acb08979?w=900&q=85&auto=format&fit=crop",
};

export const bentoImages = {
  projects:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=85&auto=format&fit=crop",
  community:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85&auto=format&fit=crop",
  roadmap:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
} as const;

export const pillarImages = {
  learn:
    "https://images.unsplash.com/photo-1501504905252-473bdc47e830?w=800&q=85&auto=format&fit=crop",
  practice:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=85&auto=format&fit=crop",
  build:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85&auto=format&fit=crop",
} as const;

export function getProjectImage(slug: string): string {
  return (
    projectImages[slug] ??
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=85&auto=format&fit=crop"
  );
}

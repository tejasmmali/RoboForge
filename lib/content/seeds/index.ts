import type { ProjectContentSeed } from "@/lib/content/types";
import { autonomousSeeds } from "@/lib/content/seeds/autonomous";
import { connectivitySeeds } from "@/lib/content/seeds/connectivity";
import { iotSeeds } from "@/lib/content/seeds/iot";
import { advancedSeeds } from "@/lib/content/seeds/advanced";

export const PROJECT_SEEDS: Record<string, ProjectContentSeed> = {
  ...autonomousSeeds,
  ...connectivitySeeds,
  ...iotSeeds,
  ...advancedSeeds,
};

export { autonomousSeeds, connectivitySeeds, iotSeeds, advancedSeeds };

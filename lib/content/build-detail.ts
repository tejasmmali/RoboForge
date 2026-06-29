import type { Project, ProjectTechnology } from "@/lib/projects";
import { getProjectImage, getProjectGalleryImages } from "@/lib/images";
import type { ProjectDetail } from "@/lib/project-details";
import type { ProjectContentSeed } from "@/lib/content/types";

const TECHNOLOGY_LABELS: Record<ProjectTechnology, string> = {
  arduino: "Arduino",
  esp32: "ESP32",
  "raspberry-pi": "Raspberry Pi",
  sensor: "Sensors",
  motor: "Motors",
  servo: "Servos",
};

function mapTechnologies(technologies: ProjectTechnology[]): string[] {
  return technologies.map((tech) => TECHNOLOGY_LABELS[tech] ?? tech);
}

function resolveCodeStepNumber(steps: ProjectContentSeed["steps"]): number {
  const codeStep = steps.find(
    (step) => /upload|code/i.test(step.title),
  );
  if (codeStep) return codeStep.number;

  const testingIndex = steps.findIndex((step) => /test/i.test(step.title));
  if (testingIndex > 0) return steps[testingIndex - 1].number;

  return steps[steps.length - 1]?.number ?? 1;
}

function buildGallery(slug: string): string[] {
  return getProjectGalleryImages(slug);
}

export function buildProjectDetail(
  seed: ProjectContentSeed,
  project: Project,
): ProjectDetail {
  const image = getProjectImage(seed.slug);
  const codeStepNumber = resolveCodeStepNumber(seed.steps);

  return {
    slug: seed.slug,
    title: project.title,
    description: project.description,
    difficulty: project.difficulty,
    category: project.category,
    time: project.time,
    cost: project.cost,
    componentCount: project.componentCount,
    technologies: mapTechnologies(project.technologies),
    image,
    programming: seed.programming,
    powerSource: seed.powerSource,
    overview: seed.overview,
    prerequisites: seed.prerequisites,
    safety: seed.safety,
    parts: seed.parts,
    circuit: {
      image,
      sections: seed.circuit.sections,
      pinMapping: seed.circuit.pinMapping,
    },
    steps: seed.steps.map((step) => ({
      ...step,
      image: step.number === 1 || step.number === codeStepNumber ? image : undefined,
    })),
    code: seed.code,
    testing: seed.testing,
    troubleshooting: seed.troubleshooting,
    downloads: seed.downloads,
    relatedSlugs: seed.relatedSlugs,
    faq: seed.faq,
    aiPromptSuggestions: seed.aiPromptSuggestions,
    gallery: buildGallery(seed.slug),
    totalSteps: seed.steps.length,
    codeStepNumber,
  };
}

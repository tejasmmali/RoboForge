export type FaqItem = { question: string; answer: string };

export type ProjectContentSeed = {
  slug: string;
  programming: string;
  powerSource: string;
  overview: {
    description: string;
    outcomes: string[];
    skills: string[];
    applications: string[];
    expectedResult: string;
  };
  prerequisites: string[];
  safety: string[];
  parts: {
    name: string;
    quantity: string;
    purpose: string;
    buyUrl: string;
  }[];
  circuit: {
    sections: { title: string; content: string }[];
    pinMapping: { component: string; arduinoPin: string; notes: string }[];
  };
  steps: {
    number: number;
    title: string;
    content: string;
    checklist?: string[];
    tips?: string[];
    warnings?: string[];
    pinTable?: { pin: string; connection: string }[];
  }[];
  code: string;
  testing: {
    checklist: string[];
    expectedOutput: string;
    commonIssues: string[];
  };
  troubleshooting: { title: string; solution: string }[];
  downloads: {
    id: string;
    title: string;
    description: string;
    fileType: string;
  }[];
  relatedSlugs: string[];
  faq: FaqItem[];
  aiPromptSuggestions: string[];
};

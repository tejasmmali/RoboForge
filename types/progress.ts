export type ProjectProgressRecord = {
  id: string;
  userId: string;
  projectSlug: string;
  progress: number;
  currentStep: number;
  lastOpenedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  timeSpentMinutes: number;
  estimatedRemaining: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProgressInput = {
  projectSlug: string;
  progress?: number;
  currentStep?: number;
  timeSpentMinutes?: number;
  estimatedRemaining?: string;
  markCompleted?: boolean;
};

export type ResumeProgress = {
  projectSlug: string;
  currentStep: number;
  progress: number;
  lastOpenedAt: string;
};

import { notFound } from "next/navigation";
import { ProjectDetailContent } from "@/components/project-detail/ProjectDetailContent";
import {
  getAllProjectSlugs,
  getProjectDetail,
} from "@/lib/project-details";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}

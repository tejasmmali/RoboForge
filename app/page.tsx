import { BentoGrid } from "@/components/BentoGrid";
import { CTASection } from "@/components/CTASection";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { WhyRoboForge } from "@/components/WhyRoboForge";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoGrid />
      <WhyRoboForge />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}

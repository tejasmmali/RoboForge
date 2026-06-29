import { AboutPageContent } from "@/components/about/AboutPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RoboForge — a robotics education platform with guided projects, a components library, and an AI-powered learning assistant.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}

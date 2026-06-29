import { ContactPageContent } from "@/components/contact/ContactPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the RoboForge team — questions, feedback, partnerships, and support.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}

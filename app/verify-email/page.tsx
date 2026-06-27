import { Suspense } from "react";
import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";

export const metadata = {
  title: "Verify Email",
  description: "Verify your RoboForge email address.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

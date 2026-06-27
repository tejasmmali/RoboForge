import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create your RoboForge account.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout
      brandHeading="Start Building"
      brandSubtitle="Join thousands of students learning robotics with guided projects and AI assistance."
      cardTitle="Create Your RoboForge Account"
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}

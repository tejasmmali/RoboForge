import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your RoboForge password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      centered
      cardTitle="Forgot Password"
      cardSubtitle="Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}

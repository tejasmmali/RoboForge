import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your RoboForge account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      centered
      cardTitle="Reset Password"
      cardSubtitle="Choose a strong new password for your account."
    >
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}

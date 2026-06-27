"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
};

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/profile",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      fallback ?? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      )
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

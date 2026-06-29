"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsToast } from "@/components/settings/SettingsToast";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AIPreferences } from "@/components/settings/AIPreferences";
import { PrivacySettingsPanel } from "@/components/settings/PrivacySettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ConnectedAccounts } from "@/components/settings/ConnectedAccounts";
import { DataExport } from "@/components/settings/DataExport";
import { DangerZone } from "@/components/settings/DangerZone";
import {
  getSettingsNavItem,
  type SettingsSection,
} from "@/components/settings/settings-nav";

function SettingsContent() {
  const [section, setSection] = useState<SettingsSection>("profile");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const nav = getSettingsNavItem(section);

  const onSuccess = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const renderSection = () => {
    switch (section) {
      case "profile":
        return <ProfileSettings onSuccess={onSuccess} />;
      case "account":
        return <AccountSettings />;
      case "appearance":
        return <AppearanceSettings onSuccess={onSuccess} />;
      case "notifications":
        return <NotificationSettings onSuccess={onSuccess} />;
      case "ai":
        return <AIPreferences onSuccess={onSuccess} />;
      case "privacy":
        return <PrivacySettingsPanel onSuccess={onSuccess} />;
      case "security":
        return <SecuritySettings onSuccess={onSuccess} />;
      case "connected":
        return <ConnectedAccounts />;
      case "data":
        return <DataExport onSuccess={onSuccess} />;
      case "danger":
        return <DangerZone onSuccess={onSuccess} />;
      default:
        return null;
    }
  };

  return (
    <Container className="py-10 md:py-14">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-muted">
            Customize your RoboForge experience — profile, appearance, AI, privacy, and more.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <SettingsSidebar
            active={section}
            onChange={setSection}
            mobileOpen={mobileOpen}
            onMobileOpenChange={setMobileOpen}
          />

          <div className="min-w-0">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <p className="font-heading text-[18px] font-medium tracking-tight">{nav.label}</p>
              <p className="mt-1 text-[13px] text-muted">{nav.description}</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </ScrollReveal>

      <SettingsToast message={toast} onDismiss={() => setToast(null)} />
    </Container>
  );
}

export function SettingsPageContent() {
  return (
    <ProtectedRoute redirectTo="/settings" fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsSkeleton() {
  return (
    <Container className="py-10 md:py-14">
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-border/60" />
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden h-96 animate-pulse rounded-default bg-border/50 lg:block" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-default bg-border/60" />
          <div className="h-48 animate-pulse rounded-default bg-border/50" />
        </div>
      </div>
    </Container>
  );
}

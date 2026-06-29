import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/ui/PageTransition";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GlobalChatShell } from "@/components/chat/GlobalChatShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RoboForge — Robotics Learning Platform",
    template: "%s | RoboForge",
  },
  description:
    "Learn robotics through guided projects, explore components, and get AI-powered help while you build.",
  keywords: [
    "robotics",
    "education",
    "Arduino",
    "embedded systems",
    "electronics",
    "STEM",
  ],
  authors: [{ name: "Tejas Mali", url: "https://github.com/tejasmmali/RoboForge" }],
  creator: "Tejas Mali",
};

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-default focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:shadow-elevated"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <QueryProvider>
            <Suspense fallback={null}>
              <GlobalChatShell>
                <div className="flex min-h-dvh flex-col">
                  <Navbar />
                  <PageTransition>
                    <main id="main-content" className="flex-1">
                      {children}
                    </main>
                  </PageTransition>
                  <Footer />
                </div>
              </GlobalChatShell>
            </Suspense>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

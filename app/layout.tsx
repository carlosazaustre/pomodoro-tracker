import type React from "react";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Pomodoro Tracker",
  description:
    "Track your freelance work time with customizable pomodoro sessions",
  manifest: "/manifest.json",
  themeColor: "#ea580c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pomodoro Tracker",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}

import "./globals.css";

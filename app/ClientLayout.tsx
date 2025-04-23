"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { PomodoroProvider } from "@/context/PomodoroContext"
import { useEffect } from "react"
import { CustomToaster } from "@/components/ui/custom-toast"
import { registerServiceWorker } from "@/utils/service-worker"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize sound settings if not already set
    if (typeof window !== "undefined" && localStorage.getItem("pomodoro-sound-enabled") === null) {
      localStorage.setItem("pomodoro-sound-enabled", "true")
    }

    // Register service worker
    registerServiceWorker()
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <PomodoroProvider>
          <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">{children}</div>
          </main>
          <CustomToaster />
          <PWAInstallPrompt />
        </PomodoroProvider>
      </body>
    </html>
  )
}

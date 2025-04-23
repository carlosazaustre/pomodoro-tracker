"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)

      // Check if it's iOS
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      setIsIOS(isIOSDevice)

      // Listen for the beforeinstallprompt event
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the default browser install prompt
        e.preventDefault()
        // Save the event for later use
        setDeferredPrompt(e)
        setIsInstallable(true)
      })

      // Listen for app installed event
      window.addEventListener("appinstalled", () => {
        // Clear the deferredPrompt
        setDeferredPrompt(null)
        setIsInstallable(false)
        console.log("PWA was installed")
      })
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  // Don't show anything if already installed or not installable
  if (isStandalone || (!isInstallable && !isIOS)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="w-5 h-5" />
          Install App
        </button>
      )}

      {isIOS && !isInstallable && !isStandalone && (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <p className="text-sm">
            To install this app on your iOS device, tap{" "}
            <span className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>{" "}
            and then &quot;Add to Home Screen&quot;
          </p>
        </div>
      )}
    </div>
  )
}

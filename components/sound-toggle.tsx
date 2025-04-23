"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { toggleSound, isSoundEnabled } from "@/utils/sound-utils"

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(isSoundEnabled())
  }, [])

  const handleToggle = () => {
    const newState = toggleSound()
    setEnabled(newState)
  }

  return (
    <button
      onClick={handleToggle}
      className="sound-toggle p-2 rounded-full hover:bg-gray-200 transition-colors"
      aria-label={enabled ? "Disable sound" : "Enable sound"}
      title={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? <Volume2 className="w-5 h-5 text-gray-700" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
    </button>
  )
}

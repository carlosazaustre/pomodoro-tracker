"use client"

import type React from "react"
import type { TimerBlock } from "@/types"
import { formatTime } from "@/utils/time-utils"

interface TimerButtonProps {
  block: TimerBlock
  isActive: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
}

export const TimerButton: React.FC<TimerButtonProps> = ({
  block,
  isActive,
  onStart,
  onPause,
  onResume,
  onComplete,
}) => {
  const progress = (block.elapsedTime / block.duration) * 100

  const getButtonLabel = () => {
    if (block.status === "idle") {
      return block.type === "work" ? "Start Working" : "Start Break"
    }
    if (block.status === "running") {
      return formatTime(block.duration - block.elapsedTime)
    }
    if (block.status === "paused") {
      return "Resume"
    }
    return "Completed"
  }

  const getButtonClasses = () => {
    const baseClasses = "timer-button relative w-full h-16 rounded-lg font-medium transition-all overflow-hidden"

    if (block.status === "completed") {
      return `${baseClasses} bg-green-500 text-white cursor-default`
    }

    if (!isActive) {
      return `${baseClasses} bg-gray-200 text-gray-500 cursor-not-allowed`
    }

    if (block.status === "running") {
      return `${baseClasses} bg-blue-500 text-white`
    }

    if (block.status === "paused") {
      return `${baseClasses} bg-yellow-500 text-white`
    }

    return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-800`
  }

  const handleClick = () => {
    if (!isActive) return

    if (block.status === "idle") {
      onStart()
    } else if (block.status === "running") {
      onPause()
    } else if (block.status === "paused") {
      onResume()
    }
  }

  return (
    <button className={getButtonClasses()} onClick={handleClick} disabled={!isActive || block.status === "completed"}>
      {block.status === "running" && (
        <div
          className="timer-button__progress absolute left-0 top-0 bottom-0 bg-blue-600 z-0"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="timer-button__label relative z-10">{getButtonLabel()}</span>
      <span className="timer-button__type text-xs absolute bottom-1 right-2 opacity-70 z-10">
        {block.type === "work" ? "Work" : block.type === "short-break" ? "Short Break" : "Long Break"}
      </span>
    </button>
  )
}

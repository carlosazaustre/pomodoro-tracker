import type { PomodoroSettings } from "@/types"

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export const calculateTotalBlocks = (hours: number, settings: PomodoroSettings): number => {
  // Each hour has 60 minutes
  const minutesPerHour = 60
  const totalMinutes = hours * minutesPerHour

  // Calculate how many complete cycles we can fit
  // A complete cycle is: 4 work blocks + 3 short breaks + 1 long break
  const workDuration = settings.workDuration
  const shortBreakDuration = settings.shortBreakDuration
  const longBreakDuration = settings.longBreakDuration

  // Calculate cycle time: 4 work blocks + 3 short breaks + 1 long break
  const cycleTime = 4 * workDuration + 3 * shortBreakDuration + longBreakDuration

  // Calculate how many complete cycles fit in the total time
  const completeCycles = Math.floor(totalMinutes / cycleTime)

  // Calculate remaining minutes
  const remainingMinutes = totalMinutes % cycleTime

  // Calculate how many additional work blocks and breaks we can fit in the remaining time
  let additionalWorkBlocks = 0
  let remainingTime = remainingMinutes

  // Keep adding work block + short break as long as there's enough time
  while (remainingTime >= workDuration + shortBreakDuration) {
    additionalWorkBlocks++
    remainingTime -= workDuration + shortBreakDuration
  }

  // If we have enough time for one more work block without a break
  if (remainingTime >= workDuration) {
    additionalWorkBlocks++
  }

  // Total work blocks
  const totalWorkBlocks = completeCycles * 4 + additionalWorkBlocks

  return totalWorkBlocks
}

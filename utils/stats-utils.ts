import type { PomodoroSession, SessionStats } from "@/types"

export const calculateSessionStats = (session: PomodoroSession): SessionStats => {
  const completedBlocks = session.blocks.filter((block) => block.status === "completed")

  const completedWorkBlocks = completedBlocks.filter((block) => block.type === "work").length
  const completedBreakBlocks = completedBlocks.filter(
    (block) => block.type === "short-break" || block.type === "long-break",
  ).length

  const totalWorkTime = completedBlocks
    .filter((block) => block.type === "work")
    .reduce((total, block) => total + block.duration, 0)

  const totalBreakTime = completedBlocks
    .filter((block) => block.type === "short-break" || block.type === "long-break")
    .reduce((total, block) => total + block.duration, 0)

  const sessionDuration =
    session.sessionEndTime && session.sessionStartTime
      ? Math.floor((session.sessionEndTime - session.sessionStartTime) / 1000)
      : 0

  return {
    totalWorkTime,
    totalBreakTime,
    completedWorkBlocks,
    completedBreakBlocks,
    sessionDuration,
  }
}

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

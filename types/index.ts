export type WorkPlan = "part-time" | "regular" | "full-time" | "custom"

export interface PlanOption {
  id: WorkPlan
  label: string
  hours: number
  description: string
}

export type TimerStatus = "idle" | "running" | "paused" | "completed"

export interface TimerBlock {
  id: string
  type: "work" | "short-break" | "long-break"
  duration: number // in seconds
  status: TimerStatus
  startTime?: number
  endTime?: number
  elapsedTime: number
}

export interface PomodoroSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
}

export interface PomodoroSession {
  id: string
  plan: WorkPlan
  createdAt: number
  blocks: TimerBlock[]
  currentBlockIndex: number
  isCompleted: boolean
  customHours?: number
  settings: PomodoroSettings
  sessionStartTime?: number // When the first block starts
  sessionEndTime?: number // When the last block completes
}

export interface SessionStats {
  totalWorkTime: number // in seconds
  totalBreakTime: number // in seconds
  completedWorkBlocks: number
  completedBreakBlocks: number
  sessionDuration: number // in seconds
}

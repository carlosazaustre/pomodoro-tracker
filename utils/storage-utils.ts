import type { PomodoroSession } from "@/types"

const STORAGE_KEY = "pomodoro-tracker-session"

export const saveSession = (session: PomodoroSession): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }
}

export const getSession = (): PomodoroSession | null => {
  if (typeof window !== "undefined") {
    const sessionData = localStorage.getItem(STORAGE_KEY)
    if (sessionData) {
      return JSON.parse(sessionData)
    }
  }
  return null
}

export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

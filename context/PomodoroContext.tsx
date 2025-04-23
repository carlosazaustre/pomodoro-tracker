"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { PomodoroSession, WorkPlan, TimerBlock, PomodoroSettings } from "@/types"
import { saveSession, getSession } from "@/utils/storage-utils"
import { calculateTotalBlocks } from "@/utils/time-utils"
import { playSound } from "@/utils/sound-utils"
// Import toast utilities
import { showBlockCompletionToast, showSessionCompletedToast } from "@/utils/toast-utils"

interface PomodoroContextType {
  session: PomodoroSession | null
  createSession: (plan: WorkPlan, customHours?: number, settings?: PomodoroSettings) => void
  startBlock: () => void
  pauseBlock: () => void
  resumeBlock: () => void
  completeBlock: () => void
  resetSession: () => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

// Default settings
const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
}

export const PLAN_OPTIONS = [
  {
    id: "part-time" as WorkPlan,
    label: "Part-time",
    hours: 4,
    description: "4 hours of focused work",
  },
  {
    id: "regular" as WorkPlan,
    label: "Regular",
    hours: 6,
    description: "6 hours of focused work",
  },
  {
    id: "full-time" as WorkPlan,
    label: "Full-time",
    hours: 8,
    description: "8 hours of focused work",
  },
  {
    id: "custom" as WorkPlan,
    label: "Custom",
    hours: 0, // This will be set by the user
    description: "Set your own work hours",
  },
]

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<PomodoroSession | null>(null)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load session from localStorage on initial render
    const savedSession = getSession()
    if (savedSession) {
      setSession(savedSession)
    }
  }, [])

  useEffect(() => {
    // Save session to localStorage whenever it changes
    if (session) {
      saveSession(session)
    }
  }, [session])

  useEffect(() => {
    // Timer logic
    if (session && timer) {
      const currentBlock = session.blocks[session.currentBlockIndex]

      if (currentBlock && currentBlock.status === "running") {
        const interval = setInterval(() => {
          setSession((prevSession) => {
            if (!prevSession) return null

            const updatedBlocks = [...prevSession.blocks]
            const currentBlock = updatedBlocks[prevSession.currentBlockIndex]

            if (currentBlock.status !== "running") {
              clearInterval(interval)
              return prevSession
            }

            const now = Date.now()
            const elapsed = currentBlock.startTime ? Math.floor((now - currentBlock.startTime) / 1000) : 0

            // If timer is complete
            if (elapsed >= currentBlock.duration) {
              currentBlock.status = "completed"
              currentBlock.elapsedTime = currentBlock.duration
              currentBlock.endTime = now

              // Play the appropriate sound based on the block type
              if (currentBlock.type === "work") {
                playSound("work-complete")
              } else {
                playSound("break-complete")
              }

              // Show toast notification for block completion
              showBlockCompletionToast(currentBlock)

              // Auto-advance to next block if not the last one
              let nextBlockIndex = prevSession.currentBlockIndex
              let isCompleted = prevSession.isCompleted
              let sessionEndTime = prevSession.sessionEndTime

              if (nextBlockIndex < prevSession.blocks.length - 1) {
                nextBlockIndex++
              } else {
                isCompleted = true
                // Set session end time when the last block completes
                sessionEndTime = now

                // Show session completed toast
                showSessionCompletedToast()
              }

              return {
                ...prevSession,
                blocks: updatedBlocks,
                currentBlockIndex: nextBlockIndex,
                isCompleted,
                sessionEndTime,
              }
            }

            // Update elapsed time
            currentBlock.elapsedTime = elapsed

            return {
              ...prevSession,
              blocks: updatedBlocks,
            }
          })
        }, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [session, timer])

  const createSession = (plan: WorkPlan, customHours?: number, customSettings?: PomodoroSettings) => {
    // Use provided settings or defaults
    const settings = customSettings || DEFAULT_SETTINGS

    // Find the plan or use custom hours
    let hours: number
    if (plan === "custom" && customHours) {
      hours = customHours
    } else {
      const selectedPlan = PLAN_OPTIONS.find((option) => option.id === plan)
      if (!selectedPlan) return
      hours = selectedPlan.hours
    }

    const totalWorkBlocks = calculateTotalBlocks(hours, settings)
    const blocks: TimerBlock[] = []

    for (let i = 0; i < totalWorkBlocks; i++) {
      // Add work block
      blocks.push({
        id: uuidv4(),
        type: "work",
        duration: settings.workDuration * 60, // Convert minutes to seconds
        status: "idle",
        elapsedTime: 0,
      })

      // Add break block (if not the last work block)
      if (i < totalWorkBlocks - 1) {
        // Every 4th work block is followed by a long break
        if ((i + 1) % 4 === 0) {
          blocks.push({
            id: uuidv4(),
            type: "long-break",
            duration: settings.longBreakDuration * 60, // Convert minutes to seconds
            status: "idle",
            elapsedTime: 0,
          })
        } else {
          blocks.push({
            id: uuidv4(),
            type: "short-break",
            duration: settings.shortBreakDuration * 60, // Convert minutes to seconds
            status: "idle",
            elapsedTime: 0,
          })
        }
      }
    }

    const newSession: PomodoroSession = {
      id: uuidv4(),
      plan,
      createdAt: Date.now(),
      blocks,
      currentBlockIndex: 0,
      isCompleted: false,
      customHours: plan === "custom" ? customHours : undefined,
      settings,
      // Session start and end times will be set later
    }

    setSession(newSession)
  }

  const startBlock = () => {
    if (!session) return

    setSession((prevSession) => {
      if (!prevSession) return null

      const updatedBlocks = [...prevSession.blocks]
      const currentBlock = updatedBlocks[prevSession.currentBlockIndex]
      const now = Date.now()

      if (currentBlock.status === "idle") {
        currentBlock.status = "running"
        currentBlock.startTime = now

        // If this is the first block and it's just starting, set the session start time
        const isFirstBlock = prevSession.currentBlockIndex === 0
        const sessionStartTime = isFirstBlock ? now : prevSession.sessionStartTime

        return {
          ...prevSession,
          blocks: updatedBlocks,
          sessionStartTime,
        }
      }

      return {
        ...prevSession,
        blocks: updatedBlocks,
      }
    })

    // Start the timer
    setTimer(setTimeout(() => {}, 1000))
  }

  const pauseBlock = () => {
    if (!session) return

    setSession((prevSession) => {
      if (!prevSession) return null

      const updatedBlocks = [...prevSession.blocks]
      const currentBlock = updatedBlocks[prevSession.currentBlockIndex]

      if (currentBlock.status === "running") {
        currentBlock.status = "paused"
      }

      return {
        ...prevSession,
        blocks: updatedBlocks,
      }
    })

    // Clear the timer
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  const resumeBlock = () => {
    if (!session) return

    setSession((prevSession) => {
      if (!prevSession) return null

      const updatedBlocks = [...prevSession.blocks]
      const currentBlock = updatedBlocks[prevSession.currentBlockIndex]

      if (currentBlock.status === "paused") {
        currentBlock.status = "running"
        // Adjust the start time to account for the elapsed time
        currentBlock.startTime = Date.now() - currentBlock.elapsedTime * 1000
      }

      return {
        ...prevSession,
        blocks: updatedBlocks,
      }
    })

    // Start the timer
    setTimer(setTimeout(() => {}, 1000))
  }

  const completeBlock = () => {
    if (!session) return

    setSession((prevSession) => {
      if (!prevSession) return null

      const updatedBlocks = [...prevSession.blocks]
      const currentBlock = updatedBlocks[prevSession.currentBlockIndex]
      const now = Date.now()

      currentBlock.status = "completed"
      currentBlock.elapsedTime = currentBlock.duration
      currentBlock.endTime = now

      // Show toast notification for manual block completion
      showBlockCompletionToast(currentBlock)

      // Move to the next block if not the last one
      let nextBlockIndex = prevSession.currentBlockIndex
      let isCompleted = prevSession.isCompleted
      let sessionEndTime = prevSession.sessionEndTime

      if (nextBlockIndex < prevSession.blocks.length - 1) {
        nextBlockIndex++
      } else {
        isCompleted = true
        // Set session end time when the last block completes
        sessionEndTime = now

        // Show session completed toast
        showSessionCompletedToast()
      }

      return {
        ...prevSession,
        blocks: updatedBlocks,
        currentBlockIndex: nextBlockIndex,
        isCompleted,
        sessionEndTime,
      }
    })

    // Clear the timer
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  const resetSession = () => {
    setSession(null)
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  return (
    <PomodoroContext.Provider
      value={{
        session,
        createSession,
        startBlock,
        pauseBlock,
        resumeBlock,
        completeBlock,
        resetSession,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider")
  }
  return context
}

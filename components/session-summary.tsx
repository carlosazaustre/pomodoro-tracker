"use client"

import type React from "react"
import type { PomodoroSession } from "@/types"
import { calculateSessionStats, formatDuration } from "@/utils/stats-utils"
import { Clock, Calendar, CheckCircle2, Coffee } from "lucide-react"

interface SessionSummaryProps {
  session: PomodoroSession
  onReset: () => void
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ session, onReset }) => {
  const stats = calculateSessionStats(session)

  // Format start and end times
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString()
  }

  // Calculate efficiency (work time / total session duration)
  const efficiency = stats.sessionDuration > 0 ? Math.round((stats.totalWorkTime / stats.sessionDuration) * 100) : 0

  return (
    <div className="session-summary bg-white p-6 rounded-lg shadow-md">
      <h2 className="session-summary__title text-2xl font-bold mb-6 text-center">Session Summary</h2>

      <div className="session-summary__time-info mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-600">Date:</span>
          </div>
          <span className="font-medium">{formatDate(session.sessionStartTime)}</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-600">Started:</span>
          </div>
          <span className="font-medium">{formatTime(session.sessionStartTime)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-600">Ended:</span>
          </div>
          <span className="font-medium">{formatTime(session.sessionEndTime)}</span>
        </div>
      </div>

      <div className="session-summary__stats grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
            <span className="text-gray-600">Work Blocks:</span>
          </div>
          <span className="text-xl font-bold">{stats.completedWorkBlocks}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <Coffee className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-gray-600">Break Blocks:</span>
          </div>
          <span className="text-xl font-bold">{stats.completedBreakBlocks}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <Clock className="w-5 h-5 mr-2 text-purple-500" />
            <span className="text-gray-600">Work Time:</span>
          </div>
          <span className="text-xl font-bold">{formatDuration(stats.totalWorkTime)}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-gray-600">Total Time:</span>
          </div>
          <span className="text-xl font-bold">{formatDuration(stats.sessionDuration)}</span>
        </div>
      </div>

      <div className="session-summary__efficiency mb-6">
        <div className="text-gray-600 mb-1">Work Efficiency:</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: `${efficiency}%` }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">{efficiency}%</div>
      </div>

      <div className="session-summary__actions flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start New Session
        </button>
      </div>
    </div>
  )
}

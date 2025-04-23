"use client"

import { usePomodoroContext } from "@/context/PomodoroContext"
import { PlanSelector } from "@/components/plan-selector"
import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function Home() {
  const { session } = usePomodoroContext()

  return <div className="home-page">{!session ? <PlanSelector /> : <PomodoroTimer />}</div>
}

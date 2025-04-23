"use client";

import type React from "react";
import { usePomodoroContext, PLAN_OPTIONS } from "@/context/PomodoroContext";
import { TimerButton } from "./timer-button";
import { SoundToggle } from "./sound-toggle";
import { SessionSummary } from "./session-summary";

export const PomodoroTimer: React.FC = () => {
  const {
    session,
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    resetSession,
  } = usePomodoroContext();

  if (!session) return null;

  // If session is completed and has start/end times, show summary
  if (
    session.isCompleted &&
    session.sessionStartTime &&
    session.sessionEndTime
  ) {
    return <SessionSummary session={session} onReset={resetSession} />;
  }

  // Get plan information
  let planLabel = "";
  let planHours = 0;

  if (session.plan === "custom" && session.customHours) {
    planLabel = "Custom";
    planHours = session.customHours;
  } else {
    const planOption = PLAN_OPTIONS.find(
      (option) => option.id === session.plan
    );
    if (planOption) {
      planLabel = planOption.label;
      planHours = planOption.hours;
    }
  }

  const currentBlock = session.blocks[session.currentBlockIndex];

  // Calculate progress
  const completedBlocks = session.blocks.filter(
    (block) => block.status === "completed"
  ).length;
  const totalBlocks = session.blocks.length;
  const progress = (completedBlocks / totalBlocks) * 100;

  // Get settings
  const { workDuration, shortBreakDuration, longBreakDuration } =
    session.settings;

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-timer__header mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="pomodoro-timer__title text-2xl font-bold">
            {planLabel} Plan ({planHours} hours)
          </h1>
          <SoundToggle />
        </div>

        <div className="pomodoro-timer__settings text-sm text-gray-600 mb-2">
          <span>Focus: {workDuration}min</span> |{" "}
          <span>Short Break: {shortBreakDuration}min</span> |{" "}
          <span>Long Break: {longBreakDuration}min</span>
        </div>

        <div className="pomodoro-timer__progress-bar w-full h-2 bg-gray-200 rounded-full mb-2">
          <div
            className="h-full bg-orange-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pomodoro-timer__stats flex justify-between text-sm text-gray-600">
          <span>
            {completedBlocks} of {totalBlocks} blocks completed
          </span>
          <span>
            {session.isCompleted
              ? "Session completed!"
              : `Current: ${
                  currentBlock.type === "work" ? "Working" : "Break"
                }`}
          </span>
        </div>
      </div>

      <div className="pomodoro-timer__blocks grid gap-3">
        {session.blocks.map((block, index) => (
          <TimerButton
            key={block.id}
            block={block}
            isActive={
              index === session.currentBlockIndex && !session.isCompleted
            }
            onStart={startBlock}
            onPause={pauseBlock}
            onResume={resumeBlock}
            onComplete={completeBlock}
          />
        ))}
      </div>

      <div className="pomodoro-timer__actions mt-8 flex justify-center">
        <button
          onClick={resetSession}
          className="pomodoro-timer__reset-button px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Reset Session
        </button>
      </div>
    </div>
  );
};

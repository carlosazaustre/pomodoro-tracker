"use client";

import type React from "react";
import { useState } from "react";
import { usePomodoroContext, PLAN_OPTIONS } from "@/context/PomodoroContext";
import { CustomHours } from "./custom-hours";
import { CustomSettings } from "./custom-settings";
import type { PomodoroSettings } from "@/types";

export const PlanSelector: React.FC = () => {
  const { createSession } = usePomodoroContext();
  const [showCustomHours, setShowCustomHours] = useState(false);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [customHours, setCustomHours] = useState<number | null>(null);

  // Default settings
  const defaultSettings: PomodoroSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  };

  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);

  const handlePlanSelect = (planId: string) => {
    if (planId === "custom") {
      setShowCustomHours(true);
    } else {
      // For predefined plans, show settings customization
      setShowCustomSettings(true);
    }
  };

  const handleCustomHoursSave = (hours: number) => {
    setCustomHours(hours);
    setShowCustomHours(false);
    setShowCustomSettings(true);
  };

  const handleCustomHoursCancel = () => {
    setShowCustomHours(false);
  };

  const handleSettingsSave = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    setShowCustomSettings(false);

    if (customHours) {
      createSession("custom", customHours, newSettings);
    } else {
      // Find the selected plan
      const selectedPlan = PLAN_OPTIONS.find(
        (option) =>
          option.id !== "custom" && !showCustomHours && showCustomSettings
      );
      if (selectedPlan) {
        createSession(selectedPlan.id, undefined, newSettings);
      }
    }
  };

  const handleSettingsCancel = () => {
    setShowCustomSettings(false);
    setCustomHours(null);
  };

  if (showCustomHours) {
    return (
      <CustomHours
        onSave={handleCustomHoursSave}
        onCancel={handleCustomHoursCancel}
      />
    );
  }

  if (showCustomSettings) {
    return (
      <CustomSettings
        onSave={handleSettingsSave}
        onCancel={handleSettingsCancel}
        initialSettings={defaultSettings}
      />
    );
  }

  return (
    <div className="plan-selector">
      <h1 className="plan-selector__title text-3xl font-bold mb-8 text-center">
        What's your plan for today?
      </h1>
      <div className="plan-selector__options grid gap-4 md:grid-cols-2">
        {PLAN_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handlePlanSelect(option.id)}
            className="plan-selector__option flex flex-col items-center justify-center p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors"
          >
            <h2 className="plan-selector__option-title text-xl font-semibold mb-2">
              {option.label}
            </h2>
            <p className="plan-selector__option-hours text-3xl font-bold mb-2 text-orange-600">
              {option.id === "custom" ? "?" : `${option.hours}h`}
            </p>
            <p className="plan-selector__option-description text-sm text-gray-600 text-center">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

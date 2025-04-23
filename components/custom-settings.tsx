"use client";

import type React from "react";
import { useState } from "react";
import type { PomodoroSettings } from "@/types";

interface CustomSettingsProps {
  onSave: (settings: PomodoroSettings) => void;
  onCancel: () => void;
  initialSettings: PomodoroSettings;
}

export const CustomSettings: React.FC<CustomSettingsProps> = ({
  onSave,
  onCancel,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  // const [useDefaults, setUseDefaults] = useState(false)

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   const numValue = Number.parseInt(value, 10)

  //   if (isNaN(numValue) || numValue <= 0) return

  // Focus time options
  const focusTimeOptions = [5, 10, 15, 20, 25];
  // Short break options
  const shortBreakOptions = [5, 10, 15];
  // Long break options
  const longBreakOptions = [10, 15, 30];

  const handleOptionSelect = (
    settingName: keyof PomodoroSettings,
    value: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [settingName]: value,
    }));

    // const handleUseDefaultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const checked = e.target.checked
    //   setUseDefaults(checked)

    //   if (checked) {
    //     setSettings({
    //       workDuration: 25,
    //       shortBreakDuration: 5,
    //       longBreakDuration: 15,
    //     })
    //   }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  // Button style helper
  const getButtonStyle = (optionValue: number, currentValue: number) => {
    const baseClasses =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors";

    if (optionValue === currentValue) {
      return `${baseClasses} bg-orange-600 text-white`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-orange-100 border border-gray-200`;
  };

  return (
    <div className="custom-settings bg-white p-6 rounded-lg shadow-md">
      <h2 className="custom-settings__title text-xl font-bold mb-4">
        Customize Timer Durations
      </h2>

      <form onSubmit={handleSubmit} className="custom-settings__form">
        {/* <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" checked={useDefaults} onChange={handleUseDefaultsChange} className="mr-2" />
            <span>Use default durations (25/5/15)</span>
          </label>
        </div>

        <div className="grid gap-4 mb-6"> */}
        <div className="grid gap-6 mb-6">
          <div className="custom-settings__field">
            {/* <label htmlFor="workDuration" className="block mb-1 font-medium">
              Focus Time (minutes):
            </label>
            <input
              type="number"
              id="workDuration"
              name="workDuration"
              value={settings.workDuration}
              onChange={handleChange}
              min="1"
              disabled={useDefaults}
              className="w-full p-2 border rounded-md disabled:bg-gray-100"
            /> */}
            <label className="block mb-2 font-medium">
              Focus Time (minutes):
            </label>
            <div className="flex flex-wrap gap-2">
              {focusTimeOptions.map((option) => (
                <button
                  key={`focus-${option}`}
                  type="button"
                  onClick={() => handleOptionSelect("workDuration", option)}
                  className={getButtonStyle(option, settings.workDuration)}
                >
                  {option} min
                </button>
              ))}
            </div>
          </div>

          <div className="custom-settings__field">
            {/* <label
              htmlFor="shortBreakDuration"
              className="block mb-1 font-medium"
            >
              Short Break (minutes):
            </label>
            <input
              type="number"
              id="shortBreakDuration"
              name="shortBreakDuration"
              value={settings.shortBreakDuration}
              onChange={handleChange}
              min="1"
              disabled={useDefaults}
              className="w-full p-2 border rounded-md disabled:bg-gray-100"
            /> */}
            <label className="block mb-2 font-medium">
              Short Break (minutes):
            </label>
            <div className="flex flex-wrap gap-2">
              {shortBreakOptions.map((option) => (
                <button
                  key={`short-${option}`}
                  type="button"
                  onClick={() =>
                    handleOptionSelect("shortBreakDuration", option)
                  }
                  className={getButtonStyle(
                    option,
                    settings.shortBreakDuration
                  )}
                >
                  {option} min
                </button>
              ))}
            </div>
          </div>

          <div className="custom-settings__field">
            {/* <label
              htmlFor="longBreakDuration"
              className="block mb-1 font-medium"
            >
              Long Break (minutes):
            </label>
            <input
              type="number"
              id="longBreakDuration"
              name="longBreakDuration"
              value={settings.longBreakDuration}
              onChange={handleChange}
              min="1"
              disabled={useDefaults}
              className="w-full p-2 border rounded-md disabled:bg-gray-100"
            /> */}
            <label className="block mb-2 font-medium">
              Long Break (minutes):
            </label>
            <div className="flex flex-wrap gap-2">
              {longBreakOptions.map((option) => (
                <button
                  key={`long-${option}`}
                  type="button"
                  onClick={() =>
                    handleOptionSelect("longBreakDuration", option)
                  }
                  className={getButtonStyle(option, settings.longBreakDuration)}
                >
                  {option} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="custom-settings__actions flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

"use client"

import type React from "react"
import { useState } from "react"

interface CustomHoursProps {
  onSave: (hours: number) => void
  onCancel: () => void
}

export const CustomHours: React.FC<CustomHoursProps> = ({ onSave, onCancel }) => {
  const [hours, setHours] = useState<number>(4)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setHours(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(hours)
  }

  return (
    <div className="custom-hours bg-white p-6 rounded-lg shadow-md">
      <h2 className="custom-hours__title text-xl font-bold mb-4">Custom Work Hours</h2>

      <form onSubmit={handleSubmit} className="custom-hours__form">
        <div className="mb-6">
          <label htmlFor="customHours" className="block mb-1 font-medium">
            Number of hours:
          </label>
          <input
            type="number"
            id="customHours"
            value={hours}
            onChange={handleChange}
            min="1"
            max="24"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="custom-hours__actions flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

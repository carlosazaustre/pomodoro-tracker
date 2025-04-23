import { describe, expect, test, vi, beforeEach } from "vitest"
import { playSound, toggleSound, isSoundEnabled } from "./sound-utils"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
  }
})()

// Mock Audio
class AudioMock {
  src: string
  currentTime = 0
  play: () => Promise<void>

  constructor(src: string) {
    this.src = src
    this.play = vi.fn().mockResolvedValue(undefined)
  }
}

describe("Sound Utilities", () => {
  beforeEach(() => {
    // Setup mocks
    vi.stubGlobal("localStorage", localStorageMock)
    vi.stubGlobal("Audio", AudioMock)
    localStorageMock.clear()
  })

  test("toggleSound toggles sound setting in localStorage", () => {
    // Initial state (undefined should default to enabled)
    expect(isSoundEnabled()).toBe(true)

    // Toggle to disabled
    toggleSound()
    expect(isSoundEnabled()).toBe(false)
    expect(localStorage.getItem("pomodoro-sound-enabled")).toBe("false")

    // Toggle back to enabled
    toggleSound()
    expect(isSoundEnabled()).toBe(true)
    expect(localStorage.getItem("pomodoro-sound-enabled")).toBe("true")
  })

  test("playSound plays the correct sound file", () => {
    // Enable sound
    localStorage.setItem("pomodoro-sound-enabled", "true")

    // Play work complete sound
    playSound("work-complete")

    // Verify Audio was created with correct path
    expect(Audio).toHaveBeenCalledWith("/sounds/work-complete.mp3")

    // Verify play was called
    const audioInstance = (Audio as unknown as vi.Mock).mock.instances[0]
    expect(audioInstance.play).toHaveBeenCalled()
  })

  test("playSound does not play when sound is disabled", () => {
    // Disable sound
    localStorage.setItem("pomodoro-sound-enabled", "false")

    // Attempt to play sound
    playSound("break-complete")

    // Verify Audio was not created
    expect(Audio).not.toHaveBeenCalled()
  })
})

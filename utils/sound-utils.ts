// Cache audio instances to avoid recreating them
const audioCache: Record<string, HTMLAudioElement> = {}

export const playSound = (soundName: "work-complete" | "break-complete"): void => {
  if (typeof window === "undefined") return

  try {
    // Check if sound is enabled in localStorage
    const soundEnabled = localStorage.getItem("pomodoro-sound-enabled")
    if (soundEnabled === "false") return

    // Get the sound file path
    const soundPath = `/sounds/${soundName}.mp3`

    // Create or get cached audio instance
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath)
    }

    // Play the sound
    const audio = audioCache[soundPath]
    audio.currentTime = 0
    audio.play().catch((error) => {
      console.error("Error playing sound:", error)
    })
  } catch (error) {
    console.error("Error in playSound:", error)
  }
}

export const toggleSound = (): boolean => {
  if (typeof window === "undefined") return true

  const currentSetting = localStorage.getItem("pomodoro-sound-enabled")
  const newSetting = currentSetting === "false" ? "true" : "false"
  localStorage.setItem("pomodoro-sound-enabled", newSetting)
  return newSetting === "true"
}

export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true
  return localStorage.getItem("pomodoro-sound-enabled") !== "false"
}

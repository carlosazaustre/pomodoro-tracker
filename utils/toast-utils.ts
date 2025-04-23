import { toast } from "@/hooks/use-toast"
import type { TimerBlock } from "@/types"
import { formatDuration } from "@/utils/stats-utils"

export const showBlockCompletionToast = (block: TimerBlock) => {
  const isWorkBlock = block.type === "work"
  const isLongBreak = block.type === "long-break"

  let title = ""
  let description = ""
  let variant: "default" | "success" | "destructive" | null = null

  // Format the duration for display
  const durationText = formatDuration(block.duration)

  if (isWorkBlock) {
    title = "Work block completed!"
    description = `You've completed a ${durationText} focus session. Great job!`
    variant = "success"
  } else if (isLongBreak) {
    title = "Long break completed"
    description = `Your ${durationText} long break is over. Ready to get back to work?`
    variant = "default"
  } else {
    title = "Break completed"
    description = `Your ${durationText} short break is over. Time to focus again.`
    variant = "default"
  }

  toast({
    title,
    description,
    variant,
    duration: 5000, // 5 seconds
  })
}

export const showSessionCompletedToast = () => {
  toast({
    title: "Session completed!",
    description: "Congratulations! You've completed all your planned work blocks. Check out your session summary.",
    variant: "success",
    duration: 8000, // 8 seconds
  })
}

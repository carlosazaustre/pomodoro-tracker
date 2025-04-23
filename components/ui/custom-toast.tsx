"use client"

import { CheckCircle, Clock, Coffee, AlertCircle } from "lucide-react"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function CustomToaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        const isWorkComplete = title?.includes("Work block")
        const isBreakComplete = title?.includes("Break completed")
        const isLongBreakComplete = title?.includes("Long break")
        const isSessionComplete = title?.includes("Session completed")

        // Choose icon based on toast type
        let Icon = Clock
        if (isWorkComplete) {
          Icon = CheckCircle
        } else if (isBreakComplete || isLongBreakComplete) {
          Icon = Coffee
        } else if (isSessionComplete) {
          Icon = AlertCircle
        }

        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-primary mt-0.5" />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

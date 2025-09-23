"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

export type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme === "dark" || theme === "light" ? theme : "system"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "text-hierarchy-title-sm font-medium",
          description: "text-hierarchy-body-sm text-muted-foreground",
          actionButton:
            "text-hierarchy-label group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "text-hierarchy-label group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toaster]:text-destructive group-[.toaster]:bg-destructive/10 group-[.toaster]:border-destructive/20",
          success: "group-[.toaster]:text-success group-[.toaster]:bg-success/10 group-[.toaster]:border-success/20",
          warning: "group-[.toaster]:text-warning group-[.toaster]:bg-warning/10 group-[.toaster]:border-warning/20",
          info: "group-[.toaster]:text-info group-[.toaster]:bg-info/10 group-[.toaster]:border-info/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
export default Toaster
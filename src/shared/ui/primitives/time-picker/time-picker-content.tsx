"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"

export interface TimePickerContentProps {
  hours: number
  minutes: number
  period?: "AM" | "PM"
  format: "12h" | "24h"
  minuteStep: number
  onTimeChange: (hours: number, minutes: number, period?: "AM" | "PM") => void
  isTimeValid?: (time: string) => boolean
  minTime?: string
  maxTime?: string
  className?: string
}

const TimePickerContent = React.forwardRef<HTMLDivElement, TimePickerContentProps>(
  ({ 
    hours, 
    minutes, 
    period = "AM", 
    format, 
    minuteStep, 
    onTimeChange, 
    minTime,
    maxTime,
    className 
  }, ref) => {
    // Convert time string to total minutes for comparison
    const timeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0
      
      if (timeStr.includes(' ')) {
        // 12-hour format
        const [time, periodStr] = timeStr.split(' ')
        if (!time) return 0
        const parts = time.split(':').map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        let totalHours = h
        if (periodStr === 'PM' && h !== 12) {
          totalHours += 12
        } else if (periodStr === 'AM' && h === 12) {
          totalHours = 0
        }
        return totalHours * 60 + m
      } else {
        // 24-hour format
        const parts = timeStr.split(':').map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        return h * 60 + m
      }
    }
    
    // Get minimum allowed time in minutes
    const minMinutes = minTime ? timeToMinutes(minTime) : -1
    const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60
    
    // Helper to check if a specific time is valid
    const isSpecificTimeValid = (h: number, m: number, p?: "AM" | "PM"): boolean => {
      if (minMinutes < 0) return true // No minimum restriction
      
      // Convert the specific time to minutes
      let totalMinutes: number
      if (format === "12h" && p) {
        let hours24 = h
        if (p === "PM" && h !== 12) hours24 += 12
        if (p === "AM" && h === 12) hours24 = 0
        totalMinutes = hours24 * 60 + m
      } else {
        totalMinutes = h * 60 + m
      }
      
      // For same-day rental, check-in time must be AFTER checkout time
      if (totalMinutes <= minMinutes) return false
      if (maxMinutes < 24 * 60 && totalMinutes > maxMinutes) return false
      
      return true
    }
    
    // Generate hour options based on format
    const hourOptions = React.useMemo(() => {
      if (format === "12h") {
        return Array.from({ length: 12 }, (_, i) => i + 1)
      } else {
        return Array.from({ length: 24 }, (_, i) => i)
      }
    }, [format])

    // Generate minute options based on step
    const minuteOptions = React.useMemo(() => {
      const options: number[] = []
      for (let i = 0; i < 60; i += minuteStep) {
        options.push(i)
      }
      return options
    }, [minuteStep])

    const handleHourChange = (value: string) => {
      const newHours = parseInt(value, 10)
      onTimeChange(newHours, minutes, format === "12h" ? period : undefined)
    }

    const handleMinuteChange = (value: string) => {
      const newMinutes = parseInt(value, 10)
      onTimeChange(hours, newMinutes, format === "12h" ? period : undefined)
    }

    const handlePeriodChange = (newPeriod: "AM" | "PM") => {
      // Check if current time with new period would be valid
      if (isSpecificTimeValid(hours, minutes, newPeriod)) {
        onTimeChange(hours, minutes, newPeriod)
      } else {
        // Find the first valid time in the new period
        let validHour = -1
        let validMinute = -1
        
        // Try to find a valid hour with minute 0
        for (const h of hourOptions) {
          if (isSpecificTimeValid(h, 0, newPeriod)) {
            validHour = h
            validMinute = 0
            break
          }
        }
        
        // If no valid hour:00 found, try all combinations
        if (validHour === -1) {
          outerLoop: for (const h of hourOptions) {
            for (const m of minuteOptions) {
              if (isSpecificTimeValid(h, m, newPeriod)) {
                validHour = h
                validMinute = m
                break outerLoop
              }
            }
          }
        }
        
        // If we found a valid time, use it
        if (validHour !== -1) {
          onTimeChange(validHour, validMinute, newPeriod)
        }
        // Otherwise the period change is blocked (shouldn't happen with proper UI)
      }
    }

    return (
      <div ref={ref} className={cn("p-4", className)}>
        <div className="flex items-center gap-2">
          {/* Hours Select */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Hour</label>
            <Select
              value={hours.toString()}
              onValueChange={handleHourChange}
            >
              <SelectTrigger 
                className="w-20"
                aria-label="Select hour"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map(h => {
                  const isDisabled = minTime ? !isSpecificTimeValid(h, minutes, format === "12h" ? period : undefined) : false
                  return (
                    <SelectItem 
                      key={h} 
                      value={h.toString()}
                      disabled={isDisabled}
                      className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {h.toString().padStart(2, '0')}
                      {isDisabled && minTime && ' (unavailable)'}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <span className="text-lg font-semibold mt-5">:</span>

          {/* Minutes Select */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Minute</label>
            <Select
              value={minutes.toString()}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger 
                className="w-20"
                aria-label="Select minute"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map(m => {
                  const isDisabled = minTime ? !isSpecificTimeValid(hours, m, format === "12h" ? period : undefined) : false
                  return (
                    <SelectItem 
                      key={m} 
                      value={m.toString()}
                      disabled={isDisabled}
                      className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {m.toString().padStart(2, '0')}
                      {isDisabled && minTime && ' (unavailable)'}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Period Toggle for 12h format */}
          {format === "12h" && (
            <div className="flex flex-col gap-1 ml-2">
              <label className="text-xs text-muted-foreground">Period</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handlePeriodChange("AM")}
                  disabled={minTime ? !isSpecificTimeValid(hours, minutes, "AM") : false}
                  className={cn(
                    "h-9 px-3 text-sm font-medium rounded-md transition-colors",
                    period === "AM"
                      ? "bg-primary text-primary-foreground"
                      : (minTime && !isSpecificTimeValid(hours, minutes, "AM"))
                      ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-label="Select AM"
                  aria-pressed={period === "AM"}
                  role="radio"
                  aria-checked={period === "AM"}
                  title={(minTime && !isSpecificTimeValid(hours, minutes, "AM")) ? "AM times are before checkout time" : undefined}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handlePeriodChange("PM")}
                  disabled={minTime ? !isSpecificTimeValid(hours, minutes, "PM") : false}
                  className={cn(
                    "h-9 px-3 text-sm font-medium rounded-md transition-colors",
                    period === "PM"
                      ? "bg-primary text-primary-foreground"
                      : (minTime && !isSpecificTimeValid(hours, minutes, "PM"))
                      ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-label="Select PM"
                  aria-pressed={period === "PM"}
                  role="radio"
                  aria-checked={period === "PM"}
                  title={(minTime && !isSpecificTimeValid(hours, minutes, "PM")) ? "This time is not available" : undefined}
                >
                  PM
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick select options */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">Quick select</div>
          <div className="grid grid-cols-3 gap-1">
            {format === "12h" ? (
              <>
                <QuickTimeButton onClick={() => onTimeChange(9, 0, "AM")} label="9:00 AM" disabled={minTime ? !isSpecificTimeValid(9, 0, "AM") : false} />
                <QuickTimeButton onClick={() => onTimeChange(12, 0, "PM")} label="12:00 PM" disabled={minTime ? !isSpecificTimeValid(12, 0, "PM") : false} />
                <QuickTimeButton onClick={() => onTimeChange(3, 0, "PM")} label="3:00 PM" disabled={minTime ? !isSpecificTimeValid(3, 0, "PM") : false} />
                <QuickTimeButton onClick={() => onTimeChange(6, 0, "PM")} label="6:00 PM" disabled={minTime ? !isSpecificTimeValid(6, 0, "PM") : false} />
                <QuickTimeButton onClick={() => onTimeChange(9, 0, "PM")} label="9:00 PM" disabled={minTime ? !isSpecificTimeValid(9, 0, "PM") : false} />
                <QuickTimeButton onClick={() => onTimeChange(12, 0, "AM")} label="12:00 AM" disabled={minTime ? !isSpecificTimeValid(12, 0, "AM") : false} />
              </>
            ) : (
              <>
                <QuickTimeButton onClick={() => onTimeChange(0, 0)} label="00:00" disabled={!isSpecificTimeValid(0, 0)} />
                <QuickTimeButton onClick={() => onTimeChange(6, 0)} label="06:00" disabled={!isSpecificTimeValid(6, 0)} />
                <QuickTimeButton onClick={() => onTimeChange(9, 0)} label="09:00" disabled={!isSpecificTimeValid(9, 0)} />
                <QuickTimeButton onClick={() => onTimeChange(12, 0)} label="12:00" disabled={!isSpecificTimeValid(12, 0)} />
                <QuickTimeButton onClick={() => onTimeChange(18, 0)} label="18:00" disabled={!isSpecificTimeValid(18, 0)} />
                <QuickTimeButton onClick={() => onTimeChange(21, 0)} label="21:00" disabled={!isSpecificTimeValid(21, 0)} />
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
)

TimePickerContent.displayName = "TimePickerContent"

// Quick time selection button component
interface QuickTimeButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
}

const QuickTimeButton: React.FC<QuickTimeButtonProps> = ({ onClick, label, disabled }) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "px-2 py-1 text-xs rounded-md transition-colors",
        disabled 
          ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through" 
          : "bg-muted hover:bg-accent hover:text-accent-foreground"
      )}
      title={disabled ? "This time is not available" : undefined}
    >
      {label}
    </button>
  )
}

export { TimePickerContent }
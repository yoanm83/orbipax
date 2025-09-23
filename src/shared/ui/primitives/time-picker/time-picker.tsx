"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"
import { TimePickerTrigger } from "./time-picker-trigger"
import { TimePickerContent } from "./time-picker-content"

export interface TimePickerProps {
  value?: string | undefined
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  format?: "12h" | "24h"
  minuteStep?: number
  minTime?: string | undefined
  maxTime?: string | undefined
  // Accessibility props
  id?: string
  name?: string
  required?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-required"?: boolean
  "aria-invalid"?: boolean
}

const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  ({
    value,
    onChange,
    placeholder = "Select time",
    disabled = false,
    className,
    format = "12h",
    minuteStep = 5,
    minTime,
    maxTime,
    id,
    name,
    required,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-required": ariaRequired,
    "aria-invalid": ariaInvalid,
  }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [selectedTime, setSelectedTime] = React.useState(value || "")
    const [hours, setHours] = React.useState(12)
    const [minutes, setMinutes] = React.useState(0)
    const [period, setPeriod] = React.useState<"AM" | "PM">("AM")
    
    // Initialize with a valid time if minTime is set and no value
    React.useEffect(() => {
      if (!value && minTime && open) {
        // Find the first valid time after minTime
        // const minMinutes = timeToMinutes(minTime) // unused variable
        
        // Try common times first
        const commonTimes = [
          { h: 9, m: 0, p: "AM" },
          { h: 12, m: 0, p: "PM" },
          { h: 3, m: 0, p: "PM" },
          { h: 6, m: 0, p: "PM" },
          { h: 9, m: 0, p: "PM" }
        ]
        
        for (const time of commonTimes) {
          const timeStr = formatTime(time.h, time.m, time.p as "AM" | "PM")
          if (isTimeValid(timeStr)) {
            setHours(time.h)
            setMinutes(time.m)
            setPeriod(time.p as "AM" | "PM")
            break
          }
        }
      }
    }, [open, value, minTime])
    
    // Helper function moved up to be available for initialization
    const timeToMinutes = (t: string): number => {
      if (!t) return 0
      if (format === "12h" || t.includes("AM") || t.includes("PM")) {
        const [timePart, period] = t.split(" ")
        if (!timePart) return 0
        const parts = timePart.split(":").map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        let hours24 = h
        if (period === "PM" && h !== 12) hours24 += 12
        if (period === "AM" && h === 12) hours24 = 0
        return hours24 * 60 + m
      } else {
        const parts = t.split(":").map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        return h * 60 + m
      }
    }

    // Parse value when it changes
    React.useEffect(() => {
      if (value) {
        parseTimeValue(value)
      }
    }, [value])

    const parseTimeValue = (timeValue: string) => {
      if (format === "12h") {
        const [time, periodPart] = timeValue.split(" ")
        if (time && periodPart) {
          const parts = time.split(":").map(Number)
          const h = parts[0]
          const m = parts[1]
          if (h !== undefined) {
            setHours(h === 0 ? 12 : h > 12 ? h - 12 : h)
          }
          setMinutes(m ?? 0)
          setPeriod((periodPart as "AM" | "PM") || "AM")
          setSelectedTime(timeValue)
        }
      } else {
        // 24h format
        const parts = timeValue.split(":").map(Number)
        const h = parts[0]
        const m = parts[1]
        if (h !== undefined && !isNaN(h) && m !== undefined && !isNaN(m)) {
          setHours(h)
          setMinutes(m)
          setSelectedTime(timeValue)
        }
      }
    }

    const formatTime = (h: number, m: number, p?: "AM" | "PM") => {
      if (format === "12h" && p) {
        const formattedHours = h.toString().padStart(2, "0")
        const formattedMinutes = m.toString().padStart(2, "0")
        return `${formattedHours}:${formattedMinutes} ${p}`
      } else {
        // 24h format
        const formattedHours = h.toString().padStart(2, "0")
        const formattedMinutes = m.toString().padStart(2, "0")
        return `${formattedHours}:${formattedMinutes}`
      }
    }

    const handleTimeChange = (newHours: number, newMinutes: number, newPeriod?: "AM" | "PM") => {
      setHours(newHours)
      setMinutes(newMinutes)
      if (format === "12h" && newPeriod) {
        setPeriod(newPeriod)
      }
      
      const timeString = formatTime(newHours, newMinutes, newPeriod)
      setSelectedTime(timeString)
      onChange?.(timeString)
    }

    const isTimeValid = (time: string): boolean => {
      if (!minTime && !maxTime) return true
      
      const currentMinutes = timeToMinutes(time)
      if (minTime) {
        const minMinutes = timeToMinutes(minTime)
        // For same-day rental, check-in time must be AFTER checkout time (not equal)
        if (currentMinutes <= minMinutes) return false
      }
      if (maxTime && currentMinutes > timeToMinutes(maxTime)) return false
      return true
    }

    const handleClear = () => {
      setSelectedTime("")
      setHours(12)
      setMinutes(0)
      setPeriod("AM")
      onChange?.("")
    }

    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <TimePickerTrigger
              ref={ref}
              id={id}
              value={selectedTime}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
              onClear={handleClear}
              aria-label={ariaLabel || `Time picker, current value: ${selectedTime || "not set"}`}
              aria-describedby={ariaDescribedBy}
              aria-required={ariaRequired || required}
              aria-invalid={ariaInvalid}
              aria-haspopup="dialog"
              aria-expanded={open}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <TimePickerContent
              hours={hours}
              minutes={minutes}
              period={period}
              format={format}
              minuteStep={minuteStep}
              onTimeChange={handleTimeChange}
              isTimeValid={isTimeValid}
              {...(minTime && { minTime })}
              {...(maxTime && { maxTime })}
            />
          </PopoverContent>
        </Popover>
        
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedTime || ""}
            aria-hidden="true"
          />
        )}
      </>
    )
  }
)

TimePicker.displayName = "TimePicker"

export { TimePicker }
"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth as setDateMonth, setYear as setDateYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, startOfDay, isBefore, isAfter } from "date-fns"
import { enUS } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"
import { DatePickerTriggerInput } from "./DatePickerTriggerInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"

// TypeScript strict types
export interface DatePickerProps {
  date?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  minDate?: Date | undefined
  maxDate?: Date | undefined
  name?: string
  id?: string
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-required"?: boolean
  "aria-invalid"?: boolean
}

interface CalendarDay {
  date: number
  month: number
  year: number
  dateObj: Date
  isOutsideMonth: boolean
  isSelected: boolean
  isToday: boolean
  isDisabled: boolean
}

/**
 * Calendar grid component with full keyboard navigation and ARIA support
 */
const CustomCalendar = React.memo(function CustomCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  onClose
}: {
  selectedDate?: Date
  onSelectDate: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  onClose?: () => void
}) {
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const [currentMonth, setCurrentMonth] = React.useState(() => selectedDate || new Date())

  const monthValue = getMonth(currentMonth)
  const yearValue = getYear(currentMonth)

  // Generate month and year options
  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), 'MMMM', { locale: enUS })
  )

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const startDate = startOfMonth(currentMonth)
    const endDate = endOfMonth(currentMonth)
    const startWeek = startOfWeek(startDate, { weekStartsOn: 1 })
    const endWeek = endOfWeek(endDate, { weekStartsOn: 1 })

    const days = eachDayOfInterval({ start: startWeek, end: endWeek })

    return days.map(day => ({
      date: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      dateObj: day,
      isOutsideMonth: !isSameMonth(day, currentMonth),
      isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
      isToday: isToday(day),
      isDisabled: (minDate && isBefore(startOfDay(day), startOfDay(minDate))) ||
                  (maxDate && isAfter(startOfDay(day), startOfDay(maxDate))) ||
                  false
    }))
  }

  const calendarDays = generateCalendarDays()

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleMonthChange = (monthIndex: string) => {
    setCurrentMonth(prev => setDateMonth(prev, parseInt(monthIndex)))
  }

  const handleYearChange = (year: string) => {
    setCurrentMonth(prev => setDateYear(prev, parseInt(year)))
  }

  const handleDateSelect = (day: CalendarDay) => {
    if (!day.isDisabled && !day.isOutsideMonth) {
      onSelectDate(day.dateObj)
      onClose?.()
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!calendarRef.current?.contains(document.activeElement)) return

      switch(e.key) {
        case "Escape":
          e.preventDefault()
          onClose?.()
          break
        case "PageUp":
          e.preventDefault()
          navigateMonth("prev")
          break
        case "PageDown":
          e.preventDefault()
          navigateMonth("next")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={calendarRef}
      className="p-4 space-y-3"
      role="application"
      aria-label={`Calendar for ${format(currentMonth, 'MMMM yyyy')}`}
    >
      {/* Header with month/year selection */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => navigateMonth("prev")}
          className="h-8 w-8 inline-flex items-center justify-center rounded border border-[color:var(--border)] bg-[var(--popover)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)] transition-colors"
          aria-label="Previous month"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex gap-2">
          <Select
            value={monthValue.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger
              className="w-32 h-8 text-sm"
              aria-label="Select month"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={yearValue.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger
              className="w-24 h-8 text-sm"
              aria-label="Select year"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={() => navigateMonth("next")}
          className="h-8 w-8 inline-flex items-center justify-center rounded border border-[color:var(--border)] bg-[var(--popover)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)] transition-colors"
          aria-label="Next month"
          type="button"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Weekday headers */}
      <div
        className="grid grid-cols-7 gap-0 text-center text-xs text-muted-foreground font-medium"
        role="row"
      >
        {weekDays.map((day, index) => (
          <div
            key={index}
            role="columnheader"
            className="w-9 h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7 gap-0"
        role="grid"
        aria-label="Calendar dates"
      >
        {calendarDays.map((day, index) => {
          if (day.isOutsideMonth) {
            return <div key={`empty-${index}`} className="h-9 w-9" aria-hidden="true" />
          }

          return (
            <button
              key={`${day.year}-${day.month}-${day.date}`}
              className={cn(
                "h-9 w-9 p-0 font-normal rounded-md transition-colors",
                "inline-flex items-center justify-center text-sm",
                "hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]",
                day.isSelected && "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]",
                day.isToday && !day.isSelected && "ring-2 ring-[var(--ring-primary)] ring-offset-2 ring-offset-[var(--ring-offset-background)]",
                day.isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground"
              )}
              onClick={() => handleDateSelect(day)}
              disabled={day.isDisabled}
              role="gridcell"
              aria-selected={day.isSelected}
              aria-current={day.isToday ? "date" : undefined}
              aria-disabled={day.isDisabled}
              aria-label={format(day.dateObj, "PPPP")}
              tabIndex={day.isSelected ? 0 : -1}
              type="button"
            >
              {day.date}
            </button>
          )
        })}
      </div>
    </div>
  )
})

/**
 * Main DatePicker component
 */
export function DatePicker({
  date,
  onSelect,
  placeholder = "Select date",
  className,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-required": ariaRequired,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date) => {
    onSelect?.(selectedDate)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Pass undefined like TimePicker passes empty string - both become null in store
    onSelect?.(undefined)
  }

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <DatePickerTriggerInput
          date={date}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isOpen={isOpen}
          onClear={handleClear}
          id={id}
          className={className}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
        />
        <PopoverContent
          className="w-80 min-w-80 max-w-80 p-0 bg-[var(--popover)] text-[var(--popover-foreground)] border border-[color:var(--border)] rounded-lg shadow-md z-50"
          align="start"
        >
          <CustomCalendar
            {...(date && { selectedDate: date })}
            onSelectDate={handleDateSelect}
            {...(minDate && { minDate })}
            {...(maxDate && { maxDate })}
            onClose={() => setIsOpen(false)}
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={date ? format(date, "yyyy-MM-dd") : ""}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Export aliases for compatibility
export const DatePickerPopover = DatePicker
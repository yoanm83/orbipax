import { forwardRef, createContext, useContext, useState, useCallback, useId, useEffect, useMemo } from "react";
import type { ComponentPropsWithoutRef, ReactNode, KeyboardEvent } from "react";

// Calendar variant configurations based on modern 2025 patterns
interface CalendarVariants {
  size: "sm" | "md" | "lg";
  variant: "default" | "outline" | "soft";
  view: "day" | "month" | "year";
}

// Date utility types
type DateValue = Date | null | undefined;
type DateRange = { start: DateValue; end: DateValue };

// Calendar props interface
interface CalendarProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (date: DateValue) => void;
  size?: CalendarVariants["size"];
  variant?: CalendarVariants["variant"];
  view?: CalendarVariants["view"];
  showYearPicker?: boolean;
  showMonthPicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday
  disabledDates?: Date[];
  onViewChange?: (view: CalendarVariants["view"]) => void;
  formatDate?: (date: Date) => string;
  children?: ReactNode;
}

// Calendar range props
interface CalendarRangeProps extends Omit<CalendarProps, "value" | "defaultValue" | "onChange"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  selectionMode?: "range";
}

// Calendar header props
interface CalendarHeaderProps extends ComponentPropsWithoutRef<"div"> {
  currentDate: Date;
  view: CalendarVariants["view"];
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarVariants["view"]) => void;
  showYearPicker?: boolean;
  showMonthPicker?: boolean;
}

// Calendar context value
interface CalendarContextValue {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: DateValue;
  view: CalendarVariants["view"];
  setView: (view: CalendarVariants["view"]) => void;
  size: CalendarVariants["size"];
  variant: CalendarVariants["variant"];
  locale: string;
  weekStartsOn: number;
  minDate?: Date;
  maxDate?: Date;
  disabled: boolean;
  disabledDates: Date[];
  onDateSelect: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateInRange: (date: Date) => boolean;
  formatDate: (date: Date) => string;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

// Hook to access calendar context
export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a Calendar component");
  }
  return context;
};

// Semantic class configurations using design tokens
const calendarVariants = {
  root: {
    base: "inline-block bg-card border border-border rounded-lg shadow-sm",

    sizes: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    },

    variants: {
      default: "bg-card border-border",
      outline: "bg-transparent border-2 border-border",
      soft: "bg-muted border-muted-foreground/20"
    },

    disabled: "opacity-50 pointer-events-none"
  },

  header: {
    base: "flex items-center justify-between p-3 border-b border-border",
    title: "font-semibold text-fg cursor-pointer hover:text-primary transition-colors",
    nav: "flex items-center gap-1"
  },

  navButton: {
    base: "inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-fg hover:bg-accent transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
    icon: "h-4 w-4"
  },

  grid: {
    base: "p-3",
    table: "w-full border-collapse",
    weekHeader: "text-xs font-medium text-muted-foreground pb-2",
    week: "border-collapse",
    day: {
      base: "relative w-9 h-9 text-center text-sm transition-all duration-150 rounded-md cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none",
      today: "font-semibold text-primary",
      selected: "bg-primary text-primary-foreground hover:bg-primary/90",
      disabled: "text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent",
      otherMonth: "text-muted-foreground/50",
      inRange: "bg-primary/10 text-fg"
    }
  },

  monthPicker: {
    base: "grid grid-cols-3 gap-2 p-3",
    month: "h-10 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none border border-transparent",
    selected: "bg-primary text-primary-foreground border-primary",
    disabled: "text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent"
  },

  yearPicker: {
    base: "grid grid-cols-4 gap-2 p-3 max-h-64 overflow-y-auto",
    year: "h-10 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none border border-transparent",
    selected: "bg-primary text-primary-foreground border-primary",
    disabled: "text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent"
  }
};

// Date utility functions
const getMonthName = (date: Date, locale: string = "en-US"): string => {
  return date.toLocaleDateString(locale, { month: "long" });
};

const getMonthNames = (locale: string = "en-US"): string[] => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(date.toLocaleDateString(locale, { month: "long" }));
  }
  return months;
};

const getWeekDayNames = (locale: string = "en-US", weekStartsOn: number = 0): string[] => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, (weekStartsOn + i) % 7 + 1);
    days.push(date.toLocaleDateString(locale, { weekday: "short" }));
  }
  return days;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth();
};

const isDateInRange = (date: Date, start: DateValue, end: DateValue): boolean => {
  if (!start || !end) { return false; }
  return date >= start && date <= end;
};

const generateCalendarDays = (currentDate: Date, weekStartsOn: number = 0): Date[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - ((firstDayOfMonth.getDay() - weekStartsOn + 7) % 7));

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - ((lastDayOfMonth.getDay() - weekStartsOn + 7) % 7)));

  const days: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const generateYearRange = (currentYear: number, range: number = 12): number[] => {
  const startYear = currentYear - Math.floor(range / 2);
  return Array.from({ length: range }, (_, i) => startYear + i);
};

// Calendar Header component
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  (
    {
      currentDate,
      view,
      onPrevious,
      onNext,
      onViewChange,
      showYearPicker = true,
      showMonthPicker = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const { locale } = useCalendarContext();

    const handleTitleClick = () => {
      if (view === "day" && showMonthPicker) {
        onViewChange("month");
      } else if (view === "month" && showYearPicker) {
        onViewChange("year");
      }
    };

    const formatTitle = () => {
      switch (view) {
        case "day":
          return `${getMonthName(currentDate, locale)} ${currentDate.getFullYear()}`;
        case "month":
          return currentDate.getFullYear().toString();
        case "year":
          const startYear = currentDate.getFullYear() - 6;
          const endYear = currentDate.getFullYear() + 5;
          return `${startYear} - ${endYear}`;
        default:
          return "";
      }
    };

    return (
      <div
        ref={ref}
        className={`${calendarVariants.header.base} ${className}`}
        {...props}
      >
        <button
          type="button"
          onClick={onPrevious}
          className={calendarVariants.navButton.base}
          aria-label="Previous"
        >
          <svg className={calendarVariants.navButton.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleTitleClick}
          className={calendarVariants.header.title}
          aria-label={`Switch to ${view === "day" ? "month" : "year"} view`}
        >
          {formatTitle()}
        </button>

        <button
          type="button"
          onClick={onNext}
          className={calendarVariants.navButton.base}
          aria-label="Next"
        >
          <svg className={calendarVariants.navButton.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }
);

CalendarHeader.displayName = "CalendarHeader";

// Calendar Grid component
export const CalendarGrid = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => {
    const {
      currentDate,
      view,
      locale,
      weekStartsOn,
      onDateSelect,
      isDateSelected,
      isDateDisabled,
      formatDate
    } = useCalendarContext();

    const days = useMemo(() => generateCalendarDays(currentDate, weekStartsOn), [currentDate, weekStartsOn]);
    const weekDays = useMemo(() => getWeekDayNames(locale, weekStartsOn), [locale, weekStartsOn]);
    const today = new Date();

    const handleDateClick = (date: Date) => {
      if (!isDateDisabled(date)) {
        onDateSelect(date);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleDateClick(date);
      }
    };

    if (view !== "day") { return null; }

    return (
      <div ref={ref} className={`${calendarVariants.grid.base} ${className}`} {...props}>
        <table className={calendarVariants.grid.table} role="grid">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className={calendarVariants.grid.weekHeader}
                  scope="col"
                  aria-label={day}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
              <tr key={weekIndex} className={calendarVariants.grid.week}>
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date) => {
                  const isSelected = isDateSelected(date);
                  const isDisabled = isDateDisabled(date);
                  const isToday = isSameDay(date, today);
                  const isCurrentMonth = isSameMonth(date, currentDate);

                  const dayClasses = [
                    calendarVariants.grid.day.base,
                    isToday && calendarVariants.grid.day.today,
                    isSelected && calendarVariants.grid.day.selected,
                    isDisabled && calendarVariants.grid.day.disabled,
                    !isCurrentMonth && calendarVariants.grid.day.otherMonth
                  ].filter(Boolean).join(" ");

                  return (
                    <td key={date.getTime()} role="gridcell">
                      <button
                        type="button"
                        className={dayClasses}
                        onClick={() => handleDateClick(date)}
                        onKeyDown={(e) => handleKeyDown(e, date)}
                        disabled={isDisabled}
                        aria-label={formatDate(date)}
                        aria-selected={isSelected}
                        aria-current={isToday ? "date" : undefined}
                        tabIndex={isSelected ? 0 : -1}
                      >
                        {date.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

CalendarGrid.displayName = "CalendarGrid";

// Calendar Month Picker component
export const CalendarMonthPicker = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => {
    const { currentDate, view, locale, onDateSelect, setView } = useCalendarContext();

    const months = useMemo(() => getMonthNames(locale), [locale]);

    const handleMonthClick = (monthIndex: number) => {
      const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
      onDateSelect(newDate);
      setView("day");
    };

    if (view !== "month") { return null; }

    return (
      <div ref={ref} className={`${calendarVariants.monthPicker.base} ${className}`} {...props}>
        {months.map((month, index) => {
          const isSelected = index === currentDate.getMonth();

          const monthClasses = [
            calendarVariants.monthPicker.month,
            isSelected && calendarVariants.monthPicker.selected
          ].filter(Boolean).join(" ");

          return (
            <button
              key={month}
              type="button"
              className={monthClasses}
              onClick={() => handleMonthClick(index)}
              aria-label={`Select ${month}`}
              aria-selected={isSelected}
            >
              {month}
            </button>
          );
        })}
      </div>
    );
  }
);

CalendarMonthPicker.displayName = "CalendarMonthPicker";

// Calendar Year Picker component
export const CalendarYearPicker = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => {
    const { currentDate, view, onDateSelect, setView } = useCalendarContext();

    const years = useMemo(() => generateYearRange(currentDate.getFullYear(), 12), [currentDate]);

    const handleYearClick = (year: number) => {
      const newDate = new Date(year, currentDate.getMonth(), 1);
      onDateSelect(newDate);
      setView("month");
    };

    if (view !== "year") { return null; }

    return (
      <div ref={ref} className={`${calendarVariants.yearPicker.base} ${className}`} {...props}>
        {years.map((year) => {
          const isSelected = year === currentDate.getFullYear();

          const yearClasses = [
            calendarVariants.yearPicker.year,
            isSelected && calendarVariants.yearPicker.selected
          ].filter(Boolean).join(" ");

          return (
            <button
              key={year}
              type="button"
              className={yearClasses}
              onClick={() => handleYearClick(year)}
              aria-label={`Select ${year}`}
              aria-selected={isSelected}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  }
);

CalendarYearPicker.displayName = "CalendarYearPicker";

// Main Calendar component
const CalendarRoot = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      size = "md",
      variant = "default",
      view: initialView = "day",
      showYearPicker = true,
      showMonthPicker = true,
      minDate,
      maxDate,
      disabled = false,
      locale = "en-US",
      weekStartsOn = 0,
      disabledDates = [],
      onViewChange,
      formatDate = (date: Date) => date.toLocaleDateString(locale),
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // State management
    const [internalValue, setInternalValue] = useState<DateValue>(defaultValue || null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarVariants["view"]>(initialView);

    const isControlled = controlledValue !== undefined;
    const selectedDate = isControlled ? controlledValue : internalValue;

    // Generate unique ID for accessibility
    const calendarId = useId();

    // Handle date selection
    const handleDateSelect = useCallback((date: Date) => {
      if (!isControlled) {
        setInternalValue(date);
      }
      onChange?.(date);

      // Update current date for navigation
      setCurrentDate(date);
    }, [isControlled, onChange]);

    // Handle view changes
    const handleViewChange = useCallback((newView: CalendarVariants["view"]) => {
      setView(newView);
      onViewChange?.(newView);
    }, [onViewChange]);

    // Navigation handlers
    const handlePrevious = useCallback(() => {
      const newDate = new Date(currentDate);
      switch (view) {
        case "day":
          newDate.setMonth(currentDate.getMonth() - 1);
          break;
        case "month":
          newDate.setFullYear(currentDate.getFullYear() - 1);
          break;
        case "year":
          newDate.setFullYear(currentDate.getFullYear() - 12);
          break;
      }
      setCurrentDate(newDate);
    }, [currentDate, view]);

    const handleNext = useCallback(() => {
      const newDate = new Date(currentDate);
      switch (view) {
        case "day":
          newDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "month":
          newDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        case "year":
          newDate.setFullYear(currentDate.getFullYear() + 12);
          break;
      }
      setCurrentDate(newDate);
    }, [currentDate, view]);

    // Utility functions
    const isDateDisabled = useCallback((date: Date): boolean => {
      if (disabled) { return true; }
      if (minDate && date < minDate) { return true; }
      if (maxDate && date > maxDate) { return true; }
      return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
    }, [disabled, minDate, maxDate, disabledDates]);

    const isDateSelected = useCallback((date: Date): boolean => {
      return selectedDate ? isSameDay(date, selectedDate) : false;
    }, [selectedDate]);

    const isDateInRangeCheck = useCallback((date: Date): boolean => {
      return false; // Single date selection
    }, []);

    // Context value
    const contextValue: CalendarContextValue = {
      currentDate,
      setCurrentDate,
      selectedDate,
      view,
      setView: handleViewChange,
      size,
      variant,
      locale,
      weekStartsOn,
      minDate,
      maxDate,
      disabled,
      disabledDates,
      onDateSelect: handleDateSelect,
      isDateDisabled,
      isDateSelected,
      isDateInRange: isDateInRangeCheck,
      formatDate
    };

    // Build calendar classes
    const calendarClasses = [
      calendarVariants.root.base,
      calendarVariants.root.sizes[size],
      calendarVariants.root.variants[variant],
      disabled && calendarVariants.root.disabled,
      className
    ].filter(Boolean).join(" ");

    return (
      <CalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={calendarId}
          role="application"
          aria-label="Calendar"
          aria-live="polite"
          className={calendarClasses}
          {...props}
        >
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onViewChange={handleViewChange}
            showYearPicker={showYearPicker}
            showMonthPicker={showMonthPicker}
          />

          <CalendarGrid />
          <CalendarMonthPicker />
          <CalendarYearPicker />

          {children}
        </div>
      </CalendarContext.Provider>
    );
  }
);

CalendarRoot.displayName = "Calendar";

// Calendar Range component
export const CalendarRange = forwardRef<HTMLDivElement, CalendarRangeProps>(
  (props, ref) => {
    // Range implementation would extend the base calendar
    // For now, return the base calendar
    return <CalendarRoot ref={ref} {...props} />;
  }
);

CalendarRange.displayName = "CalendarRange";

// Compound component interface
interface CalendarComponent extends React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CalendarHeader;
  Grid: typeof CalendarGrid;
  MonthPicker: typeof CalendarMonthPicker;
  YearPicker: typeof CalendarYearPicker;
  Range: typeof CalendarRange;
}

// Compound component pattern - attach sub-components to main Calendar
const CalendarWithSubComponents = CalendarRoot as CalendarComponent;
CalendarWithSubComponents.Header = CalendarHeader;
CalendarWithSubComponents.Grid = CalendarGrid;
CalendarWithSubComponents.MonthPicker = CalendarMonthPicker;
CalendarWithSubComponents.YearPicker = CalendarYearPicker;
CalendarWithSubComponents.Range = CalendarRange;

export { CalendarWithSubComponents as Calendar };

// Export types for external use
export type {
  CalendarProps,
  CalendarRangeProps,
  CalendarHeaderProps,
  CalendarVariants,
  DateValue,
  DateRange
};
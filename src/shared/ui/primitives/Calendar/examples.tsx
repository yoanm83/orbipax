"use client";

import { useState } from "react";

import { Button } from "../Button";
import { useToast } from "../Toast";

import { Calendar } from "./index";
import type { DateValue, CalendarVariants } from "./index";

// Example 1: Basic Calendar
export function BasicCalendarExample() {
  const { info } = useToast();
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    if (date) {
      info("Date Selected", `Selected: ${date.toLocaleDateString()}`);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Calendar</h4>

      <div className="space-y-4">
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
        />

        <div className="text-xs text-on-muted">
          Selected: <span className="font-medium">
            {selectedDate ? selectedDate.toLocaleDateString() : "None"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Example 2: Calendar Sizes
export function CalendarSizesExample() {
  const sizes: Array<CalendarVariants["size"]> = ["sm", "md", "lg"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Calendar Sizes</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sizes.map((size) => (
          <div key={size} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">{size}</h5>
            <Calendar
              size={size}
              defaultValue={new Date()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Calendar Variants
export function CalendarVariantsExample() {
  const variants: Array<CalendarVariants["variant"]> = ["default", "outline", "soft"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Calendar Variants</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">{variant}</h5>
            <Calendar
              variant={variant}
              defaultValue={new Date()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: Year-Friendly Picker
export function YearFriendlyCalendarExample() {
  const { info } = useToast();
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date(1990, 5, 15));
  const [currentView, setCurrentView] = useState<CalendarVariants["view"]>("day");

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    if (date) {
      info("Date Selected", `Selected: ${date.toLocaleDateString()}`);
    }
  };

  const handleViewChange = (view: CalendarVariants["view"]) => {
    setCurrentView(view);
    info("View Changed", `Now viewing: ${view}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Year-Friendly Picker</h4>

      <div className="space-y-4">
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          view={currentView}
          onViewChange={handleViewChange}
          showYearPicker={true}
          showMonthPicker={true}
        />

        <div className="space-y-2 text-xs">
          <div className="text-on-muted">
            Current view: <span className="font-medium">{currentView}</span>
          </div>
          <div className="text-on-muted">
            Selected: <span className="font-medium">
              {selectedDate ? selectedDate.toLocaleDateString() : "None"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentView("year")}
          >
            Year View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentView("month")}
          >
            Month View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentView("day")}
          >
            Day View
          </Button>
        </div>
      </div>
    </div>
  );
}

// Example 5: Date Restrictions
export function RestrictedCalendarExample() {
  const { info, error } = useToast();
  const [selectedDate, setSelectedDate] = useState<DateValue>(null);

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  const disabledDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)
  ];

  const handleDateChange = (date: DateValue) => {
    if (date) {
      const isDisabled = disabledDates.some(disabledDate =>
        disabledDate.toDateString() === date.toDateString()
      );

      if (isDisabled) {
        error("Date Unavailable", "This date is not available for selection");
        return;
      }

      info("Date Selected", `Booking for: ${date.toLocaleDateString()}`);
    }
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Booking Calendar</h4>

      <div className="space-y-4">
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
        />

        <div className="p-3 bg-muted rounded-md space-y-2 text-xs">
          <div className="font-medium">Restrictions:</div>
          <ul className="space-y-1 text-on-muted">
            <li>• Available from today onwards</li>
            <li>• Bookings up to 1 year ahead</li>
            <li>• Some dates are unavailable</li>
          </ul>
        </div>

        {selectedDate && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <div className="text-sm font-medium text-primary">
              Booking Confirmed
            </div>
            <div className="text-xs text-primary/80">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 6: Localized Calendar
export function LocalizedCalendarExample() {
  const { info } = useToast();
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [locale, setLocale] = useState("en-US");
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0);

  const locales = [
    { code: "en-US", name: "English (US)", weekStart: 0 as const },
    { code: "es-ES", name: "Español", weekStart: 1 as const },
    { code: "fr-FR", name: "Français", weekStart: 1 as const },
    { code: "de-DE", name: "Deutsch", weekStart: 1 as const },
    { code: "ja-JP", name: "日本語", weekStart: 0 as const },
    { code: "ar-SA", name: "العربية", weekStart: 0 as const }
  ];

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    if (date) {
      info("Date Selected", `Selected: ${date.toLocaleDateString(locale)}`);
    }
  };

  const handleLocaleChange = (newLocale: string, newWeekStart: 0 | 1) => {
    setLocale(newLocale);
    setWeekStartsOn(newWeekStart);
    info("Locale Changed", `Now using ${newLocale} locale`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Localized Calendar</h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-fg">Select Locale:</label>
          <select
            className="w-full p-2 border border-border rounded-md text-sm"
            value={locale}
            onChange={(e) => {
              const selectedLocale = locales.find(l => l.code === e.target.value);
              if (selectedLocale) {
                handleLocaleChange(selectedLocale.code, selectedLocale.weekStart);
              }
            }}
          >
            {locales.map((localeOption) => (
              <option key={localeOption.code} value={localeOption.code}>
                {localeOption.name}
              </option>
            ))}
          </select>
        </div>

        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          locale={locale}
          weekStartsOn={weekStartsOn}
          formatDate={(date) => date.toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        />

        <div className="text-xs text-on-muted">
          Selected: <span className="font-medium">
            {selectedDate ? selectedDate.toLocaleDateString(locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            }) : "None"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Example 7: Event Calendar
export function EventCalendarExample() {
  const { info } = useToast();
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  // Mock events data
  const events = [
    { date: new Date(2024, 11, 15), title: "Team Meeting" },
    { date: new Date(2024, 11, 20), title: "Project Deadline" },
    { date: new Date(2024, 11, 25), title: "Holiday Party" },
    { date: new Date(2025, 0, 1), title: "New Year" },
    { date: new Date(2025, 0, 15), title: "Product Launch" }
  ];

  const hasEvent = (date: Date): boolean => {
    return events.some(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventForDate = (date: Date) => {
    return events.find(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    if (date) {
      const event = getEventForDate(date);
      if (event) {
        info("Event Found", `${event.title} on ${date.toLocaleDateString()}`);
      } else {
        info("Date Selected", `No events on ${date.toLocaleDateString()}`);
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Event Calendar</h4>

      <div className="space-y-4">
        <div className="relative">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
          />

          {/* Event indicators overlay would be implemented with custom styling */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Event dots would be positioned here */}
          </div>
        </div>

        {selectedDate && (
          <div className="p-3 border border-border rounded-md">
            <div className="text-sm font-medium mb-2">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </div>

            {(() => {
              const event = getEventForDate(selectedDate);
              return event ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-fg">{event.title}</span>
                </div>
              ) : (
                <div className="text-sm text-on-muted">No events scheduled</div>
              );
            })()}
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs font-medium text-fg">Upcoming Events:</div>
          <div className="space-y-1">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-on-muted">
                  {event.date.toLocaleDateString()} - {event.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 8: Birth Year Selector
export function BirthYearSelectorExample() {
  const { info } = useToast();
  const [birthDate, setBirthDate] = useState<DateValue>(new Date(1990, 0, 1));

  const currentYear = new Date().getFullYear();
  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date(currentYear - 13, 11, 31); // Minimum age 13

  const handleDateChange = (date: DateValue) => {
    setBirthDate(date);
    if (date) {
      const age = currentYear - date.getFullYear();
      info("Birth Date Selected", `Birth date: ${date.toLocaleDateString()}, Age: ${age}`);
    }
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Birth Date Selector</h4>

      <div className="space-y-4">
        <Calendar
          value={birthDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          view="year"
          showYearPicker={true}
          showMonthPicker={true}
        />

        {birthDate && (
          <div className="p-3 bg-muted rounded-md space-y-2">
            <div className="text-sm font-medium">Selected Birth Date:</div>
            <div className="text-xs text-on-muted">
              Date: {birthDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
            <div className="text-xs text-on-muted">
              Age: {calculateAge(birthDate)} years old
            </div>
          </div>
        )}

        <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
          <div className="text-xs text-warning-foreground">
            <strong>Note:</strong> Must be at least 13 years old
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 9: Disabled Calendar
export function DisabledCalendarExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Disabled Calendar</h4>

      <div className="space-y-4">
        <Calendar
          defaultValue={new Date()}
          disabled={true}
        />

        <div className="text-xs text-on-muted">
          This calendar is disabled and cannot be interacted with.
        </div>
      </div>
    </div>
  );
}

// Example 10: Custom Styling Calendar
export function CustomStyledCalendarExample() {
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Custom Styled Calendar</h4>

      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            variant="soft"
            className="shadow-lg"
          />
        </div>

        <div className="text-xs text-on-muted text-center">
          Custom styling with gradient background and enhanced shadows
        </div>
      </div>
    </div>
  );
}
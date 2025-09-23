"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"
import { Command, CommandEmpty, CommandGroup, CommandList } from "@/shared/ui/primitives/Command"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/Label"
import { ComboboxItem } from "./ComboboxItem"
import { ComboboxButtons } from "./ComboboxButtons"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Compare if two arrays have the same content
 */
function haveSameContent<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

/**
 * Enhanced useEffect that runs when dependencies actually change
 */
function useRunOnChange(
  effect: React.EffectCallback,
  deps: React.DependencyList
): void {
  const prevDepsRef = React.useRef<React.DependencyList>()

  React.useEffect(() => {
    const prevDeps = prevDepsRef.current

    if (!prevDeps || !haveSameContent(prevDeps, [...deps])) {
      prevDepsRef.current = [...deps]
      return effect()
    }
  }, deps)
}

/**
 * Filter suggestions based on search input
 */
interface GetSuggestionsOptions<T> {
  inputValue: string
  options: T[]
  getOptionSearchStrings: (option: T) => string[]
  limit?: number
}

function getSuggestions<T>({
  inputValue,
  options,
  getOptionSearchStrings,
  limit = 50
}: GetSuggestionsOptions<T>): T[] {
  if (!inputValue.trim()) {
    return options.slice(0, limit)
  }

  const normalizedInput = inputValue.toLowerCase().trim()

  const filtered = options.filter(option => {
    const searchStrings = getOptionSearchStrings(option)
    return searchStrings.some(str =>
      str.toLowerCase().includes(normalizedInput)
    )
  })

  return filtered.slice(0, limit)
}

// ============================================================================
// TYPES
// ============================================================================

export interface ComboboxProps<T> {
  // Core props (for typed option selection mode)
  value?: T | null
  onChange?: (value: T | null) => void
  options: T[]

  // Free text mode (alternative to value/onChange)
  inputValue?: string
  onInputValueChange?: (value: string) => void
  onOptionSelect?: (option: T | string) => void

  // Option configuration
  getOptionKey: (option: T) => string
  getOptionLabel: (option: T) => string
  getOptionSearchStrings: (option: T) => string[]
  renderOption?: (option: T) => React.ReactNode
  renderSelectedOption?: (option: T) => React.ReactNode

  // UI props
  placeholder?: string
  label?: React.ReactNode
  disabled?: boolean
  clearOnSelect?: boolean
  noOptionsMessage?: React.ReactNode
  searchPlaceholder?: string

  // Styling
  className?: string
  inputClassName?: string
  popoverClassName?: string

  // Callbacks
  onOpenChange?: (open: boolean) => void

  // Accessibility
  "aria-label"?: string
  "aria-describedby"?: string
  id?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Combobox<T>({
  value,
  onChange,
  options,
  inputValue,
  onInputValueChange,
  onOptionSelect,
  getOptionKey,
  getOptionLabel,
  getOptionSearchStrings,
  renderOption,
  renderSelectedOption,
  placeholder = "Select option...",
  label,
  disabled = false,
  clearOnSelect = false,
  noOptionsMessage = "No options found.",
  className,
  inputClassName,
  popoverClassName,
  onOpenChange,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  id
}: ComboboxProps<T>) {
  // ============================================================================
  // STATE & MODE DETECTION
  // ============================================================================

  // Detect operating mode: free text mode vs typed option mode
  const isFreeTextMode = inputValue !== undefined && onInputValueChange !== undefined

  const [isOpen, setIsOpen] = React.useState(false)
  const [internalInputValue, setInternalInputValue] = React.useState(() => {
    if (isFreeTextMode) {
      return inputValue || ""
    }
    return value ? getOptionLabel(value) : ""
  })
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)

  // Use controlled inputValue in free text mode, internal state otherwise
  const currentInputValue = isFreeTextMode ? inputValue || "" : internalInputValue

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredOptions = React.useMemo(() => {
    if (!isFreeTextMode && value) {
      // In typed mode, when something is selected, show all options
      return options
    }

    return getSuggestions({
      inputValue: currentInputValue,
      options,
      getOptionSearchStrings,
      limit: 100
    })
  }, [isFreeTextMode, value, currentInputValue, options, getOptionSearchStrings])


  const hasValue = isFreeTextMode ? Boolean(currentInputValue) : Boolean(value)
  const showClearButton = hasValue && !disabled

  // ============================================================================
  // EFFECTS
  // ============================================================================


  // Reset active index when options change
  useRunOnChange(() => {
    if (isOpen && filteredOptions.length > 0) {
      setActiveIndex(0)
    } else {
      setActiveIndex(null)
    }
  }, [filteredOptions, isOpen])

  // Handle open change
  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    if (!open) {
      setActiveIndex(null)
    }
  }, [onOpenChange])


  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (isFreeTextMode) {
        // Free text mode: just update the input value
        onInputValueChange!(newValue)
      } else {
        // Typed option mode: update internal state
        setInternalInputValue(newValue)

        // Only clear selection if input is completely cleared AND we have a selection
        if (!newValue && value && onChange) {
          onChange(null)
        }
      }

      // Open dropdown when typing
      if (!isOpen && options.length > 0) {
        setIsOpen(true)
      }
    },
    [isFreeTextMode, onInputValueChange, value, onChange, isOpen, options.length]
  )

  const handleOptionSelect = React.useCallback(
    (option: T) => {
      if (isFreeTextMode) {
        // Free text mode: call onOptionSelect if provided, otherwise use option label
        if (onOptionSelect) {
          onOptionSelect(option)
        } else {
          // Default behavior: fill input with option label
          onInputValueChange!(getOptionLabel(option))
        }
      } else {
        // Typed option mode: use onChange
        if (onChange) {
          onChange(option)
        }

        if (clearOnSelect) {
          setInternalInputValue("")
        }
      }

      setIsOpen(false)
      setActiveIndex(null)

      // Return focus to input
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    },
    [isFreeTextMode, onOptionSelect, onInputValueChange, getOptionLabel, onChange, clearOnSelect]
  )

  const handleClear = React.useCallback(() => {
    if (isFreeTextMode) {
      onInputValueChange!("")
    } else {
      if (onChange) {
        onChange(null)
      }
      setInternalInputValue("")
    }
    inputRef.current?.focus()
  }, [isFreeTextMode, onInputValueChange, onChange])

  const handleToggle = React.useCallback(() => {
    setIsOpen(!isOpen)
    inputRef.current?.focus()
  }, [isOpen])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        if (!isOpen && filteredOptions.length > 0) {
          setIsOpen(true)
          setActiveIndex(0)
        } else if (activeIndex === null) {
          setActiveIndex(0)
        } else if (activeIndex < filteredOptions.length - 1) {
          setActiveIndex(activeIndex + 1)
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (activeIndex === null) {
          setActiveIndex(filteredOptions.length - 1)
        } else if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1)
        }
      } else if (e.key === "Enter" && activeIndex !== null && filteredOptions[activeIndex]) {
        e.preventDefault()
        handleOptionSelect(filteredOptions[activeIndex])
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        setIsOpen(false)
        setActiveIndex(null)
      }
    },
    [activeIndex, filteredOptions, handleOptionSelect, isOpen]
  )

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              id={id}
              value={currentInputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                // Open dropdown when input gains focus
                if (!isOpen && options.length > 0) {
                  setIsOpen(true)
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              autoComplete="off"
              className={cn(
                "pr-16", // Space for buttons
                inputClassName
              )}
            />

            {/* Action Buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <ComboboxButtons
                onClear={showClearButton ? handleClear : () => {}}
                onToggle={handleToggle}
                isOpen={isOpen}
                disabled={disabled}
                showClear={showClearButton}
                showToggle={options.length > 0}
              />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "p-0 w-[--radix-popover-trigger-width]",
            popoverClassName
          )}
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => {
            // Prevent the popover from stealing focus
            e.preventDefault()
          }}
        >
          <Command shouldFilter={false}>
            <CommandList>
              {filteredOptions.length > 0 ? (
                <CommandGroup>
                  {filteredOptions.map((option, index) => {
                    const key = getOptionKey(option)
                    const isSelected = value ? getOptionKey(value) === key : false
                    const isActive = index === activeIndex

                    return (
                      <ComboboxItem
                        key={key}
                        selected={isSelected}
                        active={isActive}
                        onSelect={() => handleOptionSelect(option)}
                      >
                        {renderOption ? renderOption(option) : getOptionLabel(option)}
                      </ComboboxItem>
                    )
                  })}
                </CommandGroup>
              ) : (
                <CommandEmpty>
                  {noOptionsMessage}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ComboboxItem } from "./ComboboxItem"
export { ComboboxButtons } from "./ComboboxButtons"
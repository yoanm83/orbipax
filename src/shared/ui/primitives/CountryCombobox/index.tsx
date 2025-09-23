"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/Popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/shared/ui/primitives/Command"
import { ScrollArea } from "@/shared/ui/primitives/ScrollArea"
import { 
  type Country,
  type CountryCode,
  COUNTRIES as DEFAULT_COUNTRIES,
  getPriorityCountries
} from "@/shared/data/countries"

// ============================================================================
// TYPES
// ============================================================================

export interface CountryComboboxProps {
  value?: CountryCode | null
  onChange: (code: CountryCode | null) => void
  countries?: Country[]
  disabled?: boolean
  placeholder?: string
  showFlags?: boolean
  searchable?: boolean
  size?: "sm" | "md"
  className?: string
  "aria-label"?: string
  "aria-describedby"?: string
  id?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

const CountryCombobox = React.forwardRef<HTMLDivElement, CountryComboboxProps>(
  (
    {
      value,
      onChange,
      countries = DEFAULT_COUNTRIES,
      disabled = false,
      placeholder = "Select country...",
      showFlags = true,
      searchable = true,
      size = "md",
      className,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      id
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    // Get selected country
    const selectedCountry = React.useMemo(() => {
      if (!value) return null
      return countries.find(c => c.code === value) || null
    }, [value, countries])

    // Filter countries based on search
    const filteredCountries = React.useMemo(() => {
      if (!search.trim()) {
        // Show priority countries first when not searching
        const priorityCodes = getPriorityCountries().map(c => c.code)
        const priority = countries.filter(c => priorityCodes.includes(c.code))
        const others = countries.filter(c => !priorityCodes.includes(c.code))
        return [...priority, ...others]
      }
      
      const normalizedSearch = search.toLowerCase().trim()
      return countries.filter(country => 
        country.name.toLowerCase().includes(normalizedSearch) ||
        country.code.toLowerCase().includes(normalizedSearch) ||
        country.dial?.toLowerCase().includes(normalizedSearch)
      )
    }, [countries, search])

    // Reset search when closing
    React.useEffect(() => {
      if (!open) {
        setSearch("")
      }
    }, [open])

    // Handle selection
    const handleSelect = React.useCallback((countryCode: string) => {
      const newValue = countryCode === value ? null : countryCode as CountryCode
      onChange(newValue)
      setOpen(false)
      // Return focus to trigger
      setTimeout(() => triggerRef.current?.focus(), 0)
    }, [value, onChange])

    // Keyboard navigation for trigger
    const handleTriggerKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === "Escape" && open) {
        e.preventDefault()
        setOpen(false)
      }
    }, [open])

    // Compute display value
    const displayValue = React.useMemo(() => {
      if (!selectedCountry) return placeholder
      
      let display = ""
      if (showFlags && selectedCountry.flag) {
        display += `${selectedCountry.flag} `
      }
      display += selectedCountry.name
      if (selectedCountry.dial) {
        display += ` (${selectedCountry.dial})`
      }
      return display
    }, [selectedCountry, showFlags, placeholder])

    // Size classes
    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      md: "h-10 px-3 text-sm"
    }

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={ariaLabel || "Select country"}
              aria-describedby={ariaDescribedBy}
              aria-controls="country-listbox"
              onKeyDown={handleTriggerKeyDown}
              disabled={disabled}
              className={cn(
                "flex w-full items-center justify-between rounded-md border border-input bg-background",
                "ring-offset-background transition-colors",
                "hover:border-ring/50",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                sizeClasses[size],
                !selectedCountry && "text-muted-foreground"
              )}
            >
              <span className="flex-1 truncate text-left">{displayValue}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
            sideOffset={4}
          >
            <Command shouldFilter={false}>
              {searchable && (
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault()
                        setOpen(false)
                        triggerRef.current?.focus()
                      }
                      // Don't propagate to prevent Command's built-in filtering
                      e.stopPropagation()
                    }}
                    aria-label="Search countries"
                  />
                </div>
              )}
              
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                
                <ScrollArea className="h-[300px]">
                  <CommandGroup>
                    <div
                      role="listbox"
                      id="country-listbox"
                      aria-label="Countries"
                    >
                      {filteredCountries.map((country) => {
                        const isSelected = value === country.code
                        const isPriority = getPriorityCountries().some(p => p.code === country.code)
                        
                        return (
                          <CommandItem
                            key={country.code}
                            value={country.code}
                            onSelect={() => handleSelect(country.code)}
                            className={cn(
                              "flex items-center gap-2",
                              isPriority && !search && "font-medium"
                            )}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                              aria-hidden="true"
                            />
                            <span className="flex-1">
                              {showFlags && country.flag && (
                                <span className="mr-2" aria-hidden="true">{country.flag}</span>
                              )}
                              {country.name}
                              {country.dial && (
                                <span className="ml-2 text-muted-foreground">
                                  {country.dial}
                                </span>
                              )}
                            </span>
                          </CommandItem>
                        )
                      })}
                    </div>
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

CountryCombobox.displayName = "CountryCombobox"

export { CountryCombobox }
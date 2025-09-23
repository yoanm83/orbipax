# Combobox Primitive

A flexible combobox component that supports both typed option selection and free text input modes.

## Usage Modes

### 1. Typed Option Selection Mode

Use when you want users to select from a predefined set of typed options:

```typescript
<Combobox
  value={selectedOption}
  onChange={setSelectedOption}
  options={countries}
  getOptionKey={(country) => country.code}
  getOptionLabel={(country) => country.name}
  getOptionSearchStrings={(country) => [country.name, country.code]}
  placeholder="Select country..."
/>
```

### 2. Free Text Mode

Use when you want to provide suggestions but allow free text input:

```typescript
<Combobox
  inputValue={textValue}
  onInputValueChange={setTextValue}
  options={suggestions}
  getOptionKey={(suggestion) => suggestion}
  getOptionLabel={(suggestion) => suggestion}
  getOptionSearchStrings={(suggestion) => [suggestion]}
  placeholder="Enter or select..."
/>
```

## API Reference

### Core Props

#### Typed Option Selection Mode
- `value?: T | null` - Currently selected option
- `onChange?: (value: T | null) => void` - Called when option is selected

#### Free Text Mode
- `inputValue?: string` - Current text in input field
- `onInputValueChange?: (value: string) => void` - Called on every keystroke
- `onOptionSelect?: (option: T | string) => void` - Called when suggestion is selected

### Required Props
- `options: T[]` - Array of available options
- `getOptionKey: (option: T) => string` - Unique key for each option
- `getOptionLabel: (option: T) => string` - Display text for option
- `getOptionSearchStrings: (option: T) => string[]` - Text used for filtering

### Optional Props
- `placeholder?: string` - Input placeholder text
- `disabled?: boolean` - Disable the input
- `noOptionsMessage?: React.ReactNode` - Message when no options match

## Mode Detection

The component automatically detects which mode to use:
- **Free Text Mode**: When both `inputValue` and `onInputValueChange` are provided
- **Typed Option Mode**: When `value` and `onChange` are provided

## Key Features

### Free Text Mode Benefits
- ✅ No input resets when typing non-matching text
- ✅ Stable focus - cursor never disappears
- ✅ Suggestions enhance UX without forcing selection
- ✅ Full keyboard navigation support

### Behavioral Differences

| Feature | Typed Option Mode | Free Text Mode |
|---------|------------------|----------------|
| Input Reset | Resets when no option matches | Never resets during typing |
| Value Storage | Stores full option object | Stores string value |
| Selection Required | Can enforce selection | Always allows free text |
| Clear Behavior | Sets to `null` | Sets to empty string |

## Examples

### Source Name with Category Suggestions
```typescript
const suggestions = category === 'OTA'
  ? ['Expedia', 'Booking Group', 'Despegar']
  : ['Website', 'Instagram', 'Facebook']

<Combobox
  inputValue={sourceName}
  onInputValueChange={setSourceName}
  options={suggestions}
  getOptionKey={(s) => s}
  getOptionLabel={(s) => s}
  getOptionSearchStrings={(s) => [s]}
  placeholder="Enter source name..."
/>
```

### Country Selection with Objects
```typescript
<Combobox
  value={selectedCountry}
  onChange={setSelectedCountry}
  options={countries}
  getOptionKey={(c) => c.code}
  getOptionLabel={(c) => c.name}
  getOptionSearchStrings={(c) => [c.name, c.code]}
  placeholder="Select country..."
/>
```

## Accessibility

- Full keyboard navigation (Arrow keys, Enter, Escape)
- ARIA attributes for screen readers
- Proper focus management
- Semantic markup structure
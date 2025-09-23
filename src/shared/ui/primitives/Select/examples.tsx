"use client";

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index";

// Example 1: Basic Select
export function BasicSelectExample() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="w-full max-w-sm">
      <Select
        label="Choose a fruit"
        placeholder="Select a fruit..."
        value={value}
        onValueChange={setValue}
      >
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Example 2: Select with Variants
export function SelectVariantsExample() {
  const [outlined, setOutlined] = useState<string>("");
  const [filled, setFilled] = useState<string>("");
  const [underlined, setUnderlined] = useState<string>("");

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
  ];

  return (
    <div className="space-y-6 w-full max-w-sm">
      {/* Outlined Variant */}
      <Select
        variant="outlined"
        label="Country (Outlined)"
        placeholder="Select a country..."
        value={outlined}
        onValueChange={setOutlined}
      >
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filled Variant */}
      <Select
        variant="filled"
        label="Country (Filled)"
        placeholder="Select a country..."
        value={filled}
        onValueChange={setFilled}
      >
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Underlined Variant */}
      <Select
        variant="underlined"
        label="Country (Underlined)"
        placeholder="Select a country..."
        value={underlined}
        onValueChange={setUnderlined}
      >
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Example 3: Select with States
export function SelectStatesExample() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="space-y-6 w-full max-w-sm">
      {/* Default State */}
      <Select
        label="Default State"
        placeholder="Select an option..."
        value={value}
        onValueChange={setValue}
        description="This is a normal select field"
      >
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Success State */}
      <Select
        state="success"
        label="Success State"
        placeholder="Select an option..."
        defaultValue="option1"
        description="This field has been validated successfully"
      >
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Warning State */}
      <Select
        state="warning"
        label="Warning State"
        placeholder="Select an option..."
        description="Please review your selection"
      >
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Error State */}
      <Select
        state="error"
        label="Error State"
        placeholder="Select an option..."
        errorMessage="This field is required"
        required
      >
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {/* Disabled State */}
      <Select
        label="Disabled State"
        placeholder="Cannot select..."
        disabled
      >
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Example 4: Select with Sizes
export function SelectSizesExample() {
  const [small, setSmall] = useState<string>("");
  const [medium, setMedium] = useState<string>("");
  const [large, setLarge] = useState<string>("");

  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className="space-y-6 w-full max-w-sm">
      {/* Small Size */}
      <Select
        size="sm"
        label="Priority (Small)"
        placeholder="Select priority..."
        value={small}
        onValueChange={setSmall}
      >
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Medium Size */}
      <Select
        size="md"
        label="Priority (Medium)"
        placeholder="Select priority..."
        value={medium}
        onValueChange={setMedium}
      >
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Large Size */}
      <Select
        size="lg"
        label="Priority (Large)"
        placeholder="Select priority..."
        value={large}
        onValueChange={setLarge}
      >
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Example 5: Advanced Select with Groups
export function AdvancedSelectExample() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="w-full max-w-sm">
      <Select
        label="Select Technology"
        placeholder="Choose a technology..."
        value={value}
        onValueChange={setValue}
        description="Pick your preferred technology stack"
      >
        <SelectContent>
          {/* Frontend Technologies */}
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Frontend
          </div>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue.js</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>

          {/* Backend Technologies */}
          <div className="border-t border-border my-1"></div>
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Backend
          </div>
          <SelectItem value="nodejs">Node.js</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="golang">Go</SelectItem>

          {/* Databases */}
          <div className="border-t border-border my-1"></div>
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Database
          </div>
          <SelectItem value="postgresql">PostgreSQL</SelectItem>
          <SelectItem value="mongodb">MongoDB</SelectItem>
          <SelectItem value="mysql">MySQL</SelectItem>
          <SelectItem value="redis">Redis</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Example 6: Form Integration
export function SelectFormExample() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    assignee: "",
    status: "",
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-fg">Create New Task</h3>

      <Select
        label="Category"
        placeholder="Select category..."
        value={formData.category}
        onValueChange={handleChange("category")}
        required
      >
        <SelectContent>
          <SelectItem value="bug">Bug Report</SelectItem>
          <SelectItem value="feature">Feature Request</SelectItem>
          <SelectItem value="improvement">Improvement</SelectItem>
          <SelectItem value="documentation">Documentation</SelectItem>
        </SelectContent>
      </Select>

      <Select
        label="Priority"
        placeholder="Select priority..."
        value={formData.priority}
        onValueChange={handleChange("priority")}
        required
      >
        <SelectContent>
          <SelectItem value="low">🟢 Low</SelectItem>
          <SelectItem value="medium">🟡 Medium</SelectItem>
          <SelectItem value="high">🟠 High</SelectItem>
          <SelectItem value="urgent">🔴 Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select
        label="Assignee"
        placeholder="Select assignee..."
        value={formData.assignee}
        onValueChange={handleChange("assignee")}
      >
        <SelectContent>
          <SelectItem value="john">John Doe</SelectItem>
          <SelectItem value="jane">Jane Smith</SelectItem>
          <SelectItem value="mike">Mike Johnson</SelectItem>
          <SelectItem value="sarah">Sarah Wilson</SelectItem>
        </SelectContent>
      </Select>

      <Select
        label="Status"
        placeholder="Select status..."
        value={formData.status}
        onValueChange={handleChange("status")}
        defaultValue="todo"
      >
        <SelectContent>
          <SelectItem value="todo">📝 To Do</SelectItem>
          <SelectItem value="inprogress">⚡ In Progress</SelectItem>
          <SelectItem value="review">👀 In Review</SelectItem>
          <SelectItem value="done">✅ Done</SelectItem>
        </SelectContent>
      </Select>

      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-fg mb-2">Form Data:</h4>
        <pre className="text-xs bg-muted p-3 rounded text-on-muted">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
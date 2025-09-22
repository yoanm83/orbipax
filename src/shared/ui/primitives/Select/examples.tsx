"use client";

import { useState } from "react";

import { Select } from "./index";

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
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
          <Select.Item value="grape">Grape</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
        </Select.Content>
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
        <Select.Content>
          {countries.map((country) => (
            <Select.Item key={country.value} value={country.value}>
              {country.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {/* Filled Variant */}
      <Select
        variant="filled"
        label="Country (Filled)"
        placeholder="Select a country..."
        value={filled}
        onValueChange={setFilled}
      >
        <Select.Content>
          {countries.map((country) => (
            <Select.Item key={country.value} value={country.value}>
              {country.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {/* Underlined Variant */}
      <Select
        variant="underlined"
        label="Country (Underlined)"
        placeholder="Select a country..."
        value={underlined}
        onValueChange={setUnderlined}
      >
        <Select.Content>
          {countries.map((country) => (
            <Select.Item key={country.value} value={country.value}>
              {country.label}
            </Select.Item>
          ))}
        </Select.Content>
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
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.Content>
      </Select>

      {/* Success State */}
      <Select
        state="success"
        label="Success State"
        placeholder="Select an option..."
        defaultValue="option1"
        description="This field has been validated successfully"
      >
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.Content>
      </Select>

      {/* Warning State */}
      <Select
        state="warning"
        label="Warning State"
        placeholder="Select an option..."
        description="Please review your selection"
      >
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.Content>
      </Select>

      {/* Error State */}
      <Select
        state="error"
        label="Error State"
        placeholder="Select an option..."
        errorMessage="This field is required"
        required
      >
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.Content>
      </Select>

      {/* Disabled State */}
      <Select
        label="Disabled State"
        placeholder="Cannot select..."
        disabled
      >
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.Content>
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
        <Select.Content>
          {priorities.map((priority) => (
            <Select.Item key={priority.value} value={priority.value}>
              {priority.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {/* Medium Size */}
      <Select
        size="md"
        label="Priority (Medium)"
        placeholder="Select priority..."
        value={medium}
        onValueChange={setMedium}
      >
        <Select.Content>
          {priorities.map((priority) => (
            <Select.Item key={priority.value} value={priority.value}>
              {priority.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {/* Large Size */}
      <Select
        size="lg"
        label="Priority (Large)"
        placeholder="Select priority..."
        value={large}
        onValueChange={setLarge}
      >
        <Select.Content>
          {priorities.map((priority) => (
            <Select.Item key={priority.value} value={priority.value}>
              {priority.label}
            </Select.Item>
          ))}
        </Select.Content>
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
        <Select.Content>
          {/* Frontend Technologies */}
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Frontend
          </div>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="vue">Vue.js</Select.Item>
          <Select.Item value="angular">Angular</Select.Item>
          <Select.Item value="svelte">Svelte</Select.Item>

          {/* Backend Technologies */}
          <div className="border-t border-border my-1"></div>
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Backend
          </div>
          <Select.Item value="nodejs">Node.js</Select.Item>
          <Select.Item value="python">Python</Select.Item>
          <Select.Item value="java">Java</Select.Item>
          <Select.Item value="golang">Go</Select.Item>

          {/* Databases */}
          <div className="border-t border-border my-1"></div>
          <div className="px-2 py-1.5 text-xs font-semibold text-on-muted">
            Database
          </div>
          <Select.Item value="postgresql">PostgreSQL</Select.Item>
          <Select.Item value="mongodb">MongoDB</Select.Item>
          <Select.Item value="mysql">MySQL</Select.Item>
          <Select.Item value="redis">Redis</Select.Item>
        </Select.Content>
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
        <Select.Content>
          <Select.Item value="bug">Bug Report</Select.Item>
          <Select.Item value="feature">Feature Request</Select.Item>
          <Select.Item value="improvement">Improvement</Select.Item>
          <Select.Item value="documentation">Documentation</Select.Item>
        </Select.Content>
      </Select>

      <Select
        label="Priority"
        placeholder="Select priority..."
        value={formData.priority}
        onValueChange={handleChange("priority")}
        required
      >
        <Select.Content>
          <Select.Item value="low">🟢 Low</Select.Item>
          <Select.Item value="medium">🟡 Medium</Select.Item>
          <Select.Item value="high">🟠 High</Select.Item>
          <Select.Item value="urgent">🔴 Urgent</Select.Item>
        </Select.Content>
      </Select>

      <Select
        label="Assignee"
        placeholder="Select assignee..."
        value={formData.assignee}
        onValueChange={handleChange("assignee")}
      >
        <Select.Content>
          <Select.Item value="john">John Doe</Select.Item>
          <Select.Item value="jane">Jane Smith</Select.Item>
          <Select.Item value="mike">Mike Johnson</Select.Item>
          <Select.Item value="sarah">Sarah Wilson</Select.Item>
        </Select.Content>
      </Select>

      <Select
        label="Status"
        placeholder="Select status..."
        value={formData.status}
        onValueChange={handleChange("status")}
        defaultValue="todo"
      >
        <Select.Content>
          <Select.Item value="todo">📝 To Do</Select.Item>
          <Select.Item value="inprogress">⚡ In Progress</Select.Item>
          <Select.Item value="review">👀 In Review</Select.Item>
          <Select.Item value="done">✅ Done</Select.Item>
        </Select.Content>
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
"use client";

import { z } from "zod";

import { Button } from "../Button";
import { Input } from "../Input";
import { useToast } from "../Toast";

import { FormProvider, FormField, FormActions, FormGroup } from "./form-provider";

// Example 1: Simple Contact Form
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactFormExample() {
  const { promise } = useToast();

  const handleSubmit = async (data: ContactForm) => {
    await promise(
      // Simulate API call
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Sending message...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      }
    );
  };

  return (
    <FormProvider
      schema={contactSchema}
      defaultValues={{
        name: "",
        email: "",
        phone: "",
        message: "",
      }}
      onSubmit={handleSubmit}
      layout="vertical"
      spacing="md"
    >
      <FormField<ContactForm>
        name="name"
        label="Full Name"
        required
        description="Enter your legal name"
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="John Doe"
          />
        )}
      </FormField>

      <FormField<ContactForm>
        name="email"
        label="Email Address"
        required
        description="We'll never share your email"
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="john@example.com"
          />
        )}
      </FormField>

      <FormField<ContactForm>
        name="phone"
        label="Phone Number"
        description="Optional - for urgent matters"
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            type="tel"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="+1 (555) 123-4567"
          />
        )}
      </FormField>

      <FormField<ContactForm>
        name="message"
        label="Message"
        required
        description="Tell us how we can help you"
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            multiline
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="Your message here..."
          />
        )}
      </FormField>

      <FormActions align="right">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit" intent="primary">
          Send Message
        </Button>
      </FormActions>
    </FormProvider>
  );
}

// Example 2: User Registration Form with Groups
const registrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),

  // Account Information
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),

  // Preferences
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function RegistrationFormExample() {
  const { promise } = useToast();

  const handleSubmit = async (data: RegistrationForm) => {
    await promise(
      // Simulate registration API call
      new Promise<void>((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Creating account...",
        success: "Account created successfully! Welcome aboard!",
        error: "Registration failed. Please try again.",
      }
    );
  };

  return (
    <FormProvider
      schema={registrationSchema}
      defaultValues={{
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        newsletter: false,
        terms: false,
      }}
      onSubmit={handleSubmit}
      layout="vertical"
      spacing="lg"
      className="max-w-md mx-auto"
    >
      <FormGroup title="Personal Information" description="Tell us about yourself">
        <FormField<RegistrationForm>
          name="firstName"
          label="First Name"
          required
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="John"
            />
          )}
        </FormField>

        <FormField<RegistrationForm>
          name="lastName"
          label="Last Name"
          required
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="Doe"
            />
          )}
        </FormField>

        <FormField<RegistrationForm>
          name="dateOfBirth"
          label="Date of Birth"
          required
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
            />
          )}
        </FormField>
      </FormGroup>

      <FormGroup title="Account Information" description="Create your account credentials">
        <FormField<RegistrationForm>
          name="username"
          label="Username"
          required
          description="This will be your unique identifier"
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="johndoe123"
            />
          )}
        </FormField>

        <FormField<RegistrationForm>
          name="email"
          label="Email Address"
          required
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="john@example.com"
            />
          )}
        </FormField>

        <FormField<RegistrationForm>
          name="password"
          label="Password"
          required
          description="Must be at least 8 characters with uppercase, lowercase, and number"
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              type="password"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="••••••••"
            />
          )}
        </FormField>

        <FormField<RegistrationForm>
          name="confirmPassword"
          label="Confirm Password"
          required
        >
          {({ value, onChange, onBlur, error, invalid }) => (
            <Input
              type="password"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              state={invalid ? "error" : "default"}
              errorMessage={error}
              placeholder="••••••••"
            />
          )}
        </FormField>
      </FormGroup>

      <FormActions align="center">
        <Button variant="outline" type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" intent="primary" size="lg">
          Create Account
        </Button>
      </FormActions>
    </FormProvider>
  );
}

// Example 3: Inline Search Form
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  category: z.string().optional(),
  sortBy: z.enum(["relevance", "date", "popularity"]).default("relevance"),
});

type SearchForm = z.infer<typeof searchSchema>;

export function SearchFormExample() {
  const { info } = useToast();

  const handleSubmit = async (data: SearchForm) => {
    // Handle search with toast notification
    info("Search started", `Searching for: "${data.query}"`);
  };

  return (
    <FormProvider
      schema={searchSchema}
      defaultValues={{
        query: "",
        category: "",
        sortBy: "relevance" as const,
      }}
      onSubmit={handleSubmit}
      layout="inline"
      className="bg-muted p-4 rounded-md"
    >
      <FormField<SearchForm>
        name="query"
        label="Search"
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="Search products..."
            className="min-w-64"
          />
        )}
      </FormField>

      <Button type="submit" intent="primary">
        Search
      </Button>
    </FormProvider>
  );
}
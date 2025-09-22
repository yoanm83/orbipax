"use client";

import { useState } from "react";

import { Button } from "../Button";
import { useToast } from "../Toast";

import { Textarea } from "./index";
import type { TextareaVariants } from "./index";

// Example 1: Basic Textarea
export function BasicTextareaExample() {
  const { info } = useToast();
  const [value, setValue] = useState("");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    info("Textarea Updated", `Content length: ${newValue.length} characters`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Textarea</h4>

      <div className="space-y-4">
        <Textarea
          label="Message"
          placeholder="Enter your message here..."
          value={value}
          onValueChange={handleValueChange}
          description="Share your thoughts with us"
        />

        <div className="text-xs text-on-muted">
          Current length: <span className="font-medium">{value.length}</span> characters
        </div>
      </div>
    </div>
  );
}

// Example 2: Textarea Sizes
export function TextareaSizesExample() {
  const sizes: Array<TextareaVariants["size"]> = ["sm", "md", "lg"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Textarea Sizes</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sizes.map((size) => (
          <div key={size} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">{size}</h5>
            <Textarea
              size={size}
              label={`${size.toUpperCase()} Size`}
              placeholder={`This is a ${size} textarea`}
              defaultValue={`Sample text in ${size} size`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Textarea Variants
export function TextareaVariantsExample() {
  const variants: Array<TextareaVariants["variant"]> = ["outlined", "filled", "underlined", "ghost"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Textarea Variants</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">{variant}</h5>
            <Textarea
              variant={variant}
              label={`${variant} Textarea`}
              placeholder={`This is a ${variant} style textarea`}
              defaultValue={`Sample content for ${variant} variant`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: Auto-Resize Textarea
export function AutoResizeTextareaExample() {
  const { info } = useToast();
  const [content, setContent] = useState("Start typing and watch the textarea grow automatically!\n\nThis textarea will resize based on its content.\n\nTry adding more lines...");

  const handleChange = (value: string) => {
    setContent(value);
    const lines = value.split('\n').length;
    info("Auto-Resize", `Content now has ${lines} lines`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Auto-Resize Textarea</h4>

      <div className="space-y-4">
        <Textarea
          label="Auto-Resizing Content"
          value={content}
          onValueChange={handleChange}
          autoResize={true}
          minRows={3}
          maxRows={10}
          placeholder="Start typing to see auto-resize in action..."
          description="This textarea automatically adjusts its height (min: 3 rows, max: 10 rows)"
        />

        <div className="text-xs text-on-muted">
          Lines: <span className="font-medium">{content.split('\n').length}</span>
        </div>
      </div>
    </div>
  );
}

// Example 5: Character Count Textarea
export function CharacterCountTextareaExample() {
  const { info, warning, error } = useToast();
  const [message, setMessage] = useState("");

  const handleCharacterCountChange = (count: number, maxLength?: number) => {
    if (!maxLength) { return; }

    if (count >= maxLength) {
      error("Character Limit", "Maximum character limit reached!");
    } else if (count >= maxLength * 0.9) {
      warning("Character Limit", "Approaching character limit");
    } else if (count >= maxLength * 0.5) {
      info("Character Count", `${count} characters used`);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Character Count</h4>

      <div className="space-y-4">
        <Textarea
          label="Tweet Message"
          value={message}
          onValueChange={setMessage}
          maxLength={280}
          characterCount={true}
          onCharacterCountChange={handleCharacterCountChange}
          placeholder="What's happening?"
          description="Share your thoughts (max 280 characters)"
        />

        <div className="flex justify-between items-center text-xs">
          <span className="text-on-muted">
            Remaining: <span className="font-medium">{280 - message.length}</span>
          </span>
          <span className={`font-medium ${
            message.length >= 280 ? "text-error" :
            message.length >= 252 ? "text-warning" :
            "text-success"
          }`}>
            {message.length >= 280 ? "Limit reached" :
             message.length >= 252 ? "Almost full" :
             "Good to go"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Example 6: Form Textarea with Validation
export function FormTextareaExample() {
  const { success, error } = useToast();
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateFeedback = (value: string) => {
    if (value.length < 10) {
      setHasError(true);
      return "Feedback must be at least 10 characters long";
    }
    if (value.length > 500) {
      setHasError(true);
      return "Feedback must not exceed 500 characters";
    }
    setHasError(false);
    return "";
  };

  const handleSubmit = () => {
    const errorMsg = validateFeedback(feedback);
    if (errorMsg) {
      error("Validation Error", errorMsg);
      return;
    }

    setIsSubmitted(true);
    success("Feedback Submitted", "Thank you for your feedback!");

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedback("");
    }, 3000);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Form Validation</h4>

      <div className="space-y-4">
        <Textarea
          label="Customer Feedback"
          value={feedback}
          onValueChange={(value) => {
            setFeedback(value);
            validateFeedback(value);
          }}
          required={true}
          characterCount={true}
          maxLength={500}
          minRows={4}
          placeholder="Tell us about your experience..."
          errorMessage={hasError ? validateFeedback(feedback) : ""}
          successMessage={isSubmitted ? "Feedback submitted successfully!" : ""}
          description="Please provide detailed feedback (minimum 10 characters)"
        />

        <Button
          onClick={handleSubmit}
          disabled={hasError || feedback.length < 10 || isSubmitted}
          className="w-full"
        >
          {isSubmitted ? "Submitted!" : "Submit Feedback"}
        </Button>
      </div>
    </div>
  );
}

// Example 7: Different States
export function TextareaStatesExample() {
  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Textarea States</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Textarea
            label="Default State"
            placeholder="Normal textarea"
            description="This is the default state"
          />

          <Textarea
            label="Error State"
            state="error"
            defaultValue="Invalid input"
            errorMessage="This field contains an error"
          />
        </div>

        <div className="space-y-4">
          <Textarea
            label="Success State"
            state="success"
            defaultValue="Valid content"
            successMessage="This field is valid"
          />

          <Textarea
            label="Warning State"
            state="warning"
            defaultValue="Needs attention"
            warningMessage="Please review this content"
          />
        </div>
      </div>
    </div>
  );
}

// Example 8: Disabled and ReadOnly
export function DisabledReadOnlyTextareaExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Disabled & ReadOnly</h4>

      <div className="space-y-4">
        <Textarea
          label="Disabled Textarea"
          disabled={true}
          defaultValue="This textarea is disabled and cannot be edited"
          description="This textarea is completely disabled"
        />

        <Textarea
          label="ReadOnly Textarea"
          readOnly={true}
          defaultValue="This textarea is read-only. You can select and copy this text but cannot edit it."
          description="This textarea is read-only but focusable"
        />
      </div>
    </div>
  );
}

// Example 9: Custom Resize Options
export function ResizeTextareaExample() {
  const resizeOptions: Array<TextareaVariants["resize"]> = ["none", "vertical", "horizontal", "both"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Resize Options</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resizeOptions.map((resize) => (
          <div key={resize} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">
              {resize === "none" ? "No Resize" : `${resize} Resize`}
            </h5>
            <Textarea
              label={`${resize} Resize`}
              resize={resize}
              defaultValue={`This textarea can be resized ${resize === "none" ? "not at all" : resize}. Drag the resize handle to test.`}
              description={`Resize: ${resize}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 10: Advanced Features
export function AdvancedTextareaExample() {
  const { info } = useToast();
  const [essay, setEssay] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleEssayChange = (value: string) => {
    setEssay(value);
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    const newWordCount = words.length;
    setWordCount(newWordCount);

    if (newWordCount > 0 && newWordCount % 50 === 0) {
      info("Word Count", `You've written ${newWordCount} words!`);
    }
  };

  const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Advanced Essay Editor</h4>

      <div className="space-y-4">
        <Textarea
          label="Essay Content"
          value={essay}
          onValueChange={handleEssayChange}
          autoResize={true}
          minRows={5}
          maxRows={20}
          characterCount={true}
          maxLength={5000}
          placeholder="Write your essay here..."
          description="Your essay will auto-resize as you type. Aim for 300-500 words."
          variant="filled"
          size="lg"
        />

        <div className="flex justify-between items-center p-3 bg-muted rounded-md text-xs">
          <div className="space-y-1">
            <div className="text-on-muted">
              Words: <span className="font-medium text-fg">{wordCount}</span>
            </div>
            <div className="text-on-muted">
              Reading time: <span className="font-medium text-fg">
                {estimatedReadingTime} min{estimatedReadingTime !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className={`font-medium ${
              wordCount < 300 ? "text-warning" :
              wordCount > 500 ? "text-error" :
              "text-success"
            }`}>
              {wordCount < 300 ? "Too short" :
               wordCount > 500 ? "Too long" :
               "Good length"}
            </div>
            <div className="text-on-muted">
              Target: 300-500 words
            </div>
          </div>
        </div>

        <Button
          disabled={wordCount < 300 || wordCount > 500}
          onClick={() => info("Essay", "Essay submitted for review!")}
          className="w-full"
        >
          Submit Essay
        </Button>
      </div>
    </div>
  );
}
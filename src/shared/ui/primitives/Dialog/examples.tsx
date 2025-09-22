"use client";

import { useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { useToast } from "../Toast";

import { Dialog } from "./index";
import type { DialogVariants } from "./index";

// Example 1: Basic Dialog
export function BasicDialogExample() {
  const { info } = useToast();

  const handleConfirm = () => {
    info("Action Confirmed", "The basic dialog action was confirmed");
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Dialog</h4>

      <Dialog>
        <Dialog.Trigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Basic Dialog</Dialog.Title>
            <Dialog.Description>
              This is a basic dialog example with a title, description, and action buttons.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <p className="text-sm text-on-muted">
              You can put any content here. This dialog demonstrates the basic structure
              and functionality of our Dialog component.
            </p>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={handleConfirm}>Confirm</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

// Example 2: Dialog Sizes
export function DialogSizesExample() {
  const sizes: Array<DialogVariants["size"]> = ["xs", "sm", "md", "lg", "xl", "full"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Dialog Sizes</h4>

      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => (
          <Dialog key={size}>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm">
                {size.toUpperCase()}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content size={size}>
              <Dialog.Header>
                <Dialog.Title>{size.toUpperCase()} Dialog</Dialog.Title>
                <Dialog.Description>
                  This is a {size} sized dialog demonstrating different size variants.
                </Dialog.Description>
              </Dialog.Header>

              <Dialog.Body>
                <p className="text-sm text-on-muted">
                  Size: {size}. Each size variant provides different dimensions for various use cases.
                  {size === "full" && " The full size dialog takes up most of the screen real estate."}
                  {size === "xs" && " The extra small dialog is perfect for simple confirmations."}
                  {size === "xl" && " The extra large dialog provides ample space for complex forms."}
                </p>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        ))}
      </div>
    </div>
  );
}

// Example 3: Dialog Variants
export function DialogVariantsExample() {
  const variants: Array<DialogVariants["variant"]> = ["default", "destructive", "success", "warning"];

  const getVariantContent = (variant: DialogVariants["variant"]) => {
    switch (variant) {
      case "destructive":
        return {
          title: "Delete Account",
          description: "This action cannot be undone. This will permanently delete your account.",
          content: "Are you sure you want to delete your account? All of your data will be lost forever."
        };
      case "success":
        return {
          title: "Operation Successful",
          description: "Your action has been completed successfully.",
          content: "The operation completed without any errors. You can continue with your work."
        };
      case "warning":
        return {
          title: "Warning",
          description: "Please review the following information before proceeding.",
          content: "This action may have consequences. Make sure you understand the implications."
        };
      default:
        return {
          title: "Default Dialog",
          description: "This is a standard dialog with default styling.",
          content: "This dialog uses the default variant styling and behavior."
        };
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Dialog Variants</h4>

      <div className="flex flex-wrap gap-4">
        {variants.map((variant) => {
          const content = getVariantContent(variant);
          return (
            <Dialog key={variant}>
              <Dialog.Trigger asChild>
                <Button
                  variant={variant === "destructive" ? "destructive" : "outline"}
                  size="sm"
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              </Dialog.Trigger>

              <Dialog.Content variant={variant}>
                <Dialog.Header>
                  <Dialog.Title>{content.title}</Dialog.Title>
                  <Dialog.Description>{content.description}</Dialog.Description>
                </Dialog.Header>

                <Dialog.Body>
                  <p className="text-sm text-on-muted">{content.content}</p>
                </Dialog.Body>

                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button variant={variant === "destructive" ? "destructive" : "default"}>
                      {variant === "destructive" ? "Delete" : "Confirm"}
                    </Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}

// Example 4: Form Dialog
export function FormDialogExample() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      error("Validation Error", "Please fill in all required fields");
      return;
    }

    success("Form Submitted", "Your contact form has been submitted successfully");
    setIsOpen(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Form Dialog</h4>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button>Contact Us</Button>
        </Dialog.Trigger>

        <Dialog.Content size="lg">
          <Dialog.Header>
            <Dialog.Title>Contact Form</Dialog.Title>
            <Dialog.Description>
              Send us a message and we'll get back to you as soon as possible.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div className="space-y-4">
              <Input
                label="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />

              <Input
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />

              <Textarea
                label="Message"
                required
                value={formData.message}
                onValueChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                placeholder="Tell us how we can help you..."
                minRows={3}
                maxLength={500}
                characterCount
              />
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleSubmit}>Send Message</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

// Example 5: Confirmation Dialog
export function ConfirmationDialogExample() {
  const { success, info } = useToast();
  const [itemCount, setItemCount] = useState(5);

  const handleDelete = () => {
    setItemCount(0);
    success("Items Deleted", `Successfully deleted ${itemCount} items`);
  };

  const handleCancel = () => {
    info("Action Cancelled", "Delete operation was cancelled");
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Confirmation Dialog</h4>

      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <div className="text-sm font-medium mb-2">Shopping Cart</div>
          <div className="text-xs text-on-muted">
            Items in cart: <span className="font-medium">{itemCount}</span>
          </div>
        </div>

        <Dialog>
          <Dialog.Trigger asChild>
            <Button variant="destructive" disabled={itemCount === 0}>
              Clear Cart
            </Button>
          </Dialog.Trigger>

          <Dialog.Content variant="destructive" size="sm">
            <Dialog.Header>
              <Dialog.Title>Clear Shopping Cart</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to remove all items from your cart?
              </Dialog.Description>
            </Dialog.Header>

            <Dialog.Body>
              <div className="space-y-3">
                <p className="text-sm text-on-muted">
                  This action cannot be undone. All {itemCount} items will be removed from your cart.
                </p>

                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-xs text-destructive font-medium">
                      Warning: This action is irreversible
                    </span>
                  </div>
                </div>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Keep Items
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="destructive" onClick={handleDelete}>
                  Clear Cart
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>

        {itemCount === 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setItemCount(5)}
            className="w-full"
          >
            Add Items Back
          </Button>
        )}
      </div>
    </div>
  );
}

// Example 6: Scrollable Dialog
export function ScrollableDialogExample() {
  const generateContent = () => {
    const sections = [
      "Introduction",
      "Getting Started",
      "Basic Concepts",
      "Advanced Features",
      "Best Practices",
      "Common Patterns",
      "Troubleshooting",
      "Performance Tips",
      "Security Considerations",
      "Conclusion"
    ];

    return sections.map((section, index) => (
      <div key={section} className="space-y-2">
        <h4 className="font-semibold text-fg">{index + 1}. {section}</h4>
        <p className="text-sm text-on-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    ));
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Scrollable Dialog</h4>

      <Dialog>
        <Dialog.Trigger asChild>
          <Button variant="outline">View Documentation</Button>
        </Dialog.Trigger>

        <Dialog.Content size="lg">
          <Dialog.Header>
            <Dialog.Title>Component Documentation</Dialog.Title>
            <Dialog.Description>
              Comprehensive guide to using our UI components effectively.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {generateContent()}
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
            <Button>Download PDF</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

// Example 7: Nested Dialogs
export function NestedDialogExample() {
  const { info } = useToast();

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Nested Dialogs</h4>

      <Dialog>
        <Dialog.Trigger asChild>
          <Button variant="outline">Open Settings</Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>
              Manage your application preferences and configurations.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Notification Settings</h5>
                <p className="text-xs text-on-muted">Configure how you receive notifications</p>
              </div>

              <Dialog>
                <Dialog.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Advanced Notifications
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content size="sm">
                  <Dialog.Header>
                    <Dialog.Title>Advanced Notifications</Dialog.Title>
                    <Dialog.Description>
                      Fine-tune your notification preferences.
                    </Dialog.Description>
                  </Dialog.Header>

                  <Dialog.Body>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>Push notifications</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>SMS notifications</span>
                      </label>
                    </div>
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Dialog.Close asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Button onClick={() => info("Settings", "Notification settings saved")}>
                        Save
                      </Button>
                    </Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

// Example 8: Custom Styled Dialog
export function CustomStyledDialogExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Custom Styled Dialog</h4>

      <Dialog>
        <Dialog.Trigger asChild>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Open Custom Dialog
          </Button>
        </Dialog.Trigger>

        <Dialog.Content
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
          showCloseButton={false}
        >
          <Dialog.Header className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <Dialog.Title className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Feature
            </Dialog.Title>
            <Dialog.Description className="text-purple-600">
              Unlock advanced capabilities with our premium plan.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div className="space-y-4 text-center">
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Integrations",
                  "Unlimited Storage"
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex-col space-y-2">
            <Dialog.Close asChild>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Upgrade Now
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" className="text-purple-600">
                Maybe later
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
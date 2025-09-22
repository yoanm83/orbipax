"use client";

import { useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { useToast } from "../Toast";

import { EmptyState } from "./index";
import type { EmptyStateVariants } from "./index";

// Example 1: Basic Empty State
export function BasicEmptyStateExample() {
  const { info } = useToast();

  const handleAction = () => {
    info("Action Triggered", "Empty state action was triggered");
  };

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Basic Empty State</h4>

      <div className="border border-border rounded-lg p-4 min-h-64">
        <EmptyState
          icon={<EmptyState.Icons.default />}
          title="No items found"
          description="There are no items to display at the moment. Start by creating your first item."
          actions={
            <Button onClick={handleAction}>
              Create Item
            </Button>
          }
        />
      </div>
    </div>
  );
}

// Example 2: Empty State Sizes
export function EmptyStateSizesExample() {
  const sizes: Array<EmptyStateVariants["size"]> = ["sm", "md", "lg", "xl"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Empty State Sizes</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sizes.map((size) => (
          <div key={size} className="border border-border rounded-lg p-4 min-h-48">
            <EmptyState
              size={size}
              icon={<EmptyState.Icons.document />}
              title={`${size.toUpperCase()} Size`}
              description={`This is a ${size} sized empty state component.`}
              actions={<Button size={size === "sm" ? "sm" : "md"}>Action</Button>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Empty State Variants
export function EmptyStateVariantsExample() {
  const variants: Array<EmptyStateVariants["variant"]> = ["default", "minimal", "illustrated", "onboarding", "error"];

  const getVariantContent = (variant: EmptyStateVariants["variant"]) => {
    switch (variant) {
      case "minimal":
        return {
          icon: <EmptyState.Icons.search />,
          title: "No results",
          description: "Try adjusting your search or filter to find what you're looking for."
        };
      case "illustrated":
        return {
          icon: <EmptyState.Icons.folder />,
          title: "No files uploaded",
          description: "Upload your first file to get started with document management."
        };
      case "onboarding":
        return {
          icon: <EmptyState.Icons.star />,
          title: "Welcome aboard!",
          description: "Let's get you started with your first project. It only takes a few minutes."
        };
      case "error":
        return {
          icon: <EmptyState.Icons.error />,
          title: "Something went wrong",
          description: "We encountered an error while loading your data. Please try again."
        };
      default:
        return {
          icon: <EmptyState.Icons.default />,
          title: "Default state",
          description: "This is the default empty state variant."
        };
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Empty State Variants</h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {variants.map((variant) => {
          const content = getVariantContent(variant);
          return (
            <div key={variant} className="border border-border rounded-lg p-4 min-h-64">
              <EmptyState
                variant={variant}
                icon={content.icon}
                title={content.title}
                description={content.description}
                actions={
                  <Button variant={variant === "error" ? "destructive" : "default"}>
                    {variant === "error" ? "Try Again" :
                     variant === "onboarding" ? "Get Started" : "Action"}
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Example 4: Search Results Empty State
export function SearchEmptyStateExample() {
  const { info } = useToast();
  const [searchTerm, setSearchTerm] = useState("nonexistent");
  const [showEmpty, setShowEmpty] = useState(true);

  const handleNewSearch = () => {
    setSearchTerm("");
    setShowEmpty(false);
    info("Search Cleared", "Search has been cleared. Try a new search.");
  };

  const handleClearFilters = () => {
    info("Filters Cleared", "All filters have been removed.");
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <h4 className="text-sm font-medium text-fg">Search Results Empty State</h4>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setShowEmpty(true)}>Search</Button>
        </div>

        {showEmpty && (
          <div className="border border-border rounded-lg p-4 min-h-80">
            <EmptyState
              variant="minimal"
              icon={<EmptyState.Icons.search />}
              title={`No results for "${searchTerm}"`}
              description="We couldn't find any items matching your search criteria. Try adjusting your search terms or clearing filters."
              actions={
                <EmptyState.Actions>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleNewSearch}>
                    New Search
                  </Button>
                </EmptyState.Actions>
              }
            />
          </div>
        )}

        {!showEmpty && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-on-muted">Enter a search term and click "Search" to see the empty state.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 5: Inbox Empty State
export function InboxEmptyStateExample() {
  const { success } = useToast();

  const handleComposeEmail = () => {
    success("Email Composer", "Email composer opened successfully");
  };

  const handleCheckSettings = () => {
    success("Settings", "Email settings opened");
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Inbox Empty State</h4>

      <div className="border border-border rounded-lg p-4 min-h-96">
        <EmptyState
          size="lg"
          icon={<EmptyState.Icons.inbox />}
          title="Inbox Zero! 🎉"
          description="Great job! You've read all your emails. Take a break or compose a new message to stay productive."
          actions={
            <EmptyState.Actions>
              <Button onClick={handleComposeEmail}>
                Compose Email
              </Button>
              <Button variant="outline" onClick={handleCheckSettings}>
                Email Settings
              </Button>
            </EmptyState.Actions>
          }
        />
      </div>
    </div>
  );
}

// Example 6: Team Members Empty State
export function TeamMembersEmptyStateExample() {
  const { info } = useToast();

  const handleInviteMembers = () => {
    info("Invite Sent", "Team invitation has been sent");
  };

  const handleImportContacts = () => {
    info("Import Started", "Contact import process started");
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Team Members Empty State</h4>

      <div className="border border-border rounded-lg p-4 min-h-80">
        <EmptyState
          variant="onboarding"
          icon={<EmptyState.Icons.users />}
          title="Build your team"
          description="Collaborate more effectively by inviting team members to join your workspace."
          actions={
            <EmptyState.Actions orientation="vertical">
              <Button onClick={handleInviteMembers} className="w-full">
                Invite Team Members
              </Button>
              <Button variant="outline" onClick={handleImportContacts} className="w-full">
                Import from Contacts
              </Button>
            </EmptyState.Actions>
          }
        />
      </div>
    </div>
  );
}

// Example 7: Error Empty State
export function ErrorEmptyStateExample() {
  const { info } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
      info("Retry Attempted", "Data loading was attempted again");
    }, 2000);
  };

  const handleContactSupport = () => {
    info("Support Contacted", "Support team has been notified");
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Error Empty State</h4>

      <div className="border border-border rounded-lg p-4 min-h-80">
        <EmptyState
          variant="error"
          icon={<EmptyState.Icons.error />}
          title="Failed to load data"
          description="We encountered an error while fetching your data. This might be due to a temporary network issue."
          actions={
            <EmptyState.Actions>
              <Button
                variant="destructive"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? "Retrying..." : "Try Again"}
              </Button>
              <Button variant="outline" onClick={handleContactSupport}>
                Contact Support
              </Button>
            </EmptyState.Actions>
          }
        />
      </div>
    </div>
  );
}

// Example 8: Horizontal Layout Empty State
export function HorizontalEmptyStateExample() {
  const { info } = useToast();

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Horizontal Layout</h4>

      <div className="border border-border rounded-lg p-6 min-h-64">
        <EmptyState
          layout="horizontal"
          size="lg"
          icon={<EmptyState.Icons.document />}
          title="No documents uploaded"
          description="Upload your first document to start organizing your files. Supported formats include PDF, DOC, DOCX, and more."
          actions={
            <EmptyState.Actions orientation="vertical">
              <Button onClick={() => info("Upload", "File upload dialog opened")}>
                Upload Documents
              </Button>
              <Button variant="outline" onClick={() => info("Browse", "File browser opened")}>
                Browse Examples
              </Button>
            </EmptyState.Actions>
          }
        />
      </div>
    </div>
  );
}

// Example 9: Custom Illustration Empty State
export function CustomIllustrationEmptyStateExample() {
  const { info } = useToast();

  // Custom SVG illustration
  const customIllustration = (
    <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "currentColor", stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: "currentColor", stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* Rocket illustration */}
      <ellipse cx="100" cy="180" rx="30" ry="8" fill="url(#grad1)" />
      <rect x="90" y="120" width="20" height="60" rx="10" fill="currentColor" opacity="0.3" />
      <polygon points="85,120 100,80 115,120" fill="currentColor" opacity="0.4" />
      <circle cx="100" cy="95" r="8" fill="currentColor" opacity="0.6" />
      <polygon points="75,140 85,130 85,150" fill="currentColor" opacity="0.3" />
      <polygon points="125,140 115,130 115,150" fill="currentColor" opacity="0.3" />

      {/* Stars */}
      <circle cx="50" cy="40" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="150" cy="30" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="170" cy="60" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="70" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Custom Illustration</h4>

      <div className="border border-border rounded-lg p-4 min-h-96">
        <EmptyState
          variant="illustrated"
          illustration={customIllustration}
          title="Ready for launch!"
          description="Your project setup is complete. Deploy your application and share it with the world."
          actions={
            <Button onClick={() => info("Deploy", "Deployment process started")}>
              Deploy Now
            </Button>
          }
        />
      </div>
    </div>
  );
}

// Example 10: Interactive Empty State
export function InteractiveEmptyStateExample() {
  const { info, success } = useToast();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <EmptyState.Icons.folder />,
      title: "Create your first project",
      description: "Projects help you organize your work and collaborate with your team.",
      action: "Create Project"
    },
    {
      icon: <EmptyState.Icons.users />,
      title: "Invite team members",
      description: "Add collaborators to work together on your projects.",
      action: "Invite Team"
    },
    {
      icon: <EmptyState.Icons.star />,
      title: "You're all set!",
      description: "Your workspace is ready. Start building something amazing.",
      action: "Get Started"
    }
  ];

  const handleStepAction = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      info("Step Completed", `Completed step ${step + 1}`);
    } else {
      success("Onboarding Complete", "Welcome to your new workspace!");
      setStep(0);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Interactive Onboarding</h4>

      <div className="border border-border rounded-lg p-4 min-h-96">
        <EmptyState
          variant="onboarding"
          size="lg"
          icon={currentStep.icon}
          title={currentStep.title}
          description={currentStep.description}
          actions={
            <div className="space-y-4">
              <Button onClick={handleStepAction} className="w-full">
                {currentStep.action}
              </Button>

              {/* Progress indicator */}
              <div className="flex justify-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-center text-on-muted">
                Step {step + 1} of {steps.length}
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
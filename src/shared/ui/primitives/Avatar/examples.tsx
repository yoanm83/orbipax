"use client";

import { useState } from "react";

import { Button } from "../Button";
import { useToast } from "../Toast";

import { Avatar } from "./index";

// Example 1: Basic Avatar Variants
export function BasicAvatarExample() {
  const { info } = useToast();

  const handleAvatarClick = (name: string) => {
    info("Avatar Clicked", `Clicked on ${name}'s avatar`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-fg">With Images</h4>
        <div className="flex items-center space-x-4">
          <Avatar
            src="https://github.com/shadcn.png"
            name="John Doe"
            size="sm"
            onClick={() => handleAvatarClick("John Doe")}
            className="cursor-pointer"
          />
          <Avatar
            src="https://github.com/vercel.png"
            name="Jane Smith"
            size="md"
            onClick={() => handleAvatarClick("Jane Smith")}
            className="cursor-pointer"
          />
          <Avatar
            src="https://github.com/nextjs.png"
            name="Bob Johnson"
            size="lg"
            onClick={() => handleAvatarClick("Bob Johnson")}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-fg">Fallback Initials</h4>
        <div className="flex items-center space-x-4">
          <Avatar name="Alice Cooper" size="sm" />
          <Avatar name="Michael Johnson" size="md" />
          <Avatar name="Sarah Williams" size="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-fg">Without Names</h4>
        <div className="flex items-center space-x-4">
          <Avatar size="sm" />
          <Avatar size="md" />
          <Avatar size="lg" />
        </div>
      </div>
    </div>
  );
}

// Example 2: Avatar Sizes
export function AvatarSizesExample() {
  const user = {
    name: "Alex Johnson",
    src: "https://github.com/facebook.png"
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Size Variants</h4>
      <div className="flex items-end space-x-4">
        <div className="text-center space-y-2">
          <Avatar {...user} size="xs" />
          <span className="text-xs text-on-muted">xs</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="sm" />
          <span className="text-xs text-on-muted">sm</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="md" />
          <span className="text-xs text-on-muted">md</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="lg" />
          <span className="text-xs text-on-muted">lg</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="xl" />
          <span className="text-xs text-on-muted">xl</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="2xl" />
          <span className="text-xs text-on-muted">2xl</span>
        </div>
      </div>
    </div>
  );
}

// Example 3: Avatar Shapes
export function AvatarShapesExample() {
  const user = {
    name: "Emma Wilson",
    src: "https://github.com/microsoft.png"
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Shape Variants</h4>
      <div className="flex items-center space-x-6">
        <div className="text-center space-y-2">
          <Avatar {...user} size="lg" variant="circular" />
          <span className="text-xs text-on-muted">Circular</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="lg" variant="rounded" />
          <span className="text-xs text-on-muted">Rounded</span>
        </div>
        <div className="text-center space-y-2">
          <Avatar {...user} size="lg" variant="square" />
          <span className="text-xs text-on-muted">Square</span>
        </div>
      </div>
    </div>
  );
}

// Example 4: Avatar with Status Indicators
export function AvatarStatusExample() {
  const users = [
    { name: "Online User", status: "online" as const },
    { name: "Busy User", status: "busy" as const },
    { name: "Away User", status: "away" as const },
    { name: "Offline User", status: "offline" as const }
  ];

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Status Indicators</h4>

      <div className="space-y-4">
        <h5 className="text-xs font-medium text-on-muted">Bottom Right</h5>
        <div className="flex items-center space-x-4">
          {users.map((user) => (
            <Avatar
              key={user.name}
              name={user.name}
              size="lg"
              status={user.status}
              statusPosition="bottom-right"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="text-xs font-medium text-on-muted">Top Right</h5>
        <div className="flex items-center space-x-4">
          {users.map((user) => (
            <Avatar
              key={user.name}
              name={user.name}
              size="lg"
              status={user.status}
              statusPosition="top-right"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Example 5: Avatar Group
export function AvatarGroupExample() {
  const { info } = useToast();

  const team = [
    { name: "John Doe", src: "https://github.com/shadcn.png" },
    { name: "Jane Smith", src: "https://github.com/vercel.png" },
    { name: "Bob Johnson", src: "https://github.com/nextjs.png" },
    { name: "Alice Cooper" },
    { name: "Michael Brown" },
    { name: "Sarah Wilson" },
    { name: "David Lee" },
    { name: "Emma Davis" }
  ];

  const handleGroupClick = () => {
    info("Team Members", `Total team size: ${team.length} members`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Avatar Groups</h4>

      <div className="space-y-4">
        <h5 className="text-xs font-medium text-on-muted">Basic Group (max 4)</h5>
        <Avatar.Group max={4} total={team.length}>
          {team.slice(0, 4).map((user, index) => (
            <Avatar
              key={index}
              name={user.name}
              src={user.src}
              size="md"
            />
          ))}
        </Avatar.Group>
      </div>

      <div className="space-y-4">
        <h5 className="text-xs font-medium text-on-muted">Tight Spacing (max 3)</h5>
        <Avatar.Group max={3} total={team.length} spacing="tight">
          {team.slice(0, 3).map((user, index) => (
            <Avatar
              key={index}
              name={user.name}
              src={user.src}
              size="md"
            />
          ))}
        </Avatar.Group>
      </div>

      <div className="space-y-4">
        <h5 className="text-xs font-medium text-on-muted">Wide Spacing (max 5)</h5>
        <Avatar.Group max={5} total={team.length} spacing="wide">
          {team.slice(0, 5).map((user, index) => (
            <Avatar
              key={index}
              name={user.name}
              src={user.src}
              size="md"
            />
          ))}
        </Avatar.Group>
      </div>

      <Button variant="outline" onClick={handleGroupClick} className="mt-4">
        View All Team Members
      </Button>
    </div>
  );
}

// Example 6: Avatar with Custom Fallbacks
export function AvatarCustomFallbackExample() {
  const [imageError, setImageError] = useState(false);

  const customIcon = (
    <svg className="h-1/2 w-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Custom Fallbacks</h4>

      <div className="flex items-center space-x-4">
        <div className="text-center space-y-2">
          <Avatar
            name="Company Bot"
            size="lg"
            fallback={customIcon}
          />
          <span className="text-xs text-on-muted">Custom Icon</span>
        </div>

        <div className="text-center space-y-2">
          <Avatar
            name="Admin User"
            size="lg"
            fallback={
              <span className="text-lg font-bold text-yellow-600">👑</span>
            }
          />
          <span className="text-xs text-on-muted">Emoji</span>
        </div>

        <div className="text-center space-y-2">
          <Avatar
            src={imageError ? undefined : "https://invalid-url.jpg"}
            name="Fallback Test"
            size="lg"
            fallbackSrc="https://github.com/github.png"
            onLoadingStatusChange={(status) => {
              if (status === "error") {setImageError(true);}
            }}
          />
          <span className="text-xs text-on-muted">Fallback URL</span>
        </div>
      </div>
    </div>
  );
}

// Example 7: Interactive Avatar Loading States
export function AvatarLoadingExample() {
  const { info, success, error } = useToast();
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [loadingStatus, setLoadingStatus] = useState<string>("idle");

  const testImages = [
    { label: "Valid Image", src: "https://github.com/nodejs.png" },
    { label: "Invalid Image", src: "https://invalid-url-that-will-fail.jpg" },
    { label: "No Image", src: undefined }
  ];

  const handleLoadingStatusChange = (status: string) => {
    setLoadingStatus(status);

    switch (status) {
      case "loading":
        info("Loading", "Avatar image is loading...");
        break;
      case "loaded":
        success("Loaded", "Avatar image loaded successfully!");
        break;
      case "error":
        error("Error", "Failed to load avatar image");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Loading States</h4>

      <div className="text-center space-y-4">
        <Avatar
          src={currentSrc}
          name="Test User"
          size="xl"
          onLoadingStatusChange={handleLoadingStatusChange}
        />

        <div className="text-xs text-on-muted">
          Status: <span className="font-medium">{loadingStatus}</span>
        </div>

        <div className="space-y-2">
          {testImages.map((image) => (
            <Button
              key={image.label}
              variant="outline"
              size="sm"
              onClick={() => setCurrentSrc(image.src)}
              className="w-full"
            >
              {image.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
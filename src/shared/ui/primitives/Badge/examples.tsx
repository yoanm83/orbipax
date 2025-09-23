"use client";

import { useState } from "react";

import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Card } from "../Card";
import { Input } from "../Input";
import { useToast } from "../Toast";

import { Badge } from "./index";
import type { BadgeVariants } from "./index";

// Example 1: Basic Badge Variants
export function BasicBadgeExample() {
  const variants: Array<BadgeVariants["variant"]> = [
    "default", "secondary", "success", "warning", "error", "info", "outline", "soft"
  ];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Basic Badge Variants</h4>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <Badge key={`dot-${variant}`} variant={variant} dot />
        ))}
      </div>
    </div>
  );
}

// Example 2: Badge Sizes
export function BadgeSizesExample() {
  const sizes: Array<BadgeVariants["size"]> = ["xs", "sm", "md", "lg"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Badge Sizes</h4>

      <div className="space-y-4">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="w-8 text-sm text-on-muted">{size}</span>
            <div className="flex gap-3">
              <Badge size={size} variant="default">
                {size.toUpperCase()}
              </Badge>
              <Badge size={size} variant="success">
                Active
              </Badge>
              <Badge size={size} variant="warning" count={5} />
              <Badge size={size} variant="error" dot />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Notification Badges
export function NotificationBadgeExample() {
  const { info } = useToast();
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(12);
  const [alerts, setAlerts] = useState(0);

  const handleClearNotifications = () => {
    setNotifications(0);
    info("Cleared", "Notifications cleared");
  };

  const handleAddMessage = () => {
    setMessages(prev => prev + 1);
  };

  const handleToggleAlerts = () => {
    setAlerts(prev => prev === 0 ? 5 : 0);
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <h4 className="text-sm font-medium text-fg">Notification Badges</h4>

      <div className="space-y-4">
        {/* Icon with badge */}
        <div className="flex items-center gap-4">
          <Badge.Container>
            <Button variant="ghost" size="sm" onClick={handleClearNotifications}>
              <Badge.Icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Badge.Icon>
            </Button>
            <Badge
              count={notifications}
              variant="error"
              size="sm"
              positioned
              position="top-right"
            />
          </Badge.Container>

          <Badge.Container>
            <Button variant="ghost" size="sm" onClick={handleAddMessage}>
              <Badge.Icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </Badge.Icon>
            </Button>
            <Badge
              count={messages}
              max={99}
              variant="info"
              size="sm"
              positioned
              position="top-right"
            />
          </Badge.Container>

          <Badge.Container>
            <Button variant="ghost" size="sm" onClick={handleToggleAlerts}>
              <Badge.Icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </Badge.Icon>
            </Button>
            <Badge
              count={alerts}
              showZero={false}
              variant="warning"
              size="sm"
              positioned
              position="top-right"
              pulse={alerts > 0}
            />
          </Badge.Container>
        </div>

        {/* Avatar with badge */}
        <div className="flex items-center gap-4">
          <Badge.Container>
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="User"
              size="md"
            />
            <Badge
              dot
              variant="success"
              size="sm"
              positioned
              position="bottom-right"
            />
          </Badge.Container>

          <Badge.Container>
            <Avatar
              src="https://images.unsplash.com/photo-1494790108755-2616b332d893?w=32&h=32&fit=crop&crop=face"
              alt="User"
              size="md"
            />
            <Badge
              count={2}
              variant="error"
              size="xs"
              positioned
              position="top-right"
            />
          </Badge.Container>
        </div>
      </div>
    </div>
  );
}

// Example 4: Status Badges
export function StatusBadgeExample() {
  const statuses = [
    { label: "Online", variant: "success" as const, dot: true },
    { label: "Away", variant: "warning" as const, dot: true },
    { label: "Busy", variant: "error" as const, dot: true },
    { label: "Offline", variant: "soft" as const, dot: true },
    { label: "Active", variant: "success" as const },
    { label: "Pending", variant: "warning" as const },
    { label: "Inactive", variant: "soft" as const },
    { label: "Banned", variant: "error" as const }
  ];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Status Badges</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2">
            <Badge
              variant={status.variant}
              size="sm"
              dot={status.dot}
            >
              {!status.dot && status.label}
            </Badge>
            {status.dot && (
              <span className="text-sm text-on-muted">{status.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 5: Content Badges
export function ContentBadgeExample() {
  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Content Badges</h4>

      <div className="space-y-4">
        {/* Tags */}
        <div>
          <h5 className="text-sm font-medium text-fg mb-2">Tags</h5>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" size="sm">React</Badge>
            <Badge variant="outline" size="sm">TypeScript</Badge>
            <Badge variant="outline" size="sm">Next.js</Badge>
            <Badge variant="outline" size="sm">Tailwind CSS</Badge>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h5 className="text-sm font-medium text-fg mb-2">Categories</h5>
          <div className="flex flex-wrap gap-2">
            <Badge variant="soft" size="md">Frontend</Badge>
            <Badge variant="soft" size="md">Backend</Badge>
            <Badge variant="soft" size="md">Design</Badge>
            <Badge variant="soft" size="md">DevOps</Badge>
          </div>
        </div>

        {/* Priority levels */}
        <div>
          <h5 className="text-sm font-medium text-fg mb-2">Priority Levels</h5>
          <div className="flex flex-wrap gap-2">
            <Badge variant="error" size="sm">High</Badge>
            <Badge variant="warning" size="sm">Medium</Badge>
            <Badge variant="info" size="sm">Low</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 6: Interactive Badges
export function InteractiveBadgeExample() {
  const { success, info } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>(["React"]);
  const [cartItems, setCartItems] = useState(3);

  const availableTags = ["React", "Vue", "Angular", "Svelte", "TypeScript", "JavaScript"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddToCart = () => {
    setCartItems(prev => prev + 1);
    success("Added", "Item added to cart");
  };

  const handleCheckout = () => {
    if (cartItems > 0) {
      info("Checkout", `Proceeding with ${cartItems} items`);
      setCartItems(0);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Interactive Badges</h4>

      <div className="space-y-6">
        {/* Selectable tags */}
        <div>
          <h5 className="text-sm font-medium text-fg mb-3">Filter by Technology</h5>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
              >
                <Badge
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                >
                  {tag}
                </Badge>
              </button>
            ))}
          </div>
          <p className="text-xs text-on-muted mt-2">
            Selected: {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Shopping cart */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge.Container>
                <Button variant="outline" onClick={handleCheckout}>
                  <Badge.Icon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6" />
                    </svg>
                  </Badge.Icon>
                  Cart
                </Button>
                <Badge
                  count={cartItems}
                  variant="primary"
                  size="sm"
                  positioned
                  position="top-right"
                  showZero={false}
                />
              </Badge.Container>
            </div>
            <Button onClick={handleAddToCart} size="sm">
              Add Item
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Example 7: Form Badges
export function FormBadgeExample() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("johndoe");

  const isEmailValid = email.includes("@") && email.includes(".");
  const isUsernameAvailable = username.length >= 3 && username !== "admin";

  return (
    <div className="space-y-6 w-full max-w-md">
      <h4 className="text-sm font-medium text-fg">Form Validation Badges</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-2">
            Email Address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-16"
            />
            {email && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Badge
                  variant={isEmailValid ? "success" : "error"}
                  size="xs"
                >
                  {isEmailValid ? "Valid" : "Invalid"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-2">
            Username
          </label>
          <div className="relative">
            <Input
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pr-20"
            />
            {username && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Badge
                  variant={isUsernameAvailable ? "success" : "warning"}
                  size="xs"
                >
                  {isUsernameAvailable ? "Available" : "Taken"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 8: List Item Badges
export function ListItemBadgeExample() {
  const items = [
    { id: 1, name: "Project Alpha", status: "active", priority: "high", team: 5 },
    { id: 2, name: "Project Beta", status: "pending", priority: "medium", team: 3 },
    { id: 3, name: "Project Gamma", status: "completed", priority: "low", team: 8 },
    { id: 4, name: "Project Delta", status: "paused", priority: "high", team: 2 }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success" as const;
      case "pending": return "warning" as const;
      case "completed": return "info" as const;
      case "paused": return "soft" as const;
      default: return "outline" as const;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "error" as const;
      case "medium": return "warning" as const;
      case "low": return "success" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">List Item Badges</h4>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h5 className="font-medium text-fg">{item.name}</h5>
                <Badge variant={getStatusVariant(item.status)} size="sm">
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityVariant(item.priority)} size="xs">
                  {item.priority}
                </Badge>
                <Badge variant="outline" size="xs" count={item.team} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
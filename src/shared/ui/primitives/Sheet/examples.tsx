"use client";

import { useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Avatar } from "../Avatar";
import { useToast } from "../Toast";

import { Sheet } from "./index";
import type { SheetVariants } from "./index";

// Example 1: Basic Sheet
export function BasicSheetExample() {
  const { info } = useToast();

  const handleAction = () => {
    info("Action Completed", "Sheet action was completed successfully");
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </Sheet.Trigger>

        <Sheet.Content>
          <Sheet.Header>
            <div>
              <Sheet.Title>Sheet Title</Sheet.Title>
              <Sheet.Description>
                This is a basic sheet example with standard functionality.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body>
            <div className="space-y-4">
              <p className="text-sm text-on-muted">
                This sheet slides in from the right side of the screen. You can close it
                using the X button, clicking the backdrop, or pressing Escape.
              </p>

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Features</h5>
                <ul className="text-sm text-on-muted space-y-1">
                  <li>• Slides in from any side</li>
                  <li>• Focus management</li>
                  <li>• Keyboard navigation</li>
                  <li>• Accessible by default</li>
                </ul>
              </div>
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Sheet.Close>
            <Sheet.Close asChild>
              <Button onClick={handleAction}>Confirm</Button>
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 2: Sheet Sides
export function SheetSidesExample() {
  const sides: Array<SheetVariants["side"]> = ["top", "right", "bottom", "left"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Sheet Sides</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sides.map((side) => (
          <Sheet key={side}>
            <Sheet.Trigger asChild>
              <Button variant="outline" className="w-full">
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Button>
            </Sheet.Trigger>

            <Sheet.Content side={side}>
              <Sheet.Header>
                <div>
                  <Sheet.Title>{side.charAt(0).toUpperCase() + side.slice(1)} Sheet</Sheet.Title>
                  <Sheet.Description>
                    This sheet slides in from the {side}.
                  </Sheet.Description>
                </div>
              </Sheet.Header>

              <Sheet.Body>
                <p className="text-sm text-on-muted">
                  This sheet demonstrates sliding from the {side} side of the screen.
                  Each side provides different user experience patterns.
                </p>
              </Sheet.Body>

              <Sheet.Footer>
                <Sheet.Close asChild>
                  <Button variant="outline">Close</Button>
                </Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet>
        ))}
      </div>
    </div>
  );
}

// Example 3: Sheet Sizes
export function SheetSizesExample() {
  const sizes: Array<SheetVariants["size"]> = ["sm", "md", "lg", "xl", "full", "content"];

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Sheet Sizes</h4>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Sheet key={size}>
            <Sheet.Trigger asChild>
              <Button variant="outline" size="sm">
                {size.toUpperCase()}
              </Button>
            </Sheet.Trigger>

            <Sheet.Content size={size}>
              <Sheet.Header>
                <div>
                  <Sheet.Title>{size.toUpperCase()} Sheet</Sheet.Title>
                  <Sheet.Description>
                    This sheet uses the {size} size variant.
                  </Sheet.Description>
                </div>
              </Sheet.Header>

              <Sheet.Body>
                <p className="text-sm text-on-muted">
                  Size: {size}. Each size provides different width/height for various use cases.
                  {size === "full" && " The full size takes up the entire viewport dimension."}
                  {size === "content" && " The content size adapts to the content size."}
                </p>
              </Sheet.Body>

              <Sheet.Footer>
                <Sheet.Close asChild>
                  <Button variant="outline">Close</Button>
                </Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet>
        ))}
      </div>
    </div>
  );
}

// Example 4: Navigation Sheet
export function NavigationSheetExample() {
  const { info } = useToast();

  const navigationItems = [
    { name: "Dashboard", icon: "🏠", href: "/dashboard" },
    { name: "Projects", icon: "📁", href: "/projects" },
    { name: "Team", icon: "👥", href: "/team" },
    { name: "Settings", icon: "⚙️", href: "/settings" },
    { name: "Help", icon: "❓", href: "/help" }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    info("Navigation", `Navigating to ${item.name}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Navigation Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </Button>
        </Sheet.Trigger>

        <Sheet.Content side="left" size="sm">
          <Sheet.Header>
            <div>
              <Sheet.Title>Navigation</Sheet.Title>
              <Sheet.Description>
                Navigate to different sections of the app.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-accent transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <Avatar name="John Doe" size="sm" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-on-muted">john@example.com</p>
                </div>
              </div>
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline" className="w-full">
                Close Menu
              </Button>
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 5: Form Sheet
export function FormSheetExample() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      error("Validation Error", "Name and email are required");
      return;
    }

    success("Contact Submitted", "Your contact information has been submitted");
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Contact Form Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button>Contact Us</Button>
        </Sheet.Trigger>

        <Sheet.Content size="lg">
          <Sheet.Header>
            <div>
              <Sheet.Title>Contact Us</Sheet.Title>
              <Sheet.Description>
                Get in touch with our team. We'll respond within 24 hours.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body scrollable>
            <div className="space-y-4">
              <Input
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />

              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your company name"
              />

              <Textarea
                label="Message"
                value={formData.message}
                onValueChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                placeholder="Tell us how we can help you..."
                minRows={4}
                maxLength={1000}
                characterCount
              />

              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-on-muted">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Sheet.Close>
            <Button onClick={handleSubmit}>Send Message</Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 6: Settings Sheet
export function SettingsSheetExample() {
  const { info } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "en",
    autoSave: true
  });

  const handleSaveSettings = () => {
    info("Settings Saved", "Your preferences have been saved successfully");
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Settings Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </Sheet.Trigger>

        <Sheet.Content side="right" size="md">
          <Sheet.Header>
            <div>
              <Sheet.Title>Settings</Sheet.Title>
              <Sheet.Description>
                Manage your application preferences and settings.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body scrollable>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notifications</h3>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Enable notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="rounded"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Appearance</h3>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, darkMode: e.target.checked }))}
                    className="rounded"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Language</h3>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Behavior</h3>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Auto-save changes</span>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                    className="rounded"
                  />
                </label>
              </div>
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Sheet.Close>
            <Sheet.Close asChild>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 7: Non-Modal Sheet
export function NonModalSheetExample() {
  const { info } = useToast();

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Non-Modal Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button variant="outline">Open Non-Modal Sheet</Button>
        </Sheet.Trigger>

        <Sheet.Content modal={false} side="left" size="sm">
          <Sheet.Header>
            <div>
              <Sheet.Title>Non-Modal Sheet</Sheet.Title>
              <Sheet.Description>
                This sheet doesn't block interaction with the background.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body>
            <div className="space-y-4">
              <p className="text-sm text-on-muted">
                This is a non-modal sheet. You can still interact with the content
                behind it. There's no backdrop overlay.
              </p>

              <div className="p-3 bg-info/10 border border-info/20 rounded-md">
                <p className="text-xs text-info-foreground">
                  💡 Try clicking outside the sheet - the background remains interactive!
                </p>
              </div>

              <Button
                onClick={() => info("Background Interaction", "You can still use buttons in the background!")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Test Background Interaction
              </Button>
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline">Close</Button>
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 8: Bottom Sheet (Mobile-like)
export function BottomSheetExample() {
  const { info } = useToast();

  const actions = [
    { name: "Share", icon: "📤", action: () => info("Action", "Share action triggered") },
    { name: "Copy Link", icon: "🔗", action: () => info("Action", "Link copied to clipboard") },
    { name: "Download", icon: "⬇️", action: () => info("Action", "Download started") },
    { name: "Delete", icon: "🗑️", action: () => info("Action", "Item deleted"), destructive: true }
  ];

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Bottom Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button variant="outline">Open Action Sheet</Button>
        </Sheet.Trigger>

        <Sheet.Content side="bottom" size="content">
          <Sheet.Header>
            <div>
              <Sheet.Title>Quick Actions</Sheet.Title>
              <Sheet.Description>
                Choose an action to perform on the selected item.
              </Sheet.Description>
            </div>
          </Sheet.Header>

          <Sheet.Body>
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <Sheet.Close key={action.name} asChild>
                  <button
                    onClick={action.action}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                      action.destructive
                        ? "border-error/20 hover:bg-error/10 text-error"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.name}</span>
                  </button>
                </Sheet.Close>
              ))}
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}

// Example 9: Details Sheet
export function DetailsSheetExample() {
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Senior Designer",
    department: "Product Design",
    location: "San Francisco, CA",
    joined: "March 2022",
    projects: 12,
    avatar: "https://github.com/shadcn.png"
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Details Sheet</h4>

      <div className="p-4 border border-border rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-on-muted">{user.role}</p>
          </div>
        </div>

        <Sheet>
          <Sheet.Trigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Sheet.Trigger>

          <Sheet.Content side="right" size="md">
            <Sheet.Header>
              <div>
                <Sheet.Title>User Details</Sheet.Title>
                <Sheet.Description>
                  Detailed information about {user.name}.
                </Sheet.Description>
              </div>
            </Sheet.Header>

            <Sheet.Body scrollable>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} src={user.avatar} size="xl" />
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-on-muted">{user.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                    <div className="space-y-2 text-sm text-on-muted">
                      <p>📧 {user.email}</p>
                      <p>📍 {user.location}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Work Information</h4>
                    <div className="space-y-2 text-sm text-on-muted">
                      <p>🏢 {user.department}</p>
                      <p>📅 Joined {user.joined}</p>
                      <p>📊 {user.projects} active projects</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Recent Activity</h4>
                    <div className="space-y-2">
                      {[
                        "Updated design system components",
                        "Reviewed mobile app wireframes",
                        "Conducted user research session"
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-on-muted">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Sheet.Body>

            <Sheet.Footer>
              <Sheet.Close asChild>
                <Button variant="outline">Close</Button>
              </Sheet.Close>
              <Button>Send Message</Button>
            </Sheet.Footer>
          </Sheet.Content>
        </Sheet>
      </div>
    </div>
  );
}

// Example 10: Custom Styled Sheet
export function CustomStyledSheetExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Custom Styled Sheet</h4>

      <Sheet>
        <Sheet.Trigger asChild>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
            Open Custom Sheet
          </Button>
        </Sheet.Trigger>

        <Sheet.Content side="right" size="md" className="bg-gradient-to-b from-violet-50 to-purple-50 border-violet-200">
          <div className="h-full flex flex-col">
            <Sheet.Header className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-none rounded-none">
              <div>
                <Sheet.Title className="text-white">✨ Premium Dashboard</Sheet.Title>
                <Sheet.Description className="text-violet-100">
                  Access advanced analytics and insights.
                </Sheet.Description>
              </div>
            </Sheet.Header>

            <Sheet.Body className="bg-gradient-to-b from-violet-50 to-purple-50 flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Users", value: "12,345", icon: "👥" },
                    { label: "Revenue", value: "$45,678", icon: "💰" },
                    { label: "Growth", value: "+12.5%", icon: "📈" },
                    { label: "Conversion", value: "3.2%", icon: "🎯" }
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{stat.icon}</span>
                        <span className="text-xs text-violet-600">{stat.label}</span>
                      </div>
                      <p className="text-lg font-bold text-violet-800">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                  <h4 className="font-medium text-violet-800 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {[
                      "New user registration (+15)",
                      "Payment processed ($2,450)",
                      "Feature usage increased (+8%)"
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        <span className="text-violet-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Sheet.Body>

            <Sheet.Footer className="bg-white/60 backdrop-blur-sm border-none">
              <Sheet.Close asChild>
                <Button variant="outline" className="border-violet-200 text-violet-700">
                  Close
                </Button>
              </Sheet.Close>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                Export Data
              </Button>
            </Sheet.Footer>
          </div>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}
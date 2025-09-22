"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "../Button";
import { FormProvider, FormField } from "../Form";
import { useToast } from "../Toast";

import { Switch } from "./index";

// Example 1: Basic Switch Usage
export function BasicSwitchExample() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { info, success } = useToast();

  const handleToggle = async (checked: boolean) => {
    setLoading(true);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    setEnabled(checked);
    setLoading(false);

    success("Setting Updated", `Feature ${checked ? "enabled" : "disabled"}`);
  };

  const handleInstantToggle = (checked: boolean) => {
    info("Instant Toggle", `Switch ${checked ? "ON" : "OFF"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Switch</h4>

      <div className="space-y-4">
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          loading={loading}
          label="Enable notifications"
          description="Receive push notifications for important updates"
        />

        <Switch
          label="Dark mode"
          description="Switch between light and dark themes"
          defaultChecked
          onCheckedChange={handleInstantToggle}
        />

        <Switch
          label="Auto-save"
          description="Automatically save your work"
          disabled
          defaultChecked
        />

        <Switch
          label="Required setting"
          description="This setting is required for the app to function"
          required
          defaultChecked
        />
      </div>
    </div>
  );
}

// Example 2: Switch Sizes
export function SwitchSizesExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Size Variants</h4>

      <div className="space-y-4">
        <Switch
          size="sm"
          label="Small switch"
          description="Compact size for dense layouts"
          defaultChecked
        />

        <Switch
          size="md"
          label="Medium switch"
          description="Default size for most use cases"
          defaultChecked
        />

        <Switch
          size="lg"
          label="Large switch"
          description="Larger size for emphasis or accessibility"
          defaultChecked
        />
      </div>
    </div>
  );
}

// Example 3: Switch Styles
export function SwitchStylesExample() {
  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Style Variants</h4>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Filled Style</h5>
          <div className="space-y-2">
            <Switch switchStyle="filled" label="Filled style (ON)" defaultChecked />
            <Switch switchStyle="filled" label="Filled style (OFF)" />
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Outline Style</h5>
          <div className="space-y-2">
            <Switch switchStyle="outline" label="Outline style (ON)" defaultChecked />
            <Switch switchStyle="outline" label="Outline style (OFF)" />
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Soft Style</h5>
          <div className="space-y-2">
            <Switch switchStyle="soft" label="Soft style (ON)" defaultChecked />
            <Switch switchStyle="soft" label="Soft style (OFF)" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 4: Switch Color Variants
export function SwitchColorVariantsExample() {
  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Color Variants</h4>

      <div className="space-y-4">
        <Switch
          variant="default"
          label="Default color"
          description="Standard primary color"
          defaultChecked
        />

        <Switch
          variant="success"
          label="Success color"
          description="Green color for positive actions"
          defaultChecked
        />

        <Switch
          variant="warning"
          label="Warning color"
          description="Orange color for warning states"
          defaultChecked
        />

        <Switch
          variant="error"
          label="Error color"
          description="Red color for critical settings"
          defaultChecked
        />
      </div>
    </div>
  );
}

// Example 5: Switch with Labels
export function SwitchLabelsExample() {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Switches with Labels</h4>

      <div className="space-y-4">
        <Switch
          checked={wifiEnabled}
          onCheckedChange={setWifiEnabled}
          showLabels
          onLabel="ON"
          offLabel="OFF"
          label="Wi-Fi"
          description="Connect to wireless networks"
        />

        <Switch
          checked={bluetoothEnabled}
          onCheckedChange={setBluetoothEnabled}
          showLabels
          onLabel="✓"
          offLabel="✗"
          label="Bluetooth"
          description="Connect to Bluetooth devices"
          variant="success"
        />

        <Switch
          showLabels
          onLabel="YES"
          offLabel="NO"
          label="Marketing emails"
          description="Receive promotional content"
          switchStyle="outline"
        />
      </div>
    </div>
  );
}

// Example 6: Switch with Custom Icons
export function SwitchIconsExample() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const sunIcon = (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  );

  const moonIcon = (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );

  const bellIcon = (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Switches with Icons</h4>

      <div className="space-y-4">
        <Switch
          checked={darkMode}
          onCheckedChange={setDarkMode}
          thumbIcon={darkMode ? moonIcon : sunIcon}
          label="Dark mode"
          description="Toggle between light and dark themes"
          size="lg"
        />

        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          thumbIcon={bellIcon}
          label="Push notifications"
          description="Receive app notifications"
          variant="success"
        />

        <Switch
          thumbIcon={
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
          label="Auto-download"
          description="Automatically download updates"
          switchStyle="outline"
        />
      </div>
    </div>
  );
}

// Example 7: Settings Panel
export function SettingsPanelExample() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: false,
    darkMode: true,
    analytics: false,
    location: true
  });

  const { info } = useToast();

  const handleSettingChange = (key: keyof typeof settings) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
    info("Setting Changed", `${key} ${checked ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <h4 className="text-sm font-medium text-fg">Settings Panel</h4>

      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div>
          <h5 className="text-sm font-semibold text-fg mb-3">General</h5>
          <div className="space-y-3">
            <Switch
              checked={settings.notifications}
              onCheckedChange={handleSettingChange("notifications")}
              label="Push notifications"
              description="Receive notifications about important updates"
            />

            <Switch
              checked={settings.autoSave}
              onCheckedChange={handleSettingChange("autoSave")}
              label="Auto-save"
              description="Automatically save your work every 5 minutes"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h5 className="text-sm font-semibold text-fg mb-3">Appearance</h5>
          <div className="space-y-3">
            <Switch
              checked={settings.darkMode}
              onCheckedChange={handleSettingChange("darkMode")}
              label="Dark mode"
              description="Use dark theme across the application"
              variant="default"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h5 className="text-sm font-semibold text-fg mb-3">Privacy</h5>
          <div className="space-y-3">
            <Switch
              checked={settings.analytics}
              onCheckedChange={handleSettingChange("analytics")}
              label="Analytics"
              description="Help improve the app by sharing usage data"
              variant="warning"
            />

            <Switch
              checked={settings.location}
              onCheckedChange={handleSettingChange("location")}
              label="Location services"
              description="Allow the app to access your location"
              variant="error"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 8: Form Integration
const settingsSchema = z.object({
  notifications: z.boolean().default(true),
  emailUpdates: z.boolean().default(false),
  twoFactor: z.boolean().default(false),
  publicProfile: z.boolean().default(false)
});

type SettingsForm = z.infer<typeof settingsSchema>;

export function SwitchFormExample() {
  const { promise } = useToast();

  const handleSubmit = async (_data: SettingsForm) => {
    await promise(
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Saving settings...",
        success: "Settings saved successfully!",
        error: "Failed to save settings"
      }
    );
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <h4 className="text-sm font-medium text-fg">Form Integration</h4>

      <FormProvider
        schema={settingsSchema}
        defaultValues={{
          notifications: true,
          emailUpdates: false,
          twoFactor: false,
          publicProfile: false
        }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField<SettingsForm>
            name="notifications"
            label="Push Notifications"
            description="Receive push notifications on your device"
          >
            {({ value, onChange }) => (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                label="Enable push notifications"
                description="Get notified about important updates"
              />
            )}
          </FormField>

          <FormField<SettingsForm>
            name="emailUpdates"
            label="Email Updates"
            description="Receive product updates via email"
          >
            {({ value, onChange }) => (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                label="Email notifications"
                description="Weekly digest of new features and updates"
                variant="default"
              />
            )}
          </FormField>

          <FormField<SettingsForm>
            name="twoFactor"
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
          >
            {({ value, onChange }) => (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                label="Enable 2FA"
                description="Require authentication code for login"
                variant="success"
              />
            )}
          </FormField>

          <FormField<SettingsForm>
            name="publicProfile"
            label="Public Profile"
            description="Make your profile visible to others"
          >
            {({ value, onChange }) => (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                label="Public visibility"
                description="Others can view your profile information"
                variant="warning"
              />
            )}
          </FormField>
        </div>

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </FormProvider>
    </div>
  );
}

// Example 9: Loading States
export function SwitchLoadingExample() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [states, setStates] = useState<Record<string, boolean>>({
    feature1: false,
    feature2: true,
    feature3: false
  });

  const { success, error } = useToast();

  const handleToggle = async (key: string, newValue: boolean) => {
    setLoading(prev => ({ ...prev, [key]: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate occasional failure
      if (Math.random() < 0.2) {
        throw new Error("Network error");
      }

      setStates(prev => ({ ...prev, [key]: newValue }));
      success("Updated", `Feature ${newValue ? "enabled" : "disabled"}`);
    } catch (_err) {
      error("Error", "Failed to update setting");
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Loading States</h4>

      <div className="space-y-4">
        <Switch
          checked={states['feature1']}
          onCheckedChange={(checked) => handleToggle("feature1", checked)}
          loading={loading['feature1']}
          label="Feature 1"
          description="Toggle with async validation"
        />

        <Switch
          checked={states['feature2']}
          onCheckedChange={(checked) => handleToggle("feature2", checked)}
          loading={loading['feature2']}
          label="Feature 2"
          description="May take a moment to update"
          variant="success"
        />

        <Switch
          checked={states['feature3']}
          onCheckedChange={(checked) => handleToggle("feature3", checked)}
          loading={loading['feature3']}
          label="Feature 3"
          description="Has occasional network errors"
          variant="warning"
        />
      </div>

      <div className="text-xs text-on-muted bg-muted rounded p-3">
        <strong>Note:</strong> These switches simulate async operations with loading states.
        Feature 3 has a 20% chance of failure to demonstrate error handling.
      </div>
    </div>
  );
}
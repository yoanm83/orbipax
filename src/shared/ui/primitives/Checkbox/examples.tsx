"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "../Button";
import { FormProvider, FormField } from "../Form";
import { useToast } from "../Toast";

import { Checkbox } from "./index";

// Example 1: Basic Checkbox Variants
export function BasicCheckboxExample() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const { info } = useToast();

  const handleToggle = () => {
    if (indeterminate) {
      setIndeterminate(false);
      setChecked(true);
    } else if (checked) {
      setChecked(false);
    } else {
      setIndeterminate(true);
    }

    info("Checkbox State", `State: ${indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Checkbox</h4>

      <div className="space-y-4">
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={setChecked}
          label="Accept terms and conditions"
          description="I agree to the terms of service and privacy policy"
        />

        <Checkbox
          label="Subscribe to newsletter"
          description="Receive updates about new features and promotions"
          defaultChecked
        />

        <Checkbox
          label="Disabled checkbox"
          description="This checkbox cannot be interacted with"
          disabled
        />

        <Checkbox
          label="Required checkbox"
          description="This field is required"
          required
        />

        <Button variant="outline" onClick={handleToggle} size="sm">
          Toggle State (unchecked → indeterminate → checked)
        </Button>
      </div>
    </div>
  );
}

// Example 2: Checkbox Sizes
export function CheckboxSizesExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Size Variants</h4>

      <div className="space-y-4">
        <Checkbox
          size="sm"
          label="Small checkbox"
          description="Compact size for dense layouts"
          defaultChecked
        />

        <Checkbox
          size="md"
          label="Medium checkbox"
          description="Default size for most use cases"
          defaultChecked
        />

        <Checkbox
          size="lg"
          label="Large checkbox"
          description="Larger size for accessibility or emphasis"
          defaultChecked
        />
      </div>
    </div>
  );
}

// Example 3: Checkbox Variants
export function CheckboxVariantsExample() {
  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Visual Variants</h4>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Default Variant</h5>
          <div className="space-y-2">
            <Checkbox variant="default" label="Default style" defaultChecked />
            <Checkbox variant="default" label="Unchecked default" />
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Outline Variant</h5>
          <div className="space-y-2">
            <Checkbox variant="outline" label="Outline style" defaultChecked />
            <Checkbox variant="outline" label="Unchecked outline" />
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-medium text-on-muted">Soft Variant</h5>
          <div className="space-y-2">
            <Checkbox variant="soft" label="Soft style" defaultChecked />
            <Checkbox variant="soft" label="Unchecked soft" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 4: Checkbox States
export function CheckboxStatesExample() {
  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">State Variants</h4>

      <div className="space-y-4">
        <Checkbox
          state="default"
          label="Default state"
          description="Normal checkbox appearance"
          defaultChecked
        />

        <Checkbox
          state="success"
          label="Success state"
          description="Indicates successful validation"
          defaultChecked
        />

        <Checkbox
          state="warning"
          label="Warning state"
          description="Indicates a warning condition"
          defaultChecked
        />

        <Checkbox
          state="error"
          label="Error state"
          errorMessage="This field is required"
          required
        />
      </div>
    </div>
  );
}

// Example 5: Checkbox Groups
export function CheckboxGroupExample() {
  const [fruits, setFruits] = useState<string[]>(["apple"]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { info } = useToast();

  const handleFruitsChange = (value: string[]) => {
    setFruits(value);
    info("Fruits Selection", `Selected: ${value.join(", ") || "none"}`);
  };

  return (
    <div className="space-y-8 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Checkbox Groups</h4>

      <div className="space-y-6">
        <Checkbox.Group
          label="Favorite Fruits"
          description="Select your favorite fruits"
          value={fruits}
          onValueChange={handleFruitsChange}
          orientation="vertical"
        >
          <Checkbox.GroupItem value="apple" label="Apple" />
          <Checkbox.GroupItem value="banana" label="Banana" />
          <Checkbox.GroupItem value="orange" label="Orange" />
          <Checkbox.GroupItem value="grape" label="Grape" />
        </Checkbox.Group>

        <Checkbox.Group
          label="Notification Preferences"
          description="Choose how you want to be notified"
          value={notifications}
          onValueChange={setNotifications}
          orientation="vertical"
          required
          errorMessage={notifications.length === 0 ? "Please select at least one notification method" : undefined}
        >
          <Checkbox.GroupItem value="email" label="Email notifications" />
          <Checkbox.GroupItem value="sms" label="SMS notifications" />
          <Checkbox.GroupItem value="push" label="Push notifications" />
          <Checkbox.GroupItem value="browser" label="Browser notifications" />
        </Checkbox.Group>

        <Checkbox.Group
          label="Quick Actions"
          description="Horizontal layout example"
          orientation="horizontal"
        >
          <Checkbox.GroupItem value="save" label="Save" />
          <Checkbox.GroupItem value="share" label="Share" />
          <Checkbox.GroupItem value="print" label="Print" />
        </Checkbox.Group>
      </div>
    </div>
  );
}

// Example 6: Select All Functionality
export function SelectAllCheckboxExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { info } = useToast();

  const allItems = ["item1", "item2", "item3", "item4", "item5"];
  const isAllSelected = selectedItems.length === allItems.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < allItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(allItems);
      info("Select All", "All items selected");
    } else {
      setSelectedItems([]);
      info("Deselect All", "All items deselected");
    }
  };

  const handleItemChange = (value: string[]) => {
    setSelectedItems(value);
    info("Items Selection", `Selected ${value.length} of ${allItems.length} items`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Select All Pattern</h4>

      <div className="space-y-4">
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onCheckedChange={handleSelectAll}
          label="Select All"
          description={`${selectedItems.length} of ${allItems.length} items selected`}
        />

        <div className="border-t border-border pt-4">
          <Checkbox.Group
            value={selectedItems}
            onValueChange={handleItemChange}
            orientation="vertical"
          >
            <Checkbox.GroupItem value="item1" label="Item 1" />
            <Checkbox.GroupItem value="item2" label="Item 2" />
            <Checkbox.GroupItem value="item3" label="Item 3" />
            <Checkbox.GroupItem value="item4" label="Item 4" />
            <Checkbox.GroupItem value="item5" label="Item 5" />
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
}

// Example 7: Form Integration
const preferencesSchema = z.object({
  newsletter: z.boolean().default(false),
  notifications: z.array(z.string()).min(1, "Please select at least one notification type"),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  privacy: z.boolean().refine(val => val === true, "You must accept the privacy policy")
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export function CheckboxFormExample() {
  const { promise } = useToast();

  const handleSubmit = async (data: PreferencesForm) => {
    await promise(
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Saving preferences...",
        success: "Preferences saved successfully!",
        error: "Failed to save preferences"
      }
    );
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <h4 className="text-sm font-medium text-fg">Form Integration</h4>

      <FormProvider
        schema={preferencesSchema}
        defaultValues={{
          newsletter: false,
          notifications: [],
          terms: false,
          privacy: false
        }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <FormField<PreferencesForm>
          name="newsletter"
          label="Email Newsletter"
          description="Subscribe to our newsletter for updates"
        >
          {({ value, onChange, error, invalid }) => (
            <Checkbox
              checked={value}
              onCheckedChange={onChange}
              label="Yes, I want to receive the newsletter"
              state={invalid ? "error" : "default"}
              errorMessage={error}
            />
          )}
        </FormField>

        <FormField<PreferencesForm>
          name="notifications"
          label="Notification Preferences"
          description="Choose how you want to be notified"
          required
        >
          {({ value, onChange, error, invalid }) => (
            <Checkbox.Group
              value={value}
              onValueChange={onChange}
              orientation="vertical"
              errorMessage={error}
            >
              <Checkbox.GroupItem value="email" label="Email notifications" />
              <Checkbox.GroupItem value="push" label="Push notifications" />
              <Checkbox.GroupItem value="sms" label="SMS notifications" />
            </Checkbox.Group>
          )}
        </FormField>

        <div className="space-y-3">
          <FormField<PreferencesForm>
            name="terms"
            required
          >
            {({ value, onChange, error, invalid }) => (
              <Checkbox
                checked={value}
                onCheckedChange={onChange}
                label="I accept the terms and conditions"
                state={invalid ? "error" : "default"}
                errorMessage={error}
                required
              />
            )}
          </FormField>

          <FormField<PreferencesForm>
            name="privacy"
            required
          >
            {({ value, onChange, error, invalid }) => (
              <Checkbox
                checked={value}
                onCheckedChange={onChange}
                label="I accept the privacy policy"
                state={invalid ? "error" : "default"}
                errorMessage={error}
                required
              />
            )}
          </FormField>
        </div>

        <Button type="submit" className="w-full">
          Save Preferences
        </Button>
      </FormProvider>
    </div>
  );
}

// Example 8: Checkbox Card Pattern
export function CheckboxCardExample() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { info } = useToast();

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "$9/month",
      features: ["5 Projects", "10GB Storage", "Email Support"]
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$29/month",
      features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Advanced Analytics"]
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: "$99/month",
      features: ["Everything in Pro", "Custom Integrations", "Dedicated Manager", "SLA Guarantee"]
    }
  ];

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(selectedPlan === planId ? "" : planId);
    info("Plan Selection", `Selected: ${plans.find(p => p.id === planId)?.name || "None"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <h4 className="text-sm font-medium text-fg">Checkbox Card Pattern</h4>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative border rounded-lg p-4 cursor-pointer transition-all
              ${selectedPlan === plan.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-border-hover"
              }
            `}
            onClick={() => handlePlanChange(plan.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedPlan === plan.id}
                onCheckedChange={() => handlePlanChange(plan.id)}
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-fg">{plan.name}</h5>
                  <span className="text-lg font-bold text-primary">{plan.price}</span>
                </div>

                <ul className="space-y-1 text-sm text-on-muted">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <Button className="w-full">
          Continue with {plans.find(p => p.id === selectedPlan)?.name}
        </Button>
      )}
    </div>
  );
}
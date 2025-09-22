'use client';

import { useId } from 'react';

interface RememberMeProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function RememberMe({ checked = false, onChange, disabled }: RememberMeProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className=""
      />
      <label htmlFor={id} className="text-sm text-fg">
        Remember me for 30 days
      </label>
    </div>
  );
}
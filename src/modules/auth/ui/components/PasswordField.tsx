'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';

interface PasswordFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PasswordField({ value = '', onChange, error, disabled }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  return (
    <>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        Password
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-muted/70 h-5 w-5" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="••••••••"
          disabled={disabled}
          className="w-full h-10 pl-10 pr-10 rounded-md border border-border text-sm text-fg placeholder:text-on-muted/70 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-muted/70"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
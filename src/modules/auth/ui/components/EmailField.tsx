'use client';

import { Mail } from 'lucide-react';
import { useId } from 'react';

interface EmailFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function EmailField({ value = '', onChange, error, disabled }: EmailFieldProps) {
  const id = useId();

  return (
    <>
      <label htmlFor={id} className="text-sm font-medium text-fg">Email</label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-muted/70 h-5 w-5" />
        <input
          id={id}
          type="email"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="user@orbipax.med"
          disabled={disabled}
          className="w-full h-10 pl-10 pr-4 rounded-md border border-border text-sm text-fg placeholder:text-on-muted/70 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring"
        />
      </div>
    </>
  );
}
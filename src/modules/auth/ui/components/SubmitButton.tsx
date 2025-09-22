'use client';

import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function SubmitButton({
  isLoading = false,
  disabled = false,
  onClick,
  children = 'Sign In'
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full !py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-60"
      style={{
        background: 'linear-gradient(to right, hsl(221 83% 53%), hsl(221 83% 45%))',
        color: 'hsl(0 0% 100%)'
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
'use client';

import { useState } from 'react';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { RememberMe } from './RememberMe';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { SubmitButton } from './SubmitButton';
import { SignupPrompt } from './SignupPrompt';
import { Disclaimer } from './Disclaimer';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // TODO: Phase 3 - Connect to actual auth logic
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };


  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-6 sm:pt-8 space-y-4">
      <div className="space-y-2">
        <EmailField
          value={formData.email}
          onChange={(email) => setFormData(prev => ({ ...prev, email }))}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <PasswordField
          value={formData.password}
          onChange={(password) => setFormData(prev => ({ ...prev, password }))}
          disabled={isLoading}
        />
        <ForgotPasswordLink />
      </div>

      {error && (
        <div className="rounded-md bg-error/10 px-3 sm:px-4 py-2 text-xs text-error border border-error/20">
          {error}
        </div>
      )}

      <RememberMe
        checked={formData.remember}
        onChange={(remember) => setFormData(prev => ({ ...prev, remember }))}
        disabled={isLoading}
      />

      <SubmitButton
        isLoading={isLoading}
        disabled={!formData.email || !formData.password}
      />

      <SignupPrompt />
      <Disclaimer />
    </form>
  );
}
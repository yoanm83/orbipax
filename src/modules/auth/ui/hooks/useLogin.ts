'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signIn } from '../../application/auth.actions';
import { AUTH_ERROR_MESSAGE } from '../../domain/errors/auth.errors';
import type { SignInInput } from '../../domain/types/auth.types';

export type LoginState = {
  isLoading: boolean;
  error: string | null;
};

export type UseLoginReturn = {
  state: LoginState;
  onSubmit: (values: SignInInput) => Promise<void>;
  clearError: () => void;
};

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
  });

  const onSubmit = async (values: SignInInput) => {
    setState({ isLoading: true, error: null });

    try {
      const result = await signIn(values);

      if (!result.ok) {
        // Always show the generic error message from domain
        setState({
          isLoading: false,
          error: AUTH_ERROR_MESSAGE,
        });
        return;
      }

      // Success - redirect to dashboard
      setState({ isLoading: false, error: null });
      router.push('/dashboard');
    } catch {
      setState({
        isLoading: false,
        error: AUTH_ERROR_MESSAGE,
      });
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    state,
    onSubmit,
    clearError,
  };
}
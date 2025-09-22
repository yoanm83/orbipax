'use client';

import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginFooter } from './LoginFooter';

export function LoginCard() {
  return (
    <>
      <div className="w-full bg-card rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <LoginHeader />
        <LoginForm />
      </div>
      <LoginFooter />
    </>
  );
}
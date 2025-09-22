'use client';

export function LoginHeader() {
  return (
    <div className="rounded-t-xl bg-gradient-to-r from-primary/70 to-primary/90 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-on-primary mb-1">Sign In</h2>
      <p className="text-sm text-on-primary/90">Enter your credentials to access your account</p>
    </div>
  );
}
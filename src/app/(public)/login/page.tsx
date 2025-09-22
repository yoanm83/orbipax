import { LoginCard } from '@/modules/auth/ui';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[448px]">
        <div className="w-full flex flex-col items-center">
          <div className="mb-8">
            <img
              src="/assets/logos/orbipax-logo.svg"
              alt="OrbiPax"
              className="h-12 w-auto"
            />
          </div>
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
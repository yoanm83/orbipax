export default function LandingPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">OrbiPax</h1>
      <p className="text-base opacity-90">
        A modern, modular-monolith Clinical Mental Health application scaffold.
      </p>
      <div className="mt-6">
        <a className="underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded" href="/(app)">
          Enter App
        </a>
      </div>
    </section>
  );
}
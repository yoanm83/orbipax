import GlobalsBridge from "../globals-bridge";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalsBridge>
      <main className="container mx-auto p-4 container-safe">
        {children}
      </main>
    </GlobalsBridge>
  );
}
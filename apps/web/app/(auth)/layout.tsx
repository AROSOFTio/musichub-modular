import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-borderSoft bg-white shadow-card">
        <div className="border-b border-borderSoft bg-surface px-6 py-6 flex justify-center">
          <Logo />
        </div>
        <section className="px-6 py-8 sm:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}

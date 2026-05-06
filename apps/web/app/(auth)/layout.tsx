import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 gap-4">
      {/* Go back link above the card */}
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 bg-white px-6 py-6 flex justify-center">
          <Logo />
        </div>
        <section className="px-6 py-8 sm:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}

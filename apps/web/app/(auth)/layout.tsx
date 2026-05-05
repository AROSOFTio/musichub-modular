import Link from "next/link";
import { Download, Music2, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/ui/logo";

const authHighlights = [
  {
    icon: ShieldCheck,
    title: "Secure JWT sessions",
    copy: "Access tokens, refresh rotation, and role-aware backend guards are ready.",
  },
  {
    icon: Download,
    title: "Free normal downloads",
    copy: "Musichub keeps standard song downloads free while remix monetization stays deferred.",
  },
  {
    icon: Music2,
    title: "Deploy-ready foundation",
    copy: "The web app is structured for Docker Compose, reverse proxying, and future mobile clients.",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-borderSoft bg-white shadow-card lg:grid-cols-[1.15fr,0.85fr]">
        <section className="border-b border-borderSoft bg-surface px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <Logo />
          <div className="mt-10 space-y-4">
            <span className="pill">Musichub Access</span>
            <h1 className="max-w-lg text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Create and manage the production account layer for Musichub.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              This foundation connects the clean Musichub UI to real authentication
              endpoints instead of placeholder flows.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {authHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-borderSoft bg-white p-5"
              >
                <item.icon className="h-5 w-5 text-violet-700" />
                <h2 className="mt-4 text-lg font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-slate-500">
            Need the main application shell instead?
            {" "}
            <Link className="font-semibold text-violet-700" href="/">
              Return to Musichub
            </Link>
          </p>
        </section>

        <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</section>
      </div>
    </main>
  );
}

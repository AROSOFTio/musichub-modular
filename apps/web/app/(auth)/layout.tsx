import { Music2, ShieldCheck, UploadCloud } from "lucide-react";

import { Logo } from "@/components/ui/logo";

const authHighlights = [
  {
    icon: ShieldCheck,
    title: "Admin only",
    copy: "Public registration is disabled while the catalog is being prepared.",
  },
  {
    icon: UploadCloud,
    title: "Upload music",
    copy: "Add tracks, cover images, genres, release dates, and publishing status.",
  },
  {
    icon: Music2,
    title: "Manage catalog",
    copy: "Edit songs, publish or unpublish tracks, and choose editor picks.",
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
              Manage Musichub from one admin dashboard.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Log in to upload songs, edit catalog details, and control what appears
              on the live music site.
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
        </section>

        <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</section>
      </div>
    </main>
  );
}

import { Info, Music, Users, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">About MusicHub</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          The heartbeat of independent music streaming and free downloads.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/20">
            <Music className="h-6 w-6" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-[var(--foreground)]">Free Streaming</h3>
          <p className="mt-3 text-[var(--muted)] leading-relaxed">
            MusicHub was built on the belief that music should be accessible to everyone. We provide a platform where listeners can stream their favorite independent tracks without any subscription fees.
          </p>
        </div>

        <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/20">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-[var(--foreground)]">Artist Focused</h3>
          <p className="mt-3 text-[var(--muted)] leading-relaxed">
            We empower artists by giving them the tools to upload, manage, and share their music directly with their audience. Our platform is designed to help independent creators find their voice.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Our Mission</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">
          To bridge the gap between talented musicians and passionate listeners by providing a seamless, open, and beautiful music platform. We strive to foster a community where discovery and creativity thrive.
        </p>
      </div>
    </div>
  );
}

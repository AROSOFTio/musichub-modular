export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-extrabold text-[var(--foreground)]">Privacy Policy</h1>
      <p className="mt-4 text-[var(--muted)]">Last updated: May 6, 2026</p>

      <div className="mt-10 space-y-8 text-[var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <p className="mt-3 text-[var(--muted)]">
            We collect information you provide directly to us when you create an account, upload music, or contact us for support. This may include your name, email address, and profile information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
          <p className="mt-3 text-[var(--muted)]">
            We use the information we collect to provide, maintain, and improve our services, including processing uploads, personalizing your experience, and communicating with you about your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">3. Data Security</h2>
          <p className="mt-3 text-[var(--muted)]">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">4. Your Choices</h2>
          <p className="mt-3 text-[var(--muted)]">
            You may update or correct your account information at any time by logging into your account settings. You may also request to delete your account by contacting support.
          </p>
        </section>
      </div>
    </div>
  );
}

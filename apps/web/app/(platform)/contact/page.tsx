"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">Get in Touch</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Have a question or feedback? We'd love to hear from you. Send us a message and our support team will get back to you as soon as possible.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/20">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">Email Support</p>
                <p className="text-[var(--muted)]">support@musichub.arosoft.io</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-borderSoft bg-[var(--card-bg)] p-8 shadow-card lg:p-10">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="mt-6 text-2xl font-bold text-[var(--foreground)]">Message Sent!</h2>
              <p className="mt-2 text-[var(--muted)]">
                Thank you for reaching out. We'll get back to you at {formData.email} soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="button-primary mt-8"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="input-shell"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email"
                    className="input-shell"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this about?"
                  className="input-shell"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more..."
                  className="input-shell h-auto py-3 resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="button-primary w-full gap-2"
              >
                {status === "submitting" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

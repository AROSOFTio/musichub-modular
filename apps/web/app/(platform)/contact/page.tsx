"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { getPublicModules, submitSupportTicket } from "@/lib/api";
import { MODULE_KEYS, type ModuleFlags } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";

const requestTypes = [
  { value: "ADVERTISE", label: "Advertise", moduleKey: MODULE_KEYS.advertisingRequests },
  { value: "SONG_REQUEST", label: "Request song to be added", moduleKey: MODULE_KEYS.songRequests },
  { value: "SONG_REMOVAL", label: "Request song removal", moduleKey: MODULE_KEYS.songRemovalRequests },
  { value: "OTHER", label: "Other", moduleKey: MODULE_KEYS.contactSupport },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-[var(--foreground)]">{label}{children}</label>;
}

export default function ContactPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleFlags>({});
  const [category, setCategory] = useState("OTHER");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicModules().then((payload) => {
      setModules(payload.flags);
      if (!hasModule(payload.flags, MODULE_KEYS.contactSupport)) router.replace("/");
      const first = requestTypes.find((item) => hasModule(payload.flags, item.moduleKey));
      if (first) setCategory(first.value);
    }).catch(() => router.replace("/"));
  }, [router]);

  const enabledTypes = useMemo(() => requestTypes.filter((item) => hasModule(modules, item.moduleKey)), [modules]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const formData = new FormData(event.currentTarget);
      formData.set("category", category);
      await submitSupportTicket(formData);
      event.currentTarget.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Request failed.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Contact Support</h1>
        <p className="mt-2 text-[var(--muted)]">Submit a request and our team will continue the conversation through your ticket.</p>
      </div>

      <div className="rounded-[2rem] border border-borderSoft bg-[var(--card-bg)] p-6 shadow-card sm:p-8">
        {status === "success" ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
            <h2 className="mt-5 text-2xl font-black">Request submitted</h2>
            <button onClick={() => setStatus("idle")} className="button-primary mt-6">Submit another request</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <Field label="Request type">
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-shell mt-2">
                {enabledTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </Field>

            {category === "ADVERTISE" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business name"><input name="businessName" required className="input-shell mt-2" /></Field>
                <Field label="Contact person name"><input name="contactPersonName" required className="input-shell mt-2" /></Field>
                <Field label="Contact email"><input name="contactEmail" required type="email" className="input-shell mt-2" /></Field>
                <Field label="Contact phone"><input name="contactPhone" required className="input-shell mt-2" /></Field>
                <Field label="Advert type"><input name="advertType" required className="input-shell mt-2" /></Field>
                <Field label="Event name"><input name="eventName" className="input-shell mt-2" /></Field>
                <Field label="Event date"><input name="eventDate" type="date" className="input-shell mt-2" /></Field>
                <Field label="Target URL"><input name="targetUrl" type="url" className="input-shell mt-2" /></Field>
                <Field label="Advert image"><input name="advertImage" required type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" /></Field>
                <Field label="Business details"><textarea name="businessDetails" required rows={4} className="input-shell mt-2 h-auto py-3 sm:col-span-2" /></Field>
                <Field label="Campaign details/message"><textarea name="campaignDetails" required rows={5} className="input-shell mt-2 h-auto py-3 sm:col-span-2" /></Field>
              </div>
            ) : null}

            {category === "SONG_REQUEST" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Requester name"><input name="requesterName" required className="input-shell mt-2" /></Field>
                <Field label="Requester email"><input name="requesterEmail" required type="email" className="input-shell mt-2" /></Field>
                <Field label="Artist name"><input name="artistName" required className="input-shell mt-2" /></Field>
                <Field label="Song title"><input name="songTitle" required className="input-shell mt-2" /></Field>
                <Field label="Album name"><input name="albumName" className="input-shell mt-2" /></Field>
                <Field label="Release year"><input name="releaseYear" type="number" className="input-shell mt-2" /></Field>
                <Field label="Streaming link or reference URL"><input name="referenceUrl" type="url" className="input-shell mt-2" /></Field>
                <Field label="Reason/message"><textarea name="message" required rows={5} className="input-shell mt-2 h-auto py-3 sm:col-span-2" /></Field>
              </div>
            ) : null}

            {category === "SONG_REMOVAL" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Requester name"><input name="requesterName" required className="input-shell mt-2" /></Field>
                <Field label="Requester email"><input name="requesterEmail" required type="email" className="input-shell mt-2" /></Field>
                <Field label="Requester phone"><input name="requesterPhone" className="input-shell mt-2" /></Field>
                <Field label="Artist name"><input name="artistName" required className="input-shell mt-2" /></Field>
                <Field label="Song title"><input name="songTitle" required className="input-shell mt-2" /></Field>
                <Field label="Album name"><input name="albumName" className="input-shell mt-2" /></Field>
                <Field label="Proof of ownership/authorization"><input name="proofAttachment" required type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" /></Field>
                <Field label="Reason for removal"><textarea name="removalReason" required rows={5} className="input-shell mt-2 h-auto py-3 sm:col-span-2" /></Field>
                <label className="flex gap-3 text-sm text-[var(--foreground)] sm:col-span-2"><input name="confirmRights" value="true" required type="checkbox" />I confirm I am the real artist, rights owner, authorized representative, or legally permitted to make this request.</label>
              </div>
            ) : null}

            {category === "OTHER" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name"><input name="name" required className="input-shell mt-2" /></Field>
                <Field label="Email"><input name="email" required type="email" className="input-shell mt-2" /></Field>
                <Field label="Phone"><input name="phone" className="input-shell mt-2" /></Field>
                <Field label="Subject"><input name="subject" required className="input-shell mt-2" /></Field>
                <Field label="Optional attachment"><input name="attachment" type="file" className="mt-2 block w-full text-sm" /></Field>
                <Field label="Message"><textarea name="message" required rows={5} className="input-shell mt-2 h-auto py-3 sm:col-span-2" /></Field>
              </div>
            ) : null}

            {status === "error" ? <div className="flex gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}</div> : null}
            <button disabled={status === "submitting"} className="button-primary w-full gap-2" type="submit">
              <Send className="h-4 w-4" /> {status === "submitting" ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

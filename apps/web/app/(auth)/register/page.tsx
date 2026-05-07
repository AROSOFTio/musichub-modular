"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getPublicModules, registerArtistRequest, registerUserRequest } from "@/lib/api";
import { MODULE_KEYS, type ModuleFlags } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";

export default function RegisterPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleFlags>({});
  const [mode, setMode] = useState("user");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("type") === "artist") {
      setMode("artist");
    }
    getPublicModules().then((payload) => {
      setModules(payload.flags);
      const userEnabled = hasModule(payload.flags, MODULE_KEYS.userRegistration);
      const artistEnabled = hasModule(payload.flags, MODULE_KEYS.artistRegistration);
      if (!userEnabled && !artistEnabled) router.replace("/login");
      if (mode === "user" && !userEnabled && artistEnabled) setMode("artist");
      if (mode === "artist" && !artistEnabled && userEnabled) setMode("user");
    }).catch(() => router.replace("/login"));
  }, [mode, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, string>;
    try {
      if (mode === "artist") await registerArtistRequest(payload as any);
      else await registerUserRequest(payload as any);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  }

  const userEnabled = hasModule(modules, MODULE_KEYS.userRegistration);
  const artistEnabled = hasModule(modules, MODULE_KEYS.artistRegistration);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full rounded-[2rem] border border-borderSoft bg-[var(--card-bg)] p-8 shadow-card">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Create account</h1>
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          {userEnabled ? <button type="button" onClick={() => setMode("user")} className={`rounded-xl px-3 py-2 text-sm font-bold ${mode === "user" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}>Listener</button> : null}
          {artistEnabled ? <button type="button" onClick={() => setMode("artist")} className={`rounded-xl px-3 py-2 text-sm font-bold ${mode === "artist" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}>Artist</button> : null}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input name="displayName" required className="input-shell" placeholder="Display name" />
          <input name="email" required type="email" className="input-shell" placeholder="Email" />
          <input name="username" className="input-shell" placeholder="Username (optional)" />
          <input name="password" required type="password" minLength={8} className="input-shell" placeholder="Password" />
          {mode === "artist" ? (
            <>
              <input name="artistName" required className="input-shell" placeholder="Artist name" />
              <textarea name="bio" rows={3} className="input-shell h-auto py-3" placeholder="Artist bio (optional)" />
            </>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="button-primary w-full" type="submit">Create Account</button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-violet-600">Back to login</Link>
      </div>
    </div>
  );
}

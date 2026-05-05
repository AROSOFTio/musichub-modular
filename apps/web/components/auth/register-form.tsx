"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/lib/auth-context";

type RoleOption = "USER" | "ARTIST";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleOption>("USER");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        displayName,
        email,
        username: username || undefined,
        password,
        role,
      });
      router.push("/");
      router.refresh();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create the account right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="displayName">
          Display name
        </label>
        <input
          className="input-shell"
          id="displayName"
          minLength={2}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Musichub Listener"
          required
          value={displayName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            className="input-shell"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="username">
            Username
          </label>
          <input
            className="input-shell"
            id="username"
            minLength={3}
            onChange={(event) => setUsername(event.target.value)}
            pattern="^[a-zA-Z0-9_]+$"
            placeholder="musichub_user"
            value={username}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            className="input-shell"
            id="password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Choose a strong password"
            required
            type="password"
            value={password}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="role">
            Account type
          </label>
          <select
            className="input-shell"
            id="role"
            onChange={(event) => setRole(event.target.value as RoleOption)}
            value={role}
          >
            <option value="USER">Listener</option>
            <option value="ARTIST">Artist</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button className="button-primary w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-slate-500">
        Already registered?
        {" "}
        <Link className="font-semibold text-violet-700" href="/login">
          Login here
        </Link>
      </p>
    </form>
  );
}


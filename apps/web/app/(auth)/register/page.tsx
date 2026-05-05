import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="pill">Register</span>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Create your Musichub account
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Start with a listener or artist account. Admin access remains seed-only.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}


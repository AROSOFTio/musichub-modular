import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="pill">Login</span>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to Musichub
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Use your existing user, artist, or seeded admin account.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}


import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="pill">Login</span>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Admin login
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Sign in with the admin account to upload and manage music.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}


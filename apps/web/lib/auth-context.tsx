"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  type AuthResponse,
  type SessionUser,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
} from "@/lib/api";

type AuthContextValue = {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    displayName: string;
    username?: string;
    role?: "USER" | "ARTIST";
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const SESSION_STORAGE_KEY = "musichub.session";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function persistSession(session: AuthResponse | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (!storedSession?.refreshToken) {
      setSession(storedSession);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const refreshedSession = await refreshRequest(storedSession.refreshToken);
        if (!cancelled) {
          setSession(refreshedSession);
          persistSession(refreshedSession);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          persistSession(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(payload: { email: string; password: string }) {
    const nextSession = await loginRequest(payload);
    setSession(nextSession);
    persistSession(nextSession);
  }

  async function register(payload: {
    email: string;
    password: string;
    displayName: string;
    username?: string;
    role?: "USER" | "ARTIST";
  }) {
    const nextSession = await registerRequest(payload);
    setSession(nextSession);
    persistSession(nextSession);
  }

  async function logout() {
    try {
      if (session?.accessToken) {
        await logoutRequest(session.accessToken, session.refreshToken);
      }
    } finally {
      setSession(null);
      persistSession(null);
    }
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
    isAuthenticated: Boolean(session?.accessToken),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}


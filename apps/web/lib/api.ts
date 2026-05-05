export type UserRole = "USER" | "ARTIST" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

type JsonBody =
  | BodyInit
  | Record<string, unknown>
  | null
  | undefined;

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api";
}

async function apiRequest<T>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: JsonBody } = {},
) {
  const headers = new Headers(init.headers);
  let body = init.body;

  if (body && !(body instanceof FormData) && typeof body === "object" && !(body instanceof Blob)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    body: body as BodyInit | null | undefined,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorPayload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorPayload.message)) {
        message = errorPayload.message.join(", ");
      } else if (errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function loginRequest(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerRequest(payload: {
  email: string;
  password: string;
  displayName: string;
  username?: string;
  role?: UserRole;
}) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function refreshRequest(refreshToken?: string) {
  return apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: refreshToken ? { refreshToken } : {},
  });
}

export function logoutRequest(accessToken: string, refreshToken?: string) {
  return apiRequest<{ success: boolean }>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: refreshToken ? { refreshToken } : {},
  });
}

export function getAdminOverview(accessToken: string) {
  return apiRequest<{
    totalUsers: number;
    totalArtists: number;
    totalAdmins: number;
    freeDownloadsEnabled: boolean;
    remixPaymentsEnabled: boolean;
  }>("/admin/overview", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


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

export type CatalogArtist = {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  verified?: boolean;
};

export type CatalogGenre = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
};

export type CatalogSong = {
  id: string;
  title: string;
  slug: string;
  artist: CatalogArtist;
  genre: CatalogGenre;
  coverImage: string | null;
  streamUrl: string;
  downloadUrl: string | null;
  duration: number | null;
  description: string | null;
  releaseDate: string | null;
  isPublished: boolean;
  allowDownload: boolean;
  allowRemix: boolean;
  downloadCount: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
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
    totalSongs: number;
    publishedSongs: number;
    freeDownloadsEnabled: boolean;
    remixPaymentsEnabled: boolean;
  }>("/admin/overview", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function listSongs(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiRequest<CatalogSong[]>(`/songs${params}`, {
    cache: "no-store",
  });
}

export function getSong(slug: string) {
  return apiRequest<CatalogSong>(`/songs/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

export function listManageableSongs(accessToken: string) {
  return apiRequest<CatalogSong[]>("/songs/manage", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function uploadSong(accessToken: string, payload: FormData) {
  return apiRequest<CatalogSong>("/songs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function updateSong(accessToken: string, id: string, payload: FormData) {
  return apiRequest<CatalogSong>(`/songs/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function deleteSong(accessToken: string, id: string) {
  return apiRequest<{ success: boolean }>(`/songs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

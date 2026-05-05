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
  _count?: { songs: number; followers: number };
};

export type CatalogGenre = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  _count?: { songs: number };
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
  isEditorPick: boolean;
  downloadCount: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
};

export type HomeFeed = {
  featured: CatalogSong | null;
  trending: CatalogSong[];
  latest: CatalogSong[];
  editorPicks: CatalogSong[];
  topDownloads: CatalogSong[];
  popularArtists: CatalogArtist[];
  genres: CatalogGenre[];
};

export type SearchResult = {
  songs: CatalogSong[];
  artists: CatalogArtist[];
  genres: CatalogGenre[];
};

type JsonBody = BodyInit | Record<string, unknown> | null | undefined;

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

// Auth
export function loginRequest(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload });
}

export function registerRequest(payload: {
  email: string;
  password: string;
  displayName: string;
  username?: string;
  role?: UserRole;
}) {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: payload });
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
    headers: { Authorization: `Bearer ${accessToken}` },
    body: refreshToken ? { refreshToken } : {},
  });
}

// Home Feed
export function getHomeFeed() {
  return apiRequest<HomeFeed>("/home", { cache: "no-store" });
}

// Discovery
export function getTrending(limit?: number) {
  const params = limit ? `?limit=${limit}` : "";
  return apiRequest<CatalogSong[]>(`/discover/trending${params}`, { cache: "no-store" });
}

export function getLatest(limit?: number) {
  const params = limit ? `?limit=${limit}` : "";
  return apiRequest<CatalogSong[]>(`/discover/latest${params}`, { cache: "no-store" });
}

export function getTop50() {
  return apiRequest<CatalogSong[]>("/discover/top-50", { cache: "no-store" });
}

export function getAllTime() {
  return apiRequest<CatalogSong[]>("/discover/all-time", { cache: "no-store" });
}

export function getEditorPicks() {
  return apiRequest<CatalogSong[]>("/discover/editor-picks", { cache: "no-store" });
}

export function searchAll(query: string) {
  return apiRequest<SearchResult>(`/discover/search?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });
}

// Genres
export function listGenres() {
  return apiRequest<CatalogGenre[]>("/genres", { cache: "no-store" });
}

export function getGenre(slug: string) {
  return apiRequest<CatalogGenre & { songs: CatalogSong[] }>(`/genres/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

// Artists
export function listArtists() {
  return apiRequest<CatalogArtist[]>("/artists", { cache: "no-store" });
}

export function getArtist(slug: string) {
  return apiRequest<CatalogArtist & { songs: CatalogSong[] }>(`/artists/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

// Songs
export function listSongs(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiRequest<CatalogSong[]>(`/songs${params}`, { cache: "no-store" });
}

export function getSong(slug: string) {
  return apiRequest<CatalogSong>(`/songs/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

export function listManageableSongs(accessToken: string) {
  return apiRequest<CatalogSong[]>("/songs/manage", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function uploadSong(accessToken: string, payload: FormData) {
  return apiRequest<CatalogSong>("/songs", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload,
  });
}

export function updateSong(accessToken: string, id: string, payload: FormData) {
  return apiRequest<CatalogSong>(`/songs/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload,
  });
}

export function deleteSong(accessToken: string, id: string) {
  return apiRequest<{ success: boolean }>(`/songs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function setEditorPick(accessToken: string, songId: string, pick: boolean) {
  return apiRequest<CatalogSong>(`/songs/${songId}/editor-pick`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: { pick },
  });
}

// Admin
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
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

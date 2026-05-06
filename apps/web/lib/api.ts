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
  verificationStatus?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  _count?: { songs: number; followers: number };
};

export type AdminArtist = CatalogArtist & {
  _count: { songs: number; followers: number };
};

export type CatalogGenre = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  _count?: { songs: number };
};

export type AdminGenre = CatalogGenre & { _count: { songs: number } };

export type AdminAlbum = {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artist: { id: string; name: string; slug: string };
  coverImage: string | null;
  releaseDate: string | null;
  description: string | null;
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { songs: number };
};

export type AdminMusicType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  typeCategory: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { songs: number };
};

export type AdminEditorPick = {
  id: string;
  songId: string;
  song: AdminSong;
  priority: number;
  sectionLabel: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminHeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  linkedSongId: string | null;
  linkedArtistId: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type TrendingSettings = {
  id: string;
  playsWeight: number;
  downloadsWeight: number;
  recencyWeight: number;
  editorBoost: number;
  updatedAt: string;
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

export type AdminSong = {
  id: string;
  title: string;
  slug: string;
  status: string;
  artist: { id: string; name: string; slug: string };
  genre: { id: string; name: string; slug: string };
  album: { id: string; title: string } | null;
  musicType: { id: string; name: string } | null;
  coverImage: string | null;
  audioFile: string;
  duration: number | null;
  description: string | null;
  releaseDate: string | null;
  isPublished: boolean;
  allowDownload: boolean;
  allowRemix: boolean;
  downloadCount: number;
  playCount: number;
  isEditorPick: boolean;
  manualTrendingBoost: number;
  seoTitle: string | null;
  seoDescription: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  username: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  _count: { songs: number; playlists: number };
};

export type AdminOverview = {
  totalUsers: number;
  totalArtistAccounts: number;
  totalAdmins: number;
  totalArtistProfiles: number;
  totalGenres: number;
  totalSongs: number;
  publishedSongs: number;
  draftSongs: number;
  disabledSongs: number;
  totalAlbums: number;
  totalMusicTypes: number;
  totalPlays: number;
  totalDownloads: number;
  topSongs: AdminSong[];
  latestSongs: AdminSong[];
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

function authHeader(token: string | undefined) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export function loginRequest(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload });
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

// ─── Home Feed ─────────────────────────────────────────────────────────────
export function getHomeFeed() {
  return apiRequest<HomeFeed>("/home", { cache: "no-store" });
}

// ─── Discovery ─────────────────────────────────────────────────────────────
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
  return apiRequest<SearchResult>(`/discover/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
}

// ─── Public Genres ─────────────────────────────────────────────────────────
export function listGenres() {
  return apiRequest<CatalogGenre[]>("/genres", { cache: "no-store" });
}

export function getGenre(slug: string) {
  return apiRequest<CatalogGenre & { songs: CatalogSong[] }>(`/genres/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

// ─── Public Artists ────────────────────────────────────────────────────────
export function listArtists() {
  return apiRequest<CatalogArtist[]>("/artists", { cache: "no-store" });
}

export function getArtist(slug: string) {
  return apiRequest<CatalogArtist & { songs: CatalogSong[] }>(`/artists/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

// ─── Public Songs ──────────────────────────────────────────────────────────
export function listSongs(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiRequest<CatalogSong[]>(`/songs${params}`, { cache: "no-store" });
}

export function getSong(slug: string) {
  return apiRequest<CatalogSong>(`/songs/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

export function listManageableSongs(accessToken: string | undefined) {
  return apiRequest<CatalogSong[]>("/songs/manage", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function uploadSong(accessToken: string | undefined, payload: FormData) {
  return apiRequest<CatalogSong>("/songs", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateSong(accessToken: string | undefined, id: string, payload: FormData) {
  return apiRequest<CatalogSong>(`/songs/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteSong(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/songs/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

export function setEditorPick(accessToken: string | undefined, songId: string, pick: boolean) {
  return apiRequest<CatalogSong>(`/songs/${songId}/editor-pick`, {
    method: "PUT",
    headers: authHeader(accessToken),
    body: { pick },
  });
}

// ─── Admin Overview ────────────────────────────────────────────────────────
export function getAdminOverview(accessToken: string | undefined) {
  return apiRequest<AdminOverview>("/admin/overview", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Songs ───────────────────────────────────────────────────────────
export function listAdminSongs(accessToken: string | undefined, status?: string) {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<AdminSong[]>(`/admin/songs${params}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminSong(accessToken: string | undefined, id: string) {
  return apiRequest<AdminSong>(`/admin/songs/${id}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function updateAdminSong(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminSong>(`/admin/songs/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminSong(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/songs/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

export function boostSong(accessToken: string | undefined, id: string, boost: number) {
  return apiRequest<AdminSong>(`/admin/songs/${id}/boost`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: { boost },
  });
}

// ─── Admin Artists ─────────────────────────────────────────────────────────
export function listAdminArtists(accessToken: string | undefined, verificationStatus?: string) {
  const params = verificationStatus ? `?verificationStatus=${encodeURIComponent(verificationStatus)}` : "";
  return apiRequest<AdminArtist[]>(`/admin/artists${params}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminArtist(accessToken: string | undefined, id: string) {
  return apiRequest<AdminArtist>(`/admin/artists/${id}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminArtist(
  accessToken: string | undefined,
  payload: Record<string, unknown>,
) {
  return apiRequest<AdminArtist>("/admin/artists", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminArtist(
  accessToken: string | undefined,
  id: string,
  payload: Record<string, unknown>,
) {
  return apiRequest<AdminArtist>(`/admin/artists/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminArtist(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/artists/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

export function verifyAdminArtist(
  accessToken: string | undefined,
  id: string,
  verificationStatus: string,
) {
  return apiRequest<AdminArtist>(`/admin/artists/${id}/verify`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: { verificationStatus },
  });
}

// ─── Admin Genres ──────────────────────────────────────────────────────────
export function listAdminGenres(accessToken: string | undefined) {
  return apiRequest<AdminGenre[]>("/admin/genres", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminGenre(accessToken: string | undefined, id: string) {
  return apiRequest<AdminGenre>(`/admin/genres/${id}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminGenre(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<AdminGenre>("/admin/genres", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminGenre(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminGenre>(`/admin/genres/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminGenre(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/genres/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Albums ──────────────────────────────────────────────────────────
export function listAdminAlbums(accessToken: string | undefined) {
  return apiRequest<AdminAlbum[]>("/admin/albums", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminAlbum(accessToken: string | undefined, id: string) {
  return apiRequest<AdminAlbum>(`/admin/albums/${id}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminAlbum(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<AdminAlbum>("/admin/albums", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminAlbum(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminAlbum>(`/admin/albums/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminAlbum(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/albums/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Music Types ─────────────────────────────────────────────────────
export function listAdminMusicTypes(accessToken: string | undefined, category?: string) {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest<AdminMusicType[]>(`/admin/music-types${params}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminMusicType(accessToken: string | undefined, id: string) {
  return apiRequest<AdminMusicType>(`/admin/music-types/${id}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminMusicType(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<AdminMusicType>("/admin/music-types", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminMusicType(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminMusicType>(`/admin/music-types/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminMusicType(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/music-types/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Trending ────────────────────────────────────────────────────────
export function listAdminTrending(accessToken: string | undefined) {
  return apiRequest<AdminSong[]>("/admin/trending", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function listAdminTop50(accessToken: string | undefined) {
  return apiRequest<AdminSong[]>("/admin/trending/top-50", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function listAdminAllTime(accessToken: string | undefined) {
  return apiRequest<AdminSong[]>("/admin/trending/all-time", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function getAdminTrendingSettings(accessToken: string | undefined) {
  return apiRequest<TrendingSettings>("/admin/trending/settings", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function updateAdminTrendingSettings(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<TrendingSettings>("/admin/trending/settings", {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

// ─── Admin Editor Picks ────────────────────────────────────────────────────
export function listAdminEditorPicks(accessToken: string | undefined) {
  return apiRequest<AdminEditorPick[]>("/admin/editor-picks", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminEditorPick(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<AdminEditorPick>("/admin/editor-picks", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminEditorPick(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminEditorPick>(`/admin/editor-picks/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminEditorPick(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/editor-picks/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Hero Banners ────────────────────────────────────────────────────
export function listAdminHeroBanners(accessToken: string | undefined, status?: string) {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<AdminHeroBanner[]>(`/admin/hero-banners${params}`, {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function createAdminHeroBanner(accessToken: string | undefined, payload: Record<string, unknown>) {
  return apiRequest<AdminHeroBanner>("/admin/hero-banners", {
    method: "POST",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function updateAdminHeroBanner(accessToken: string | undefined, id: string, payload: Record<string, unknown>) {
  return apiRequest<AdminHeroBanner>(`/admin/hero-banners/${id}`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: payload,
  });
}

export function deleteAdminHeroBanner(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/hero-banners/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

// ─── Admin Users ───────────────────────────────────────────────────────────
export function listAdminUsers(accessToken: string | undefined) {
  return apiRequest<AdminUser[]>("/admin/users", {
    cache: "no-store",
    headers: authHeader(accessToken),
  });
}

export function updateAdminUserRole(accessToken: string | undefined, id: string, role: string) {
  return apiRequest<AdminUser>(`/admin/users/${id}/role`, {
    method: "PATCH",
    headers: authHeader(accessToken),
    body: { role },
  });
}

export function deleteAdminUser(accessToken: string | undefined, id: string) {
  return apiRequest<{ success: boolean }>(`/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeader(accessToken),
  });
}

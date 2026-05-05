export type Playlist = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { songs: number };
  songs?: any[];
};

export type Comment = {
  id: string;
  userId: string;
  songId: string;
  content: string;
  createdAt: string;
  user: {
    displayName: string;
    username: string | null;
    avatarUrl: string | null;
  };
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
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

// Likes
export function likeSong(accessToken: string, songId: string) {
  return apiRequest<{ id: string }>(`/engagement/likes/${songId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function unlikeSong(accessToken: string, songId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/likes/${songId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Favorites
export function addFavorite(accessToken: string, songId: string) {
  return apiRequest<{ id: string }>(`/engagement/favorites/${songId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function removeFavorite(accessToken: string, songId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/favorites/${songId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getFavorites(accessToken: string) {
  return apiRequest<any[]>(`/engagement/favorites`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Playlists
export function createPlaylist(accessToken: string, payload: { name: string; description?: string; isPublic?: boolean }) {
  return apiRequest<Playlist>(`/engagement/playlists`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload,
  });
}

export function getUserPlaylists(accessToken: string) {
  return apiRequest<Playlist[]>(`/engagement/playlists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getPlaylist(id: string, accessToken?: string) {
  return apiRequest<Playlist>(`/engagement/playlists/${id}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
}

export function addSongToPlaylist(accessToken: string, playlistId: string, songId: string) {
  return apiRequest<any>(`/engagement/playlists/${playlistId}/songs`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: { songId },
  });
}

export function removeSongFromPlaylist(accessToken: string, playlistId: string, songId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/playlists/${playlistId}/songs/${songId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deletePlaylist(accessToken: string, playlistId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/playlists/${playlistId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Follows
export function followArtist(accessToken: string, artistId: string) {
  return apiRequest<any>(`/engagement/follows/${artistId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function unfollowArtist(accessToken: string, artistId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/follows/${artistId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// History
export function recordPlayHistory(accessToken: string, songId: string) {
  return apiRequest<any>(`/engagement/history/${songId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getPlayHistory(accessToken: string) {
  return apiRequest<any[]>(`/engagement/history`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Comments
export function addComment(accessToken: string, songId: string, content: string) {
  return apiRequest<Comment>(`/engagement/comments/${songId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: { content },
  });
}

export function deleteComment(accessToken: string, commentId: string) {
  return apiRequest<{ success: boolean }>(`/engagement/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getSongComments(songId: string) {
  return apiRequest<Comment[]>(`/engagement/comments/${songId}`);
}

// Notifications
export function getNotifications(accessToken: string) {
  return apiRequest<Notification[]>(`/engagement/notifications`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function markNotificationRead(accessToken: string, notificationId: string) {
  return apiRequest<any>(`/engagement/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

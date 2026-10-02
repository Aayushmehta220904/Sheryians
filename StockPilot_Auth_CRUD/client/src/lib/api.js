const API_BASE = import.meta.env.VITE_API_URL || "";
let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return { message: await response.text() };
}

async function performRefresh() {
  const response = await fetch(`${API_BASE}/api/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    accessToken = null;
    throw Object.assign(new Error(data.message || "Session refresh failed"), {
      status: response.status,
      details: data.errors || [],
    });
  }

  accessToken = data.accessToken;
  return data;
}

export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}, retry = true) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const isAuthAction = path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register") || path.startsWith("/api/auth/refresh-token");

  if (response.status === 401 && retry && !isAuthAction) {
    try {
      await refreshSession();
      return apiRequest(path, options, false);
    } catch {
      accessToken = null;
    }
  }

  const data = await parseResponse(response);
  if (!response.ok) {
    throw Object.assign(new Error(data.message || "Request failed"), {
      status: response.status,
      details: data.errors || [],
    });
  }
  return data;
}

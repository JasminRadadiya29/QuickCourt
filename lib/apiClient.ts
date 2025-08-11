export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.localStorage.getItem('token');
    return token || null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = window.localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string>; auth?: boolean } = {}) {
  const { method = 'GET', body, headers = {}, auth = true } = options;
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let error: any = { status: res.status, message: res.statusText };
    try { error = await res.json(); } catch {}
    throw error;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}



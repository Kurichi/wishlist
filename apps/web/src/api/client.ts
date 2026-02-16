const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string; message?: string };
    throw new Error(body.error || body.message || `HTTP ${response.status}`);
  }

  return response.json();
}

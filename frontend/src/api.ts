export const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return (await res.json()) as T;
}
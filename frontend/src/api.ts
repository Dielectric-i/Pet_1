export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
  // const res = await fetch(`${API_BASE}${url}`, {
  // const res = await fetch(`http://localhost:5000${url}`, {
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
export async function http<T>(apiUrl: string, path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  const json = text.length ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = json?.message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json as T;
}

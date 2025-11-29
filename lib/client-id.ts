const CLIENT_ID_KEY = "hcs-client-id";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getClientId(): string {
  if (!isBrowser()) return "anonymous";

  try {
    const existing = window.localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;

    const newId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    window.localStorage.setItem(CLIENT_ID_KEY, newId);
    return newId;
  } catch {
    return "anonymous";
  }
}

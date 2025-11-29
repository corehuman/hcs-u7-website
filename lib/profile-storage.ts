import type { HCSProfile } from "./hcs-generator";

const PROFILE_KEY = "hcs-profile";
const PROFILE_GENERATED_AT_KEY = "hcs-generated-at";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function saveProfile(profile: HCSProfile): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.localStorage.setItem(PROFILE_GENERATED_AT_KEY, new Date().toISOString());
  } catch {
    // stockage silencieux : si le navigateur le bloque, le profil reste en mémoire uniquement
  }
}

export function loadProfile(): HCSProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HCSProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(PROFILE_GENERATED_AT_KEY);
  } catch {
    // ignore
  }
}

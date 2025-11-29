import type { HCSProfile } from "./hcs-generator";
import { generateRotationKey } from "./hcs-rotating-code";
import { getRedisClient } from "./redis-client";

export interface StoredProfile {
  profile: HCSProfile;
  rotationKey: string;
}

const PROFILE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 jours

const memoryStore = new Map<string, StoredProfile>();

function buildRedisKey(userId: string): string {
  return `hcs:profile:${userId}`;
}

export async function setUserProfile(
  userId: string,
  profile: HCSProfile,
): Promise<StoredProfile> {
  const client = await getRedisClient().catch(() => null);

  if (!client) {
    const existing = memoryStore.get(userId);
    const rotationKey = existing?.rotationKey ?? generateRotationKey();
    const entry: StoredProfile = { profile, rotationKey };
    memoryStore.set(userId, entry);
    return entry;
  }

  const key = buildRedisKey(userId);
  let rotationKey = generateRotationKey();

  try {
    const existingRaw = await client.get(key);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as StoredProfile;
      rotationKey = existing.rotationKey ?? rotationKey;
    }
  } catch (error) {
    console.error("[server-profile-store] Failed to read existing profile:", error);
  }

  const entry: StoredProfile = { profile, rotationKey };

  try {
    await client.set(key, JSON.stringify(entry), {
      EX: PROFILE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("[server-profile-store] Failed to store profile in Redis:", error);
    memoryStore.set(userId, entry);
  }

  return entry;
}

export async function getUserProfile(userId: string): Promise<StoredProfile | null> {
  const client = await getRedisClient().catch(() => null);

  if (!client) {
    return memoryStore.get(userId) ?? null;
  }

  const key = buildRedisKey(userId);

  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch (error) {
    console.error("[server-profile-store] Failed to read profile from Redis:", error);
    return memoryStore.get(userId) ?? null;
  }
}

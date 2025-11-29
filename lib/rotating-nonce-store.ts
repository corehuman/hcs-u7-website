import { getRedisClient } from "./redis-client";

const NONCE_TTL_SECONDS = 20 * 60; // 20 minutes

const memoryNonces = new Set<string>();

function buildNonceKey(userId: string, window: number): string {
  return `hcs:nonce:${userId}:${window}`;
}

export async function registerNonce(
  userId: string,
  window: number,
): Promise<"ok" | "replay"> {
  const client = await getRedisClient().catch(() => null);
  const key = buildNonceKey(userId, window);

  if (!client) {
    if (memoryNonces.has(key)) return "replay";
    memoryNonces.add(key);
    return "ok";
  }

  try {
    const created = await client.setNX(key, "1");
    if (!created) return "replay";
    await client.expire(key, NONCE_TTL_SECONDS);
    return "ok";
  } catch (error) {
    console.error("[rotating-nonce-store] Redis error:", error);
    if (memoryNonces.has(key)) return "replay";
    memoryNonces.add(key);
    return "ok";
  }
}

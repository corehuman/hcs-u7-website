import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;
let connecting: Promise<RedisClientType | null> | null = null;

function hasRedisEnv(): boolean {
  return (Boolean(process.env.REDIS_URL) ||
    (Boolean(process.env.REDIS_HOST) &&
      Boolean(process.env.REDIS_PORT) &&
      Boolean(process.env.REDIS_PASSWORD)));
}

function createRedisClient(): RedisClientType | null {
  if (!hasRedisEnv()) return null;

  if (process.env.REDIS_URL) {
    return createClient({ url: process.env.REDIS_URL });
  }

  const host = process.env.REDIS_HOST as string;
  const port = Number(process.env.REDIS_PORT ?? 6379);
  const username = process.env.REDIS_USERNAME ?? "default";
  const password = process.env.REDIS_PASSWORD as string;

  return createClient({
    socket: { host, port },
    username,
    password,
  });
}

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (client) return client;

  if (!connecting) {
    const created = createRedisClient();
    if (!created) return null;

    connecting = created
      .connect()
      .then(() => {
        client = created;
        return client;
      })
      .catch((error) => {
        console.error("[redis] Connection error:", error);
        client = null;
        return null;
      });
  }

  return connecting;
}

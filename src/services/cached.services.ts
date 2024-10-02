'use server';

import redis from '@/lib/redis.lib';

export async function removeCache(key: string) {
  return await redis.del(key);
}

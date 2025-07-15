import { getRedis } from "@/lib/utils/redis";
import { IPartnerData } from "@/lib/types.client";

const CACHE_TTL = 10 * 60; // 10 minutes in seconds
const CACHE_KEY_PREFIX = "partner_data:";

export const getCachedPartnerData = async (
  userId: string
): Promise<IPartnerData | null> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for partner data: ${userId}`);
      return cachedData as IPartnerData;
    }

    console.log(`Cache miss for partner data: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error getting cached partner data:", error);
    return null;
  }
};

export const setCachedPartnerData = async (
  userId: string,
  data: IPartnerData
): Promise<void> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;

    await redis.set(cacheKey, JSON.stringify(data), {
      ex: CACHE_TTL,
    });

    console.log(`Cached partner data for: ${userId} (TTL: ${CACHE_TTL}s)`);
  } catch (error) {
    console.error("Error setting cached partner data:", error);
  }
};

export const invalidateCachedPartnerData = async (
  userId: string
): Promise<void> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    await redis.del(cacheKey);
    console.log(`Invalidated cache for partner data: ${userId}`);
  } catch (error) {
    console.error("Error invalidating cached partner data:", error);
  }
};

export const refreshCachedPartnerData = async (
  userId: string,
  freshData: IPartnerData
): Promise<void> => {
  try {
    // First invalidate, then set fresh data
    await invalidateCachedPartnerData(userId);
    await setCachedPartnerData(userId, freshData);
    console.log(`Refreshed cache for partner data: ${userId}`);
  } catch (error) {
    console.error("Error refreshing cached partner data:", error);
  }
};

import { getRedis } from "@/lib/utils/redis";

export const saveCheckoutPayload = async (
  referenceId: string,
  payload: any
) => {
  const redis = getRedis();
  await redis.set(`checkout:${referenceId}`, JSON.stringify(payload), {
    ex: 60 * 5, // expire in 300 seconds (or slightly more if needed)
    nx: true,
  });
};

export const savePaymentPayload = async (
  orderId: string,
  orderPayload: any
) => {
  const redis = getRedis();
  const redisKey = `checkout:${orderId}`;

  await redis.set(redisKey, JSON.stringify(orderPayload), {
    ex: 90, // expire in 90 seconds
  });
};

export const getCheckoutPayload = async (referenceId: string) => {
  const redis = getRedis();
  const data: any = await redis.get(`checkout:${referenceId}`);
  if (!data) return null;
  return data;
};

export const deleteCheckoutPayload = async (referenceId: string) => {
  const redis = getRedis();
  await redis.del(`checkout:${referenceId}`);
};

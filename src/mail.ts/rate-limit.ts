import { prisma } from "@/lib/prisma";

/**
 * A Database-backed Rate Limiter
 * * @param key - Unique identifier (e.g., "login:127.0.0.1" or "verify:user_id")
 * @param limit - Max requests allowed within the window
 * @param windowMs - Time window in milliseconds (e.g., 15 * 60 * 1000 for 15 mins)
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();

  // 1. Find or Create the rate limit record for this key
  // Using an upsert or finding it first
  const record = await prisma.rateLimit.findUnique({
    where: { key },
  });

  // 2. If no record exists, create the first entry
  if (!record) {
    await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        lastReset: now,
      },
    });
    return { success: true, remaining: limit - 1 };
  }

  // 3. Check if the time window has expired
  const timePassed = now.getTime() - record.lastReset.getTime();

  if (timePassed > windowMs) {
    // Window expired: Reset the count to 1 and update the timestamp
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        lastReset: now,
      },
    });
    return { success: true, remaining: limit - 1 };
  }

  // 4. If window is still active, check the count
  if (record.count >= limit) {
    // Block the request
    return { success: false, remaining: 0 };
  }

  // 5. Increment the count
  const updatedRecord = await prisma.rateLimit.update({
    where: { key },
    data: {
      count: {
        increment: 1,
      },
    },
  });

  return {
    success: true,
    remaining: limit - updatedRecord.count
  };
}
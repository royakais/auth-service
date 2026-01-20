import { prisma } from "./prisma";

/**
 * @param key - A unique identifier (like user ID or IP)
 * @param limit - Max number of attempts allowed
 * @param windowMs - Time window in milliseconds (e.g., 15 * 60 * 1000 for 15 mins)
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
    const now = new Date();

    // Find existing rate limit record
    const record = await prisma.rateLimit.findUnique({
        where: { key },
    });

    // If no record, create one and allow
    if (!record) {
        await prisma.rateLimit.create({
            data: { key, count: 1, lastReset: now },
        });
        return { success: true, remaining: limit - 1 };
    }

    const msSinceReset = now.getTime() - record.lastReset.getTime();

    // If the time window has passed, reset the counter
    if (msSinceReset > windowMs) {
        await prisma.rateLimit.update({
            where: { key },
            data: { count: 1, lastReset: now },
        });
        return { success: true, remaining: limit - 1 };
    }

    // If over the limit, block the request
    if (record.count >= limit) {
        return { success: false, remaining: 0 };
    }

    // Otherwise, increment the counter
    await prisma.rateLimit.update({
        where: { key },
        data: { count: record.count + 1 },
    });

    return { success: true, remaining: limit - (record.count + 1) };
}
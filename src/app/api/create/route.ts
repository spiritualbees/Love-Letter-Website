import { NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";

export async function POST() {
  try {
    await redis.incr(REDIS_KEYS.LETTERS_CREATED);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("create count error", e);
    return NextResponse.json(
      { success: false, error: "Failed to record" },
      { status: 500 }
    );
  }
}

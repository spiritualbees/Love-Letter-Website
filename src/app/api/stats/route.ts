import { NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";

export async function GET() {
  try {
    const [lettersCreated, lettersOpened, yesClicks] = await Promise.all([
      redis.get<number>(REDIS_KEYS.LETTERS_CREATED),
      redis.get<number>(REDIS_KEYS.LETTERS_OPENED),
      redis.get<number>(REDIS_KEYS.YES_CLICKS),
    ]);
    return NextResponse.json({
      letters_created: Number(lettersCreated ?? 0),
      letters_opened: Number(lettersOpened ?? 0),
      yes_clicks: Number(yesClicks ?? 0),
    });
  } catch (e) {
    console.error("stats error", e);
    return NextResponse.json(
      { letters_created: 0, letters_opened: 0, yes_clicks: 0 },
      { status: 200 }
    );
  }
}

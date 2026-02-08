import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export type CheckStatusResponse =
  | { replied: true; answer: "yes" | "no" }
  | { replied: false };

const REPLY_KEY_PREFIX = "reply:";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing id query parameter" },
        { status: 400 }
      );
    }

    const key = `${REPLY_KEY_PREFIX}${id}`;
    const value = await redis.get<string>(key);

    if (value === null || value === undefined) {
      const res: CheckStatusResponse = { replied: false };
      return NextResponse.json(res);
    }

    const answer = value === "yes" || value === "no" ? value : "no";
    const res: CheckStatusResponse = { replied: true, answer };
    return NextResponse.json(res);
  } catch (e) {
    console.error("check status error", e);
    return NextResponse.json(
      { replied: false },
      { status: 200 }
    );
  }
}

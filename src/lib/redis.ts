import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export const REDIS_KEYS = {
  LETTERS_CREATED: "val_letters_created",
  LETTERS_OPENED: "val_letters_opened",
  YES_CLICKS: "val_yes_clicks",
} as const;

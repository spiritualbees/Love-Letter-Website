import LZString from "lz-string";

export type LetterData = {
  to: string;
  from: string;
  message: string;
  theme: string;
  themeColor?: string; // alias for theme (premium letter)
  senderEmail: string;
  musicId?: string; // YouTube video ID for background music
};

export function encodeLetter(data: LetterData): string {
  const json = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeLetter(encoded: string): LetterData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const data = JSON.parse(json) as LetterData;
    if (
      typeof data.to !== "string" ||
      typeof data.from !== "string" ||
      typeof data.message !== "string" ||
      typeof data.senderEmail !== "string"
    ) {
      return null;
    }
    if (typeof data.theme !== "string" && typeof data.themeColor !== "string") {
      data.theme = "pink";
    }
    if (data.themeColor && !data.theme) data.theme = data.themeColor;
    return data;
  } catch {
    return null;
  }
}

/** Extract YouTube video ID from various URL formats */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

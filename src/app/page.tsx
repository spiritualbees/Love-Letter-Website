"use client";

import { useState, useEffect } from "react";
import { encodeLetter, extractYoutubeVideoId, type LetterData } from "@/lib/utils";
import { Heart } from "lucide-react";

const THEMES = [
  { value: "red", label: "Red" },
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
] as const;

export default function CreatorPage() {
  const [stats, setStats] = useState<number | null>(null);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<"red" | "pink" | "purple">("pink");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (!cancelled && typeof data.letters_created === "number") {
          setStats(data.letters_created);
        }
      } catch {
        if (!cancelled) setStats(0);
      }
    }
    fetchStats();
    const t = setInterval(fetchStats, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLink(null);

    fetch("/api/create", { method: "POST" }).catch(() => {});

    const musicId = extractYoutubeVideoId(youtubeUrl) ?? undefined;
    const data: LetterData = {
      to: to.trim(),
      from: from.trim(),
      message: message.trim(),
      theme,
      themeColor: theme,
      senderEmail: senderEmail.trim(),
      ...(musicId && { musicId }),
    };
    const encoded = encodeLetter(data);
    const base =
      typeof window !== "undefined" ? window.location.origin : "";
    setLink(`${base}/open?d=${encoded}`);
    setLoading(false);
  }

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function createAnother() {
    setLink(null);
    setTo("");
    setFrom("");
    setSenderEmail("");
    setMessage("");
    setTheme("pink");
    setYoutubeUrl("");
  }

  return (
    <main className="flex-1 w-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex flex-col items-center p-4 sm:p-6 py-8 sm:py-10">
      <section className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 mb-2">
          Send a Valentine.
        </h1>
        <p className="text-sm sm:text-base text-rose-600">
          {stats !== null ? (
            <>💌 {stats} Letters Sent Already!</>
          ) : (
            "💌 Loading..."
          )}
        </p>
      </section>

      {link ? (
        <div className="w-full max-w-lg rounded-3xl bg-white/90 shadow-xl shadow-rose-200/50 p-6 sm:p-8 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-rose-800 mb-2">
            Your link is ready
          </h2>
          <p className="text-sm text-rose-600 mb-4">
            Share this link with your valentine.
          </p>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 sm:p-4 mb-6 break-all text-left text-rose-800 text-xs sm:text-sm overflow-x-auto">
            {link}
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 px-6 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={createAnother}
            className="w-full mt-3 rounded-2xl border-2 border-rose-300 text-rose-700 font-medium py-3 px-6 hover:bg-rose-50 transition-all"
          >
            Create Another Letter
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-3xl bg-white/90 shadow-xl shadow-rose-200/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-5 sm:p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Create your letter</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                To
              </label>
              <input
                type="text"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipient's name"
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-base text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                From
              </label>
              <input
                type="text"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-base text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                Your email <span className="text-rose-500">(to get their reply)</span>
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-base text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                Paste a YouTube Link <span className="text-rose-500">(Optional – for background music)</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-base text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your love letter..."
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-base text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none resize-none"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-rose-800 mb-2">
                Theme
              </span>
              <div className="flex gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`flex-1 rounded-2xl py-3 text-white font-medium transition ${
                      theme === t.value
                        ? t.value === "red"
                          ? "bg-rose-500 ring-2 ring-offset-2 ring-rose-400"
                          : t.value === "pink"
                            ? "bg-pink-500 ring-2 ring-offset-2 ring-pink-400"
                            : "bg-purple-500 ring-2 ring-offset-2 ring-purple-400"
                        : t.value === "red"
                          ? "bg-rose-400 opacity-80 hover:opacity-100"
                          : t.value === "pink"
                            ? "bg-pink-400 opacity-80 hover:opacity-100"
                            : "bg-purple-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              {loading ? "Creating…" : "Generate Link"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

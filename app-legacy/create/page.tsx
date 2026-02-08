"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabaseClient";

const THEMES = [
  { value: "red", label: "Red", class: "bg-rose-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
] as const;

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CreatePage() {
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [themeColor, setThemeColor] = useState<"red" | "pink" | "purple">("pink");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const slug = slugify(recipient) || "valentine";
    const id = nanoid(6);
    const fullId = `${slug}-${id}`;

    const { error: insertError } = await supabase.from("letters").insert({
      id: fullId,
      recipient_name: recipient.trim(),
      sender_name: sender.trim(),
      message: message.trim(),
      theme_color: themeColor,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (typeof window !== "undefined") {
      const base = window.location.origin;
      setGeneratedLink(`${base}/invitation/${fullId}`);
    } else {
      setGeneratedLink(`/invitation/${fullId}`);
    }
  }

  function copyLink() {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (generatedLink) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/90 shadow-xl shadow-rose-200/50 p-8 text-center">
          <h2 className="text-xl font-semibold text-rose-800 mb-2">
            Your link is ready
          </h2>
          <p className="text-sm text-rose-600 mb-4">
            Share this link with your valentine.
          </p>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 mb-6 break-all text-left text-rose-800 text-sm">
            {generatedLink}
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 px-6 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 transition-all active:scale-[0.98]"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white/90 shadow-xl shadow-rose-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-6 text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">
            Create a Valentine&apos;s Letter
          </h1>
          <p className="text-white/90 text-sm mt-1">
            Fill in the form and get a shareable link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-rose-800 mb-1.5"
            >
              To
            </label>
            <input
              id="recipient"
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient's name"
              className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
            />
          </div>

          <div>
            <label
              htmlFor="sender"
              className="block text-sm font-medium text-rose-800 mb-1.5"
            >
              From
            </label>
            <input
              id="sender"
              type="text"
              required
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-rose-800 mb-1.5"
            >
              Your letter
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your love letter here..."
              className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 text-rose-900 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition resize-none"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-rose-800 mb-2">
              Theme color
            </span>
            <div className="flex gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setThemeColor(theme.value)}
                  className={`flex-1 rounded-2xl py-3 text-white font-medium transition shadow-md ${
                    themeColor === theme.value
                      ? theme.class + " ring-2 ring-offset-2 ring-rose-400 scale-[1.02]"
                      : theme.class + " opacity-80 hover:opacity-100"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 px-6 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {loading ? "Creating…" : "Create Link"}
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { decodeLetter, type LetterData } from "@/lib/utils";
import { useTypewriter } from "@/hooks/useTypewriter";
import { YouTubePlayer, type YouTubePlayerHandle } from "./YouTubePlayer";
import { Heart } from "lucide-react";

const THEME_STYLES: Record<string, { gradient: string; card: string; accent: string }> = {
  red: {
    gradient: "from-rose-100 via-red-50 to-rose-200",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-red-50",
    accent: "text-rose-700",
  },
  pink: {
    gradient: "from-pink-100 via-rose-50 to-pink-200",
    card: "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50",
    accent: "text-pink-700",
  },
  purple: {
    gradient: "from-purple-100 via-violet-50 to-purple-200",
    card: "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50",
    accent: "text-purple-700",
  },
};

const PAPER_STYLE = {
  boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.15)",
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.95) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.95) 1px, transparent 1px),
    linear-gradient(rgba(240,230,220,0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240,230,220,0.4) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px, 20px 20px, 4px 4px, 4px 4px",
} as const;

function OpenContent() {
  const searchParams = useSearchParams();
  const [letter, setLetter] = useState<LetterData | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [step, setStep] = useState<"envelope" | "letter" | "success">("envelope");
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noHasRun, setNoHasRun] = useState(false);

  const encoded = searchParams.get("d");

  useEffect(() => {
    if (!encoded) {
      setInvalid(true);
      return;
    }
    const data = decodeLetter(encoded);
    if (data) setLetter(data);
    else setInvalid(true);
  }, [encoded]);

  const [flapOpen, setFlapOpen] = useState(false);
  const youtubePlayerRef = useRef<YouTubePlayerHandle>(null);
  const userRequestedPlayRef = useRef(false);

  const handleOpenEnvelope = useCallback(() => {
    setFlapOpen(true);
    userRequestedPlayRef.current = true;
    youtubePlayerRef.current?.play();
    fetch("/api/opened", { method: "POST" }).catch(() => {});
    setTimeout(() => {
      setStep("letter");
    }, 600);
  }, []);

  const handleYes = useCallback(() => setAnswer("yes"), []);
  const handleNoHover = useCallback(() => {
    if (typeof window === "undefined") return;
    setNoHasRun(true);
    const padding = 60;
    const maxX = window.innerWidth - 180;
    const maxY = window.innerHeight - 120;
    setNoPos({
      x: Math.random() * (maxX - padding) - (maxX - padding) / 2,
      y: Math.random() * (maxY - padding) - (maxY - padding) / 2,
    });
  }, []);

  const handleSubmitReply = useCallback(async () => {
    if (!letter) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answer ?? "no",
          message: replyMessage.trim(),
          senderEmail: letter.senderEmail,
          recipientName: letter.to,
        }),
      });
      if (res.ok) {
        setStep("success");
        if (answer === "yes") {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#ec4899", "#f43f5e", "#a855f7", "#f472b6"],
          });
        }
      }
    } finally {
      setSubmitting(false);
    }
  }, [letter, answer, replyMessage]);

  if (invalid) {
    return (
      <main className="flex-1 w-full min-h-screen bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center p-4 sm:p-6">
        <p className="text-base sm:text-lg text-rose-800 font-medium">Invalid or missing letter link.</p>
        <Link href="/" className="mt-6 text-sm text-rose-600 underline hover:text-rose-700">Make Your Own</Link>
      </main>
    );
  }

  if (!letter) {
    return (
      <main className="flex-1 w-full min-h-screen bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center p-4 sm:p-6">
        <p className="text-rose-600">Loading...</p>
      </main>
    );
  }

  const theme = THEME_STYLES[letter.theme] ?? THEME_STYLES.pink;
  const musicId = letter.musicId ?? undefined;

  return (
    <>
      {musicId && (
        <YouTubePlayer
          ref={youtubePlayerRef}
          videoId={musicId}
          userRequestedPlayRef={userRequestedPlayRef}
        />
      )}

      <main
        className={`flex-1 w-full min-h-screen bg-gradient-to-br ${theme.gradient} flex flex-col items-center overflow-y-auto overflow-x-hidden`}
      >
        <div className="w-full flex-1 flex flex-col items-center px-4 mx-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Floating hearts background */}
        {step !== "envelope" && (
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
            {["💕", "💗", "💖", "🌸", "💕", "💗"].map((emoji, i) => (
              <span
                key={i}
                className="absolute text-2xl sm:text-3xl opacity-20 animate-float-heart"
                style={{
                  left: `${10 + (i * 15) % 80}%`,
                  top: `${5 + (i * 11) % 85}%`,
                  animationDelay: `${i * 0.8}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

          <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 min-h-0">
          <AnimatePresence mode="wait">
            {step === "envelope" && (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer select-none"
                onClick={handleOpenEnvelope}
              >
                <motion.div
                  className="relative w-64 h-40 mx-auto"
                  style={{ perspective: "400px" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-400 to-rose-600 rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
                    <Heart className="w-14 h-14 text-white/90" />
                  </div>
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-20 bg-rose-500/90 rounded-t-lg border-x-8 border-t-8 border-rose-600/80"
                    style={{
                      transformOrigin: "top center",
                      transformStyle: "preserve-3d",
                    }}
                    initial={false}
                    animate={{ rotateX: flapOpen ? -160 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  <p className="absolute -bottom-8 left-0 right-0 text-center text-rose-700 font-medium font-sans text-sm">
                    Click to open
                  </p>
                </motion.div>
              </motion.div>
            )}

            {step === "letter" && (
              <LetterView
                letter={letter}
                theme={theme}
                paperStyle={PAPER_STYLE}
                musicId={musicId}
                onPlayMusic={() => youtubePlayerRef.current?.play()}
                onYes={handleYes}
                onNoHover={handleNoHover}
                noPos={noPos}
                noHasRun={noHasRun}
                answer={answer}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
                onSubmitReply={handleSubmitReply}
                submitting={submitting}
              />
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-xl sm:text-2xl font-bold text-rose-700 mb-2 font-sans">
                  Reply sent! 💖
                </p>
                <p className="text-sm sm:text-base text-rose-600 font-sans">
                  {letter.senderEmail
                    ? "They'll get an email with your reply."
                    : "Thanks for replying."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <p className="pt-6 pb-2 text-center relative z-10 shrink-0">
          <Link
            href="/"
            className="text-sm text-rose-600 underline hover:text-rose-700 transition font-sans"
          >
            Make Your Own
          </Link>
        </p>
        </div>
      </main>
    </>
  );
}

function LetterView({
  letter,
  theme,
  paperStyle,
  musicId,
  onPlayMusic,
  onYes,
  onNoHover,
  noPos,
  noHasRun,
  answer,
  replyMessage,
  setReplyMessage,
  onSubmitReply,
  submitting,
}: {
  letter: LetterData;
  theme: { gradient: string; card: string; accent: string };
  paperStyle: { boxShadow: string; backgroundImage: string; backgroundSize: string };
  musicId?: string;
  onPlayMusic?: () => void;
  onYes: () => void;
  onNoHover: () => void;
  noPos: { x: number; y: number };
  noHasRun: boolean;
  answer: "yes" | "no" | null;
  replyMessage: string;
  setReplyMessage: (s: string) => void;
  onSubmitReply: () => void;
  submitting: boolean;
}) {
  const [displayedText, isTypingComplete] = useTypewriter(letter.message, 40);

  return (
    <motion.div
      key="letter"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-4"
    >
      {musicId && onPlayMusic && (
        <div className="flex justify-center mb-3">
          <button
            type="button"
            onClick={onPlayMusic}
            className="font-sans text-sm text-rose-600 hover:text-rose-700 bg-white/80 hover:bg-rose-50/80 rounded-full px-4 py-2 border border-rose-200 transition"
          >
            🎵 Play Music
          </button>
        </div>
      )}
      <div
        className={`relative rounded-2xl border-2 ${theme.card} overflow-hidden p-6 sm:p-8`}
        style={{
          ...paperStyle,
        }}
      >
        {/* Wax seal / stamp */}
        <span
          className="absolute top-3 right-3 text-2xl sm:text-3xl select-none"
          aria-hidden
        >
          💌
        </span>

        <p className={`text-xs sm:text-sm font-medium ${theme.accent} mb-1 font-sans`}>
          To: {letter.to}
        </p>
        <div className="mt-4 min-h-[1.5em]">
          <p className="font-handwriting text-lg sm:text-xl md:text-2xl text-gray-800 leading-loose whitespace-pre-wrap break-words">
            {displayedText}
            {!isTypingComplete && (
              <span className="inline-block text-rose-500 ml-0.5 animate-pulse font-sans" style={{ animationDuration: "0.6s" }}>
                |
              </span>
            )}
          </p>
        </div>
        <p className={`mt-6 sm:mt-8 text-right text-xs sm:text-sm font-medium ${theme.accent} font-sans`}>
          From: {letter.from}
        </p>
      </div>

      <AnimatePresence>
        {isTypingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8 sm:mt-10 text-center"
          >
            <p className="text-lg sm:text-xl font-semibold text-rose-800 mb-6 font-sans">
              Will you be my Valentine?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={onYes}
                className="font-sans rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 px-8 shadow-lg hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-2"
              >
                YES <span>💖</span>
              </button>
              <motion.button
                type="button"
                onMouseEnter={onNoHover}
                className="font-sans rounded-2xl bg-slate-200 text-slate-600 font-semibold py-3 px-8 hover:bg-slate-300 transition-colors flex items-center gap-2 select-none"
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={noHasRun ? { pointerEvents: "none" } : undefined}
                tabIndex={noHasRun ? -1 : 0}
                aria-label="No"
              >
                NO <span>💔</span>
              </motion.button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-rose-800 mb-2 text-left font-sans">
                Write a reply...
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={3}
                placeholder="Your message back to them..."
                className="font-sans w-full rounded-2xl border-2 border-rose-200 bg-white/80 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-rose-400 focus:outline-none resize-none"
              />
            </div>
            <button
              type="button"
              onClick={onSubmitReply}
              disabled={submitting}
              className="font-sans rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 px-8 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
            >
              <Heart className="w-4 h-4" />
              {submitting ? "Sending…" : "Send reply"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OpenPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 min-h-screen bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center p-4">
          <p className="text-rose-600">Loading...</p>
        </main>
      }
    >
      <OpenContent />
    </Suspense>
  );
}

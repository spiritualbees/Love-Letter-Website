"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";

export default function ValentineActions() {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noMoved, setNoMoved] = useState(false);

  const handleYes = useCallback(() => {
    setAccepted(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f43f5e", "#a855f7", "#f472b6"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.2 },
        colors: ["#ec4899", "#f43f5e"],
      });
    }, 200);
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.8 },
        colors: ["#ec4899", "#f43f5e"],
      });
    }, 400);
  }, []);

  const handleNo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (noMoved) {
        alert("Try again 💕");
        return;
      }
      if (typeof window === "undefined") return;
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const padding = 24;
      const maxX = window.innerWidth - rect.width - padding * 2;
      const maxY = window.innerHeight - rect.height - padding * 2;
      const x = Math.random() * maxX + padding - rect.left;
      const y = Math.random() * maxY + padding - rect.top;
      setNoPosition({ x, y });
      setNoMoved(true);
    },
    [noMoved]
  );

  return (
    <div className="mt-10 text-center">
      {accepted ? (
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse">
          Yay! Date accepted! 💖
        </p>
      ) : (
        <>
          <p className="text-xl font-semibold text-rose-800 mb-6">
            Will you be my Valentine?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleYes}
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 px-8 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 transition-all active:scale-95"
            >
              YES
            </button>
            <button
              type="button"
              onClick={handleNo}
              className="rounded-2xl bg-slate-200 text-slate-600 font-semibold py-3 px-8 hover:bg-slate-300 transition-all active:scale-95"
              style={
                noMoved
                  ? {
                      transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                      transition: "transform 0.25s ease-out",
                    }
                  : undefined
              }
            >
              NO
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Reveals text character-by-character with a blinking cursor.
 * @param text Full text to reveal
 * @param speedMs Delay per character (default 40)
 * @returns [displayedText, isComplete]
 */
export function useTypewriter(text: string, speedMs: number = 40): [string, boolean] {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    setDisplayedLength(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (!text || displayedLength >= text.length) {
      if (text && displayedLength >= text.length) setIsComplete(true);
      return;
    }
    const t = setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= textRef.current.length) setIsComplete(true);
        return next;
      });
    }, speedMs);
    return () => clearTimeout(t);
  }, [text, displayedLength, speedMs]);

  const displayedText = text.slice(0, displayedLength);
  return [displayedText, isComplete];
}

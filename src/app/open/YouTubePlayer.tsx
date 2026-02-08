"use client";

import { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import YouTube, { type YouTubePlayer as YTPlayerType } from "react-youtube";

export type YouTubePlayerHandle = {
  play: () => void;
};

type YouTubePlayerProps = {
  videoId: string;
  onReady?: () => void;
  userRequestedPlayRef?: React.MutableRefObject<boolean>;
};

const opts = {
  height: "1",
  width: "1",
  playerVars: {
    autoplay: 0,
    mute: 1,
    loop: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    modestbranding: 1,
    playsinline: 1,
  },
};

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  function YouTubePlayer({ videoId, onReady, userRequestedPlayRef }, ref) {
    const playerRef = useRef<YTPlayerType | null>(null);

    const play = useCallback(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        p.unMute();
        p.playVideo();
        onReady?.();
      } catch {
        // ignore
      }
    }, [onReady]);

    useImperativeHandle(ref, () => ({ play }), [play]);

    return (
      <div className="hidden" aria-hidden>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            playerRef.current = e.target;
            if (userRequestedPlayRef?.current) play();
          }}
        />
      </div>
    );
  }
);

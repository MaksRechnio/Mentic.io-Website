"use client";

import { useEffect, useRef } from "react";

const ORIGINAL_TITLE = "mentic";
const AWAY_TITLE = "We miss you...🥺🥺";

export default function TabAttention() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;

    // Grab the actual favicon URL that Next.js generated (could be hashed path)
    const existingLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    const originalHref = existingLink?.href || "/favicon.png";

    const faviconImg = new Image();
    faviconImg.crossOrigin = "anonymous";

    let imageReady = false;
    faviconImg.onload = () => { imageReady = true; };
    faviconImg.src = originalHref;

    const getLinkEl = () => {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      return link;
    };

    let angle = 0;
    const SPEED = 0.05;

    const drawFavicon = () => {
      if (!imageReady) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      angle = (angle + SPEED) % (Math.PI * 2);
      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(angle);
      ctx.translate(-16, -16);
      ctx.drawImage(faviconImg, 0, 0, 32, 32);
      ctx.restore();

      try {
        getLinkEl().href = canvas.toDataURL("image/png");
      } catch (e) { /* CORS or security error — silent */ }
    };

    const startAnimation = () => {
      angle = 0;
      // setInterval runs in background tabs (throttled to ~1s by browsers, but still works)
      intervalRef.current = setInterval(drawFavicon, 50);
    };

    const stopAnimation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Restore original favicon
      getLinkEl().href = originalHref;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startAnimation();
        timeoutRef.current = setTimeout(() => {
          document.title = AWAY_TITLE;
        }, 3000);
      } else {
        document.title = ORIGINAL_TITLE;
        stopAnimation();
      }
    };

    document.title = ORIGINAL_TITLE;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
      document.title = ORIGINAL_TITLE;
    };
  }, []);

  return null;
}

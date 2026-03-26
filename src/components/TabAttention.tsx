"use client";

import { useEffect, useRef } from "react";

const ORIGINAL_TITLE = "mentic";
const AWAY_TITLE = "We Miss You...";

export default function TabAttention() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;

    const originalFavicon = "/favicon.png";
    const faviconImg = new Image();
    faviconImg.src = originalFavicon;

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
    const SPEED = 0.05; // radians per frame (~30fps → ~1.5 rad/s)

    const drawFavicon = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !faviconImg.complete) return;

      angle = (angle + SPEED) % (Math.PI * 2);
      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(angle);
      ctx.translate(-16, -16);
      ctx.drawImage(faviconImg, 0, 0, 32, 32);
      ctx.restore();

      getLinkEl().href = canvas.toDataURL("image/png");
    };

    const startAnimation = () => {
      angle = 0;
      // Use setInterval instead of rAF — setInterval runs even when tab is hidden
      intervalRef.current = setInterval(drawFavicon, 33); // ~30fps
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
      getLinkEl().href = originalFavicon;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startAnimation();
        // Wait 3 seconds before changing title
        timeoutRef.current = setTimeout(() => {
          document.title = AWAY_TITLE;
        }, 3000);
      } else {
        document.title = ORIGINAL_TITLE;
        stopAnimation();
      }
    };

    // Set initial title
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

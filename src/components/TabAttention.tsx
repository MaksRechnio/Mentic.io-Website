"use client";

import { useEffect, useRef } from "react";

const ORIGINAL_TITLE = "mentic";
const AWAY_TITLE = "We Miss You...";

export default function TabAttention() {
  const rafRef = useRef<number | null>(null);
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

    const drawFavicon = (rotation: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !faviconImg.complete) return;

      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(rotation);
      ctx.translate(-16, -16);
      ctx.drawImage(faviconImg, 0, 0, 32, 32);
      ctx.restore();

      getLinkEl().href = canvas.toDataURL("image/png");
    };

    let startTime = 0;
    const SPEED = 1.5; // radians per second — smooth, steady spin

    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const angle = (elapsed * SPEED) % (Math.PI * 2);
      drawFavicon(angle);
      rafRef.current = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      startTime = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
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

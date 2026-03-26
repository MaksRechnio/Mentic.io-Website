"use client";

import { useEffect, useRef } from "react";

const ORIGINAL_TITLE = "Mentic — The Autonomous Advertising Agent";
const AWAY_TITLE = "We Miss You...";

export default function TabAttention() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    // Create offscreen canvas for animated favicon
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    canvasRef.current = canvas;

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
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-16, -16);
      ctx.drawImage(faviconImg, 0, 0, 32, 32);
      ctx.restore();

      getLinkEl().href = canvas.toDataURL("image/png");
    };

    const startAnimation = () => {
      frameRef.current = 0;
      intervalRef.current = setInterval(() => {
        frameRef.current = (frameRef.current + 8) % 360;
        drawFavicon(frameRef.current);
      }, 100);
    };

    const stopAnimation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Restore original favicon
      getLinkEl().href = originalFavicon;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = AWAY_TITLE;
        startAnimation();
      } else {
        document.title = ORIGINAL_TITLE;
        stopAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
      document.title = ORIGINAL_TITLE;
    };
  }, []);

  return null;
}

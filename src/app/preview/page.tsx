"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import SignupModal from "@/components/SignupModal";

gsap.registerPlugin(ScrollTrigger);

/* ── Figma design frame = 1491 × 967 px ── */
const X = (x: number) => `${(x / 1491) * 100}%`;
const Y = (y: number) => `${(y / 967) * 100}%`;
const W = (w: number) => `${(w / 1491) * 100}%`;
const H = (h: number) => `${(h / 967) * 100}%`;
const FS = (px: number) => `${(px / 1491) * 100}vw`;

const TOTAL_FRAMES = 30;

export default function PreviewLanding() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  /* ── Loading screen + hero entrance (time-based, on page load) ── */
  useEffect(() => {
    if (!viewportRef.current) return;
    const vp = viewportRef.current;
    const loader = loaderRef.current;

    gsap.set(["#hero-card", "#hero-icon", "#hero-alpha", "#hero-headline", "#hero-logo", "#hero-btn"].map(s => vp.querySelector(s)), { opacity: 0 });

    const intro = gsap.timeline({ delay: 0.3 });

    if (loader) {
      intro.to(loader, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
      intro.set(loader, { display: "none" });
    }

    intro.fromTo(vp.querySelector("#hero-card"),
      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      loader ? "-=0.2" : 0);
    intro.fromTo(vp.querySelector("#hero-icon"),
      { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, "-=0.4");
    intro.fromTo(vp.querySelector("#hero-alpha"),
      { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
    intro.fromTo(vp.querySelector("#hero-logo"),
      { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
    intro.fromTo(vp.querySelector("#hero-headline"),
      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35");
    intro.fromTo(vp.querySelector("#hero-btn"),
      { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, "-=0.2");

    return () => { intro.kill(); };
  }, []);

  /* ── Lenis smooth scroll (like itsoffbrand.com) ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  /* ── Master scroll-scrubbed timeline ── */
  useEffect(() => {
    if (!wrapperRef.current || !viewportRef.current) return;

    const ctx = gsap.context(() => {
      const vp = viewportRef.current!;

      /*
       * 30-frame layout. Elements appear in tight clusters (tiny scroll).
       * Transitions between sections take many frames (big scroll).
       *
       *   f(1)        Hero (on-load animated)
       *   f(1.5)–f(5) Transition → Pain
       *   f(5)        Pain elements appear
       *   f(6)–f(10)  Transition → Calc
       *   f(10)–f(11) Calc elements appear
       *   f(12)–f(17) Transition → Solution
       *   f(17)       Solution elements appear
       *   f(18)–f(21) Transition → NO
       *   f(21)–f(22) NO elements appear
       *   f(23)–f(25) Transition → How
       *   f(25)       How elements appear
       *   f(26)–f(28) Transition → Value
       *   f(28)       Value elements appear
       *   f(29)–f(30) Transition → CTA
       *   f(30)       CTA elements appear
       */

      const f = (n: number) => (n - 1) / (TOTAL_FRAMES - 1);
      const d1 = 1 / (TOTAL_FRAMES - 1);
      const ease = "power2.out";

      /* Element reveals: FAST (tiny scroll distance) */
      const ds = d1 * 0.4;
      const stg = d1 * 0.06;

      /* Snap stops at each section */
      const sectionStops = [
        f(1), f(5), f(10), f(17), f(21), f(25), f(28), f(30),
      ];

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          snap: {
            snapTo: sectionStops,
            duration: { min: 0.3, max: 0.7 },
            delay: 0.1,
            ease: "power1.inOut",
            directional: true,
          },
        },
      });

      /* ── DOM refs ── */
      const bg = vp.querySelector("#bg") as HTMLElement;
      const heroCard = vp.querySelector("#hero-card") as HTMLElement;
      const heroIcon = vp.querySelector("#hero-icon") as HTMLElement;
      const heroAlpha = vp.querySelector("#hero-alpha") as HTMLElement;
      const heroHeadline = vp.querySelector("#hero-headline") as HTMLElement;
      const heroLogo = vp.querySelector("#hero-logo") as HTMLElement;
      const heroBtn = vp.querySelector("#hero-btn") as HTMLElement;

      const iconTeal = vp.querySelector("#icon-teal") as HTMLElement;
      const glassCard = vp.querySelector("#glass-card") as HTMLElement;
      const glassStrip1 = vp.querySelector("#glass-strip-1") as HTMLElement;
      const glassStrip2 = vp.querySelector("#glass-strip-2") as HTMLElement;

      const painBlob = vp.querySelector("#pain-blob") as HTMLElement;
      const painText1 = vp.querySelector("#pain-text-1") as HTMLElement;
      const painText2 = vp.querySelector("#pain-text-2") as HTMLElement;
      const painText3 = vp.querySelector("#pain-text-3") as HTMLElement;

      const calcPanel = vp.querySelector("#calc-panel") as HTMLElement;
      const calcHeading = vp.querySelector("#calc-heading") as HTMLElement;
      const calcAmount = vp.querySelector("#calc-amount") as HTMLElement;
      const calcFifty = vp.querySelector("#calc-fifty") as HTMLElement;
      const calcFees = vp.querySelector("#calc-fees") as HTMLElement;
      const calcNotads = vp.querySelector("#calc-notads") as HTMLElement;

      const blobCoral = vp.querySelector("#blob-coral") as HTMLElement;
      const blobMint = vp.querySelector("#blob-mint") as HTMLElement;

      const solText1 = vp.querySelector("#sol-text-1") as HTMLElement;
      const solText2 = vp.querySelector("#sol-text-2") as HTMLElement;
      const solText3 = vp.querySelector("#sol-text-3") as HTMLElement;

      const noText = vp.querySelector("#no-text") as HTMLElement;
      const noItem1 = vp.querySelector("#no-item-1") as HTMLElement;
      const noItem2 = vp.querySelector("#no-item-2") as HTMLElement;
      const noItem3 = vp.querySelector("#no-item-3") as HTMLElement;
      const noItem4 = vp.querySelector("#no-item-4") as HTMLElement;
      const noDot = vp.querySelector("#no-dot") as HTMLElement;

      const howStep1 = vp.querySelector("#how-step-1") as HTMLElement;
      const howStep2 = vp.querySelector("#how-step-2") as HTMLElement;
      const howStep3 = vp.querySelector("#how-step-3") as HTMLElement;
      const howMentic = vp.querySelector("#how-mentic") as HTMLElement;
      const howRest = vp.querySelector("#how-rest") as HTMLElement;

      const valOne = vp.querySelector("#val-one") as HTMLElement;
      const valEvery = vp.querySelector("#val-every") as HTMLElement;
      const valAll = vp.querySelector("#val-all") as HTMLElement;

      const ctaIcon = vp.querySelector("#cta-icon") as HTMLElement;
      const ctaSign = vp.querySelector("#cta-sign") as HTMLElement;
      const ctaUp = vp.querySelector("#cta-up") as HTMLElement;
      const ctaNow = vp.querySelector("#cta-now") as HTMLElement;
      const ctaAlpha = vp.querySelector("#cta-alpha") as HTMLElement;
      const ctaButton = vp.querySelector("#cta-button") as HTMLElement;

      const heroLayer = vp.querySelector("#hero-layer") as HTMLElement;
      const painLayer = vp.querySelector("#pain-layer") as HTMLElement;
      const calcLayer = vp.querySelector("#calc-layer") as HTMLElement;
      const solLayer = vp.querySelector("#sol-layer") as HTMLElement;
      const noLayer = vp.querySelector("#no-layer") as HTMLElement;
      const howLayer = vp.querySelector("#how-layer") as HTMLElement;
      const valLayer = vp.querySelector("#val-layer") as HTMLElement;
      const ctaLayer = vp.querySelector("#cta-layer") as HTMLElement;

      /* ═══════════════════════════════════════
         TRANSITION: Hero → Pain  (f(1.5) → f(5))
         Long cross-fade over ~3.5 frames
      ═══════════════════════════════════════ */
      master.to(heroAlpha, { opacity: 0, duration: d1 * 2, ease }, f(1.5));
      master.to(heroHeadline, { opacity: 0, duration: d1 * 2, ease }, f(1.5));
      master.to(heroLogo, { opacity: 0, duration: d1 * 2, ease }, f(1.5));
      master.to(heroBtn, { opacity: 0, duration: d1 * 2, ease }, f(1.5));
      master.to(heroCard, {
        backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "none",
        backdropFilter: "blur(12px)", duration: d1 * 2.5, ease,
      }, f(2));
      master.to(heroIcon, { opacity: 0, duration: d1 * 1.5, ease }, f(2));
      master.set(heroLayer, { opacity: 0 }, f(4.5));
      master.to(painLayer, { opacity: 1, duration: d1 * 2.5, ease }, f(2.5));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(2.5));
      master.to(glassCard, { opacity: 1, duration: d1 * 2, ease }, f(2.5));

      /* ═══════════════════════════════════════
         SECTION: Pain  (at f(5))
         Tight cluster — tiny scroll to reveal all
      ═══════════════════════════════════════ */
      master.fromTo(painText1, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(5));
      master.fromTo(painBlob, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: ds, ease }, f(5));
      master.fromTo(glassStrip1, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(5) + stg);
      master.fromTo(painText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(5) + stg * 2);
      master.to(painBlob, { width: W(1051), height: H(666), left: X(220), top: Y(813), duration: ds, ease }, f(5) + stg * 2);
      master.fromTo(painText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(5) + stg * 3);
      master.fromTo(glassStrip2, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(5) + stg * 3);
      master.to(painBlob, { width: W(1232), height: H(848), left: X(130), top: Y(908), duration: ds, ease }, f(5) + stg * 3);

      /* ═══════════════════════════════════════
         TRANSITION: Pain → Calc  (f(6) → f(10))
         bg: #ffe5e5 → #ff6b5c
      ═══════════════════════════════════════ */
      master.to(painLayer, { opacity: 0, duration: d1 * 2.5, ease }, f(6));
      master.to(glassStrip1, { opacity: 0, duration: d1 * 2, ease }, f(6));
      master.to(glassStrip2, { opacity: 0, duration: d1 * 2, ease }, f(6));
      master.to(bg, { backgroundColor: "#ff6b5c", duration: d1 * 3.5, ease }, f(6));
      master.to(calcLayer, { opacity: 1, duration: d1 * 2.5, ease }, f(7.5));

      /* ═══════════════════════════════════════
         SECTION: Calc  (at f(10)–f(11))
      ═══════════════════════════════════════ */
      master.fromTo(calcPanel, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(10));
      master.fromTo(calcHeading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(10) + stg);
      master.fromTo(calcAmount, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: ds, ease }, f(10) + stg * 2);
      master.fromTo(calcFifty, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: ds, ease }, f(10) + stg * 3);
      master.fromTo(calcFees, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: ds, ease }, f(11));
      master.fromTo(calcNotads, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(11) + stg);

      /* ═══════════════════════════════════════
         TRANSITION: Calc → Solution  (f(12) → f(17))
         bg: #ff6b5c → white, blobs appear
      ═══════════════════════════════════════ */
      master.to(calcLayer, { opacity: 0, duration: d1 * 2.5, ease }, f(12));
      master.to(iconTeal, { opacity: 0, duration: d1 * 1.5, ease }, f(12));
      master.to(bg, { backgroundColor: "#ffffff", duration: d1 * 3.5, ease }, f(12));
      master.to(solLayer, { opacity: 1, duration: d1 * 2.5, ease }, f(14));
      master.fromTo(blobCoral, { opacity: 0 }, { opacity: 1, duration: d1 * 3.5, ease }, f(13));
      master.fromTo(blobMint, { opacity: 0 }, { opacity: 1, duration: d1 * 3.5, ease }, f(13));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(14.5));

      /* ═══════════════════════════════════════
         SECTION: Solution  (at f(17))
      ═══════════════════════════════════════ */
      master.fromTo(solText1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(17));
      master.fromTo(solText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(17) + stg);
      master.fromTo(solText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(17) + stg * 2);

      /* ═══════════════════════════════════════
         TRANSITION: Solution → NO  (f(18) → f(21))
      ═══════════════════════════════════════ */
      master.to(solLayer, { opacity: 0, duration: d1 * 2.5, ease }, f(18));
      master.to(noLayer, { opacity: 1, duration: d1 * 2.5, ease }, f(19));

      /* ═══════════════════════════════════════
         SECTION: NO  (at f(21)–f(22))
      ═══════════════════════════════════════ */
      master.fromTo(noText, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: ds, ease }, f(21));
      master.fromTo(noItem1, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(21) + stg);
      master.fromTo(noItem2, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(21) + stg * 2);
      master.fromTo(noItem3, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(22));
      master.fromTo(noItem4, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(22) + stg);
      master.fromTo(noDot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: ds, ease }, f(22) + stg * 2);

      /* ═══════════════════════════════════════
         TRANSITION: NO → How  (f(23) → f(25))
      ═══════════════════════════════════════ */
      master.to(noLayer, { opacity: 0, duration: d1 * 2, ease }, f(23));
      master.to(howLayer, { opacity: 1, duration: d1 * 2, ease }, f(23.5));

      /* ═══════════════════════════════════════
         SECTION: How  (at f(25))
      ═══════════════════════════════════════ */
      master.fromTo(howStep1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(25));
      master.fromTo(howStep2, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(25) + stg);
      master.fromTo(howStep3, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(25) + stg * 2);
      master.fromTo(howMentic, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: ds, ease }, f(25) + stg * 3);
      master.fromTo(howRest, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: ds, ease }, f(25) + stg * 4);

      /* ═══════════════════════════════════════
         TRANSITION: How → Value  (f(26) → f(28))
      ═══════════════════════════════════════ */
      master.to(howLayer, { opacity: 0, duration: d1 * 2, ease }, f(26));
      master.to(valLayer, { opacity: 1, duration: d1 * 2, ease }, f(26.5));

      /* ═══════════════════════════════════════
         SECTION: Value  (at f(28))
      ═══════════════════════════════════════ */
      master.fromTo(valOne, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(28));
      master.fromTo(valEvery, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(28) + stg);
      master.fromTo(valAll, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(28) + stg * 2);

      /* ═══════════════════════════════════════
         TRANSITION: Value → CTA  (f(29) → f(30))
      ═══════════════════════════════════════ */
      master.to(valLayer, { opacity: 0, duration: d1 * 1.5, ease }, f(29));
      master.to(ctaLayer, { opacity: 1, duration: d1 * 1.5, ease }, f(29));

      /* ═══════════════════════════════════════
         SECTION: CTA  (at f(30))
      ═══════════════════════════════════════ */
      master.fromTo(ctaIcon, { opacity: 0, scale: 0.3, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: ds * 2, ease }, f(30));
      master.fromTo(ctaSign, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: ds, ease }, f(30) + stg);
      master.fromTo(ctaUp, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: ds, ease }, f(30) + stg);
      master.fromTo(ctaNow, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: ds, ease }, f(30) + stg * 2);
      master.fromTo(ctaAlpha, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(30) + stg * 2);
      master.fromTo(ctaButton, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: ds, ease: "back.out(1.4)" }, f(30) + stg * 3);

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={wrapperRef} style={{ height: `${TOTAL_FRAMES * 85}vh`, position: "relative" }}>
        <div
          ref={viewportRef}
          style={{
            position: "sticky",
            top: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* ── Background ── */}
          <div id="bg" style={{ position: "absolute", inset: 0, backgroundColor: "#ffe5e5", zIndex: 0 }} />

          {/* ── Persistent teal icon (visible from frame 2 onward) ── */}
          <Image
            id="icon-teal"
            src="/images/mentic-icon-teal.png"
            alt="Mentic"
            width={65}
            height={65}
            style={{
              position: "absolute",
              top: Y(53), left: X(61),
              width: W(65), height: "auto",
              zIndex: 10, opacity: 0,
              filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
            }}
          />

          {/* ── Persistent glass card (visible from frame 2 onward) ── */}
          <div
            id="glass-card"
            style={{
              position: "absolute",
              top: Y(20), left: X(24),
              width: W(1443), height: H(919),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "17.872px",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
              zIndex: 1, opacity: 0,
            }}
          />

          {/* ── Glass strips for pain section ── */}
          <div
            id="glass-strip-1"
            style={{
              position: "absolute",
              left: X(24), top: Y(229),
              width: W(984), height: H(152),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0 12px 12px 0",
              zIndex: 2, opacity: 0,
            }}
          />
          <div
            id="glass-strip-2"
            style={{
              position: "absolute",
              left: X(24), top: Y(652),
              width: W(984), height: H(141),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0 12px 12px 0",
              zIndex: 2, opacity: 0,
            }}
          />

          {/* ── Gradient blobs (solution → CTA) ── */}
          <div
            id="blob-coral"
            className="gradient-blob gradient-blob-coral"
            style={{
              width: W(1219), height: H(1213),
              left: X(-155), top: Y(627),
              opacity: 0, zIndex: 1,
            }}
          />
          <div
            id="blob-mint"
            className="gradient-blob gradient-blob-mint"
            style={{
              width: W(1076), height: H(1072),
              left: X(1360), top: Y(1379),
              opacity: 0, zIndex: 1,
            }}
          />

          {/* ═══════════════════════════════════════
              HERO LAYER (Frame 1)
          ═══════════════════════════════════════ */}
          <div id="hero-layer" style={{ position: "absolute", inset: 0, zIndex: 5 }}>
            {/* Coral card */}
            <div
              id="hero-card"
              style={{
                position: "absolute",
                top: Y(24), left: X(26),
                width: W(1443), height: H(919),
                background: "#ff6b5c",
                borderRadius: "17.872px",
                boxShadow: "-1.787px -1.787px 23.413px rgba(0,0,0,0.25), 2.681px 2.681px 19.302px rgba(0,0,0,0.25)",
              }}
            />
            {/* Mint icon */}
            <Image
              id="hero-icon"
              src="/images/mentic-icon-mint.png"
              alt="Mentic"
              width={65}
              height={65}
              style={{
                position: "absolute",
                top: Y(51), left: X(61),
                width: W(65), height: "auto",
                zIndex: 2,
                filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
              }}
            />
            {/* "Alpha release coming soon!" */}
            <div
              id="hero-alpha"
              style={{
                position: "absolute",
                top: Y(69), left: X(1083),
                fontSize: FS(25), fontWeight: 700,
                letterSpacing: "0.75px",
                zIndex: 2, whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#8bf2d3" }}>Alpha </span>
              <span style={{ color: "white" }}>release</span>
              <span style={{ color: "#8bf2d3" }}> coming soon!</span>
            </div>
            {/* Tagline */}
            <div
              id="hero-headline"
              style={{
                position: "absolute",
                top: Y(381), left: X(850),
                width: W(544),
                fontSize: FS(40), fontWeight: 300,
                color: "#faf9f6", lineHeight: 1.25,
                zIndex: 2,
              }}
            >
              The{" "}
              <span style={{ fontWeight: 600 }}>A</span>
              <span style={{ fontWeight: 700 }}>utonomous </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>Advertising Agent</span>
              <span style={{ fontWeight: 300 }}> for your business.</span>
            </div>
            {/* "mentic" logo */}
            <div
              id="hero-logo"
              className="font-qurova"
              style={{
                position: "absolute",
                top: Y(700), left: X(94),
                width: W(775),
                fontSize: FS(235.633),
                color: "#8bf2d3",
                lineHeight: 0.87,
                zIndex: 2,
              }}
            >
              mentic
            </div>
            {/* Sign up button */}
            <button
              onClick={openModal}
              id="hero-btn"
              style={{
                position: "absolute",
                top: Y(774), left: X(1164),
                width: W(229.913), height: H(90.162),
                background: "white", border: "none",
                borderRadius: "60.108px",
                boxShadow: "4.508px 4.508px 24.795px rgba(0,0,0,0.13), inset -1.503px -1.503px 17.131px rgba(0,0,0,0.11)",
                fontSize: FS(30.054), fontWeight: 700,
                color: "#003c46", letterSpacing: "0.9px",
                cursor: "pointer", zIndex: 2,
                fontFamily: "'Nunito Sans', sans-serif",
                transition: "transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign up!
            </button>
          </div>

          {/* ═══════════════════════════════════════
              PAIN LAYER (Frames 2-4)
          ═══════════════════════════════════════ */}
          <div id="pain-layer" style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 0 }}>
            {/* Coral gradient blob */}
            <div
              id="pain-blob"
              className="gradient-blob gradient-blob-coral"
              style={{
                width: W(836), height: H(544),
                left: X(328), top: Y(208),
                transform: "rotate(-90deg)",
              }}
            />
            {/* Pain text 1: "$3K–$10K/month in retainers. Before any ads run." */}
            <div
              id="pain-text-1"
              style={{
                position: "absolute",
                top: Y(251), left: X(294),
                width: W(485),
                fontSize: FS(35), fontWeight: 300,
                color: "#003c46", lineHeight: 1.3,
                zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 700 }}>$3K–$10K</span>/month in{" "}
              <span style={{ fontWeight: 700 }}>retainers</span>.
              <br />
              <span style={{ fontWeight: 700 }}>Before</span> any{" "}
              <span style={{ fontWeight: 700 }}>ads</span> run.
            </div>
            {/* Pain text 2: "Your ad budget pays for your agency..." */}
            <div
              id="pain-text-2"
              style={{
                position: "absolute",
                top: Y(439), left: X(294),
                width: W(588),
                fontSize: FS(35), fontWeight: 500,
                color: "#003c46", lineHeight: 1.35,
                zIndex: 3, opacity: 0,
              }}
            >
              Your <span style={{ fontWeight: 800 }}>ad budget</span> pays for
              <span style={{ fontWeight: 300 }}> your agency</span>{" "}
              <span style={{ fontWeight: 800 }}>before</span> it pays for a{" "}
              <span style={{ fontWeight: 800 }}>single</span> ad.
            </div>
            {/* Pain text 3: "Then 10–20% of your ad spend..." */}
            <div
              id="pain-text-3"
              style={{
                position: "absolute",
                top: Y(663), left: X(294),
                width: W(679),
                fontSize: FS(35), fontWeight: 300,
                color: "#003c46", lineHeight: 1.3,
                zIndex: 3, opacity: 0,
              }}
            >
              Then <span style={{ fontWeight: 700 }}>10–20%</span> of your{" "}
              <span style={{ fontWeight: 700 }}>ad spend</span> on top.
              <br />
              The <span style={{ fontWeight: 700 }}>more</span> you{" "}
              <span style={{ fontWeight: 700 }}>invest</span>, the{" "}
              <span style={{ fontWeight: 700 }}>more</span> they{" "}
              <span style={{ fontWeight: 700 }}>take</span>.
            </div>
          </div>

          {/* ═══════════════════════════════════════
              CALC LAYER (Frames 5-8)
          ═══════════════════════════════════════ */}
          <div id="calc-layer" style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 0 }}>
            {/* Coral panel — bottom-left rounded from the start */}
            <div
              id="calc-panel"
              style={{
                position: "absolute",
                top: Y(20), right: X(24),
                width: W(685), height: H(357),
                background: "#ff6b5c",
                borderRadius: "0 0 0 100px",
                zIndex: 2, opacity: 0,
              }}
            />
            {/* "MONTHLY ADVERTISING BUDGET?" */}
            <div
              id="calc-heading"
              style={{
                position: "absolute",
                top: Y(79), left: X(904),
                width: W(508),
                fontSize: FS(40), color: "white",
                lineHeight: 1.3, zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 400 }}>MONTHLY </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>ADVERTISING </span>
              <span style={{ fontWeight: 700 }}>BUDGET?</span>
            </div>
            {/* "6 000 USD" */}
            <div
              id="calc-amount"
              style={{
                position: "absolute",
                top: Y(199), left: X(903),
                width: W(509),
                fontSize: FS(80), fontWeight: 800,
                lineHeight: 1, zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ color: "#8bf2d3" }}>6 000</span>
              <span style={{ color: "white" }}> USD</span>
            </div>
            {/* "50%" */}
            <div
              id="calc-fifty"
              style={{
                position: "absolute",
                top: Y(580), left: X(70),
                width: W(730),
                fontSize: FS(315.261), fontWeight: 700,
                color: "white", lineHeight: 1,
                zIndex: 3, opacity: 0,
              }}
            >
              50%
            </div>
            {/* "of your cost is management fees." */}
            <div
              id="calc-fees"
              style={{
                position: "absolute",
                top: Y(575), left: X(800),
                width: W(452.715),
                fontSize: FS(50.442), fontWeight: 400,
                color: "white", lineHeight: 1.3,
                zIndex: 3, opacity: 0,
              }}
            >
              of your cost is <span style={{ fontWeight: 700 }}>management</span> fees.
            </div>
            {/* "NOT ADS" */}
            <div
              id="calc-notads"
              style={{
                position: "absolute",
                top: Y(730), left: X(800),
                width: W(537.205),
                fontSize: FS(104.814), fontWeight: 800,
                zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ color: "#8bf2d3" }}>NOT</span>
              <span style={{ color: "white" }}> </span>
              <span style={{ color: "white", fontWeight: 600 }}>ADS</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              SOLUTION LAYER (Frames 9-11)
          ═══════════════════════════════════════ */}
          <div id="sol-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
            {/* "Your budget doesn't have to be wasted." */}
            <div
              id="sol-text-1"
              style={{
                position: "absolute",
                top: Y(698), left: X(94),
                width: W(717),
                fontSize: FS(70), fontWeight: 700,
                color: "#003c46", lineHeight: 1.3,
                zIndex: 2, opacity: 0,
              }}
            >
              Your budget{" "}
              <span style={{ color: "#ff6b5c" }}>doesn&apos;t</span> have to
              be <span style={{ color: "#ff6b5c" }}>wasted</span>.
            </div>
            {/* "Mentic builds your strategy..." */}
            <div
              id="sol-text-2"
              style={{
                position: "absolute",
                top: Y(307), left: X(781),
                width: W(596),
                fontSize: FS(30), fontWeight: 300,
                color: "#1e1e1e", lineHeight: 1.4,
                zIndex: 2, opacity: 0,
              }}
            >
              Mentic <span style={{ fontWeight: 500 }}>builds</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>strategy</span>,{" "}
              <span style={{ fontWeight: 500 }}>launches</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>campaigns</span>, and{" "}
              <span style={{ fontWeight: 700 }}>optimises</span> them autonomously.
            </div>
            {/* "with intelligence..." */}
            <div
              id="sol-text-3"
              style={{
                position: "absolute",
                top: Y(456), left: X(1061),
                width: W(320),
                fontSize: FS(24), fontWeight: 200,
                color: "#1e1e1e", lineHeight: 1.35,
                zIndex: 2, opacity: 0,
              }}
            >
              with <span style={{ fontWeight: 500 }}>intelligence</span> based on an vast{" "}
              <span style={{ fontWeight: 800, color: "#ff6b5c" }}>agentic</span> infrastructure.
            </div>
          </div>

          {/* ═══════════════════════════════════════
              NO LAYER (Frames 12-15)
          ═══════════════════════════════════════ */}
          <div id="no-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
            <div
              id="no-text"
              style={{
                position: "absolute",
                top: Y(545.12), left: X(61),
                width: W(692.509),
                fontSize: FS(446.06), fontWeight: 700,
                color: "#ff6b5c", lineHeight: 0.75,
                zIndex: 2, opacity: 0,
              }}
            >
              NO
            </div>
            <div
              id="no-item-1"
              style={{
                position: "absolute",
                top: Y(544), left: X(768.01),
                fontSize: FS(55.758), fontWeight: 500,
                color: "#ff6b5c", zIndex: 2, opacity: 0,
              }}
            >
              Retainers,
            </div>
            <div
              id="no-item-2"
              style={{
                position: "absolute",
                top: Y(623.18), left: X(768.01),
                fontSize: FS(55.758), fontWeight: 500,
                color: "#003c46", zIndex: 2, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 800 }}>%</span> of spend,
            </div>
            <div
              id="no-item-3"
              style={{
                position: "absolute",
                top: Y(697.89), left: X(768.01),
                fontSize: FS(55.758), fontWeight: 500,
                color: "#ff6b5c", zIndex: 2, opacity: 0,
              }}
            >
              Agency,
            </div>
            <div
              id="no-item-4"
              style={{
                position: "absolute",
                top: Y(784.87), left: X(768.01),
                fontSize: FS(55.758),
                color: "#003c46", zIndex: 2, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 600 }}>Expertise</span>{" "}
              <span style={{ fontWeight: 500 }}>needed</span>
            </div>
            <div
              id="no-dot"
              style={{
                position: "absolute",
                top: Y(822.79), left: X(1231.91),
                width: FS(22.303), height: FS(22.303),
                borderRadius: "50%",
                background: "#003c46",
                zIndex: 2, opacity: 0,
              }}
            />
          </div>

          {/* ═══════════════════════════════════════
              HOW LAYER (Frames 16-19)
          ═══════════════════════════════════════ */}
          <div id="how-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
            <div id="how-step-1" style={{
              position: "absolute",
              top: Y(338), left: X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: FS(59.935), fontWeight: 600 }}>Tell</span>
              <span style={{ fontSize: FS(34.248), fontWeight: 300 }}> it your goal</span>
            </div>
            <div id="how-step-2" style={{
              position: "absolute",
              top: Y(463), left: X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: FS(59.935), fontWeight: 600 }}>Set</span>
              <span style={{ fontSize: FS(34.248), fontWeight: 300 }}> your budget</span>
            </div>
            <div id="how-step-3" style={{
              position: "absolute",
              top: Y(587.16), left: X(265),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: FS(59.935), fontWeight: 600 }}>Add</span>
              <span style={{ fontSize: FS(34.248), fontWeight: 300 }}> your creatives</span>
            </div>
            <div id="how-mentic" className="font-qurova" style={{
              position: "absolute",
              top: Y(441), left: X(863),
              width: W(411),
              fontSize: FS(121.708),
              color: "#ff6b5c", lineHeight: 0.9,
              textAlign: "center",
              zIndex: 2, opacity: 0,
            }}>
              mentic
            </div>
            <div id="how-rest" style={{
              position: "absolute",
              top: Y(547.73), left: X(872.36),
              width: W(306.143),
              fontSize: FS(46.493),
              color: "#ff6b5c",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontWeight: 700 }}>does</span>{" "}
              <span style={{ fontWeight: 400 }}>the</span>{" "}
              <span style={{ fontWeight: 300 }}>rest.</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              VALUE LAYER (Frames 20-21)
          ═══════════════════════════════════════ */}
          <div id="val-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
            <div id="val-one" style={{
              position: "absolute",
              top: Y(287), left: X(301),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ONE</span>
              <span style={{ fontSize: FS(47.425), fontWeight: 300, color: "#1e1e1e", marginLeft: "0.3em" }}>subscription</span>
            </div>
            <div id="val-every" style={{
              position: "absolute",
              top: Y(455.75), left: X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>EVERY</span>
              <span style={{ fontSize: FS(47.425), fontWeight: 300, color: "black", marginLeft: "0.3em" }}>
                dollar <span style={{ fontWeight: 500 }}>spend</span> on ads.
              </span>
            </div>
            <div id="val-all" style={{
              position: "absolute",
              top: Y(624.5), left: X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ALL</span>
              <span style={{ fontSize: FS(47.425), fontWeight: 300, color: "black", marginLeft: "0.3em" }}>
                advertising <span style={{ fontWeight: 500 }}>platforms</span> centralised
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              CTA LAYER (Frame 22)
          ═══════════════════════════════════════ */}
          <div id="cta-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
            {/* Large mentic icon (orange) */}
            <div
              id="cta-icon"
              style={{
                position: "absolute",
                top: Y(374), left: X(671),
                width: W(219), height: H(219),
                zIndex: 2, opacity: 0,
              }}
            >
              <Image
                src="/images/mentic-icon-orange.png"
                alt="Mentic"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div id="cta-sign" style={{
              position: "absolute",
              top: Y(606), left: X(149),
              fontSize: FS(100), fontWeight: 700,
              color: "#003c46", lineHeight: 1.1,
              zIndex: 2, opacity: 0,
            }}>
              Sign
            </div>
            <div id="cta-up" style={{
              position: "absolute",
              top: Y(730), left: X(149),
              fontSize: FS(150), fontWeight: 700,
              color: "#ff6b5c", lineHeight: 0.83,
              zIndex: 2, opacity: 0,
            }}>
              UP
            </div>
            <div id="cta-now" style={{
              position: "absolute",
              top: Y(754), left: X(367),
              fontSize: FS(100), fontWeight: 700,
              color: "#8bf2d3", lineHeight: 1.1,
              zIndex: 2, opacity: 0,
            }}>
              now
            </div>
            <div id="cta-alpha" style={{
              position: "absolute",
              top: Y(709), left: X(1096),
              width: W(323),
              fontSize: FS(30), fontWeight: 300,
              color: "#1e1e1e",
              zIndex: 2, opacity: 0,
            }}>
              Alpha releasing <span style={{ fontWeight: 600 }}>soon!</span>
            </div>
            <button
              onClick={openModal}
              id="cta-button"
              style={{
                position: "absolute",
                top: Y(777), left: X(1190),
                width: W(195), height: H(78),
                background: "#8bf2d3", border: "none",
                borderRadius: "20px",
                boxShadow: "2px 2px 16.9px rgba(0,0,0,0.25)",
                fontSize: FS(30), fontWeight: 700,
                color: "#003c46",
                fontFamily: "'Nunito Sans', sans-serif",
                cursor: "pointer", zIndex: 2, opacity: 0,
                transition: "transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign up!
            </button>
          </div>

        </div>
      </div>

      {/* ── Loading screen ── */}
      <div
        ref={loaderRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#ff6b5c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Image
          src="/images/mentic-icon-mint.png"
          alt="Mentic"
          width={80}
          height={80}
          priority
          style={{ filter: "drop-shadow(2px 2px 12px rgba(0,0,0,0.2))" }}
        />
        <div
          className="font-qurova"
          style={{
            fontSize: 32,
            color: "#8bf2d3",
            letterSpacing: "0.05em",
          }}
        >
          mentic
        </div>
      </div>

      {/* Signup Modal */}
      {showModal && <SignupModal onClose={closeModal} />}
    </>
  );
}

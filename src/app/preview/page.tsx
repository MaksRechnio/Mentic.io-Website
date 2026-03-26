"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── Figma design frame = 1491 × 967 px ── */
const X = (x: number) => `${(x / 1491) * 100}%`;
const Y = (y: number) => `${(y / 967) * 100}%`;
const W = (w: number) => `${(w / 1491) * 100}%`;
const H = (h: number) => `${(h / 967) * 100}%`;
const FS = (px: number) => `${(px / 1491) * 100}vw`;

const TOTAL_FRAMES = 67;

export default function PreviewLanding() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const signupLayerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Detect mobile ── */
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const openSignup = useCallback(() => {
    if (!signupLayerRef.current) return;
    const signup = signupLayerRef.current;
    lenisRef.current?.stop();
    const tl = gsap.timeline();
    tl.set(signup, { opacity: 1, pointerEvents: "auto" });
    tl.fromTo("#signup-bg", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    tl.fromTo("#signup-blobs > div", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "<0.1");
    tl.fromTo("#signup-glass", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.1");
    tl.fromTo("#signup-icon", { opacity: 0, scale: 0.3, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.4)" }, "<0.1");
    tl.fromTo("#signup-card", { opacity: 0, x: 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power2.out" }, "<0.15");
    tl.fromTo("#signup-form > *", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.06 }, "<0.2");
  }, []);

  const closeSignup = useCallback(() => {
    if (!signupLayerRef.current) return;
    const signup = signupLayerRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(signup, { opacity: 0, pointerEvents: "none" });
        lenisRef.current?.start();
      },
    });
    tl.to(signup.querySelectorAll("#signup-form > *"), { opacity: 0, y: -10, duration: 0.2, ease: "power2.in", stagger: 0.03 });
    tl.to(signup.querySelector("#signup-card"), { opacity: 0, x: 40, duration: 0.3, ease: "power2.in" }, "<0.1");
    tl.to(signup.querySelector("#signup-icon"), { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelector("#signup-glass"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelectorAll("#signup-blobs > div"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelector("#signup-bg"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
  }, []);

  /* ── Loading screen + hero entrance (time-based, on page load) ── */
  useEffect(() => {
    if (!viewportRef.current) return;
    const vp = viewportRef.current;
    const loader = loaderRef.current;

    const heroCard = vp.querySelector("#hero-card") as HTMLElement;
    const heroIcon = vp.querySelector("#hero-icon") as HTMLElement;
    const heroAlpha = vp.querySelector("#hero-alpha") as HTMLElement;
    const heroLogo = vp.querySelector("#hero-logo") as HTMLElement;
    const heroHeadline = vp.querySelector("#hero-headline") as HTMLElement;
    const heroBtn = vp.querySelector("#hero-btn") as HTMLElement;

    gsap.set([heroCard, heroIcon, heroAlpha, heroHeadline, heroLogo, heroBtn], { opacity: 0 });
    gsap.set(heroCard, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(heroLogo, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(heroHeadline, { clipPath: "inset(0 0 100% 0)" });

    const intro = gsap.timeline({ delay: 0.3 });

    if (loader) {
      intro.to(loader, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
      intro.set(loader, { display: "none" });
    }

    intro.to(heroCard, {
      opacity: 1, clipPath: "inset(0% 0 0 0)",
      duration: 0.9, ease: "power4.out",
    }, loader ? "-=0.2" : 0);

    intro.fromTo(heroIcon,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)" },
      "-=0.5");

    intro.to(heroLogo, {
      opacity: 1, clipPath: "inset(0 0% 0 0)",
      duration: 0.8, ease: "power3.out",
    }, "-=0.4");

    intro.to(heroHeadline, {
      opacity: 1, clipPath: "inset(0 0 0% 0)",
      duration: 0.7, ease: "power3.out",
    }, "-=0.5");

    intro.fromTo(heroAlpha,
      { opacity: 0, filter: "blur(12px)", letterSpacing: "8px" },
      { opacity: 1, filter: "blur(0px)", letterSpacing: "0.75px", duration: 0.6, ease: "power2.out" },
      "-=0.3");

    intro.fromTo(heroBtn,
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.5)" },
      "-=0.2");

    return () => { intro.kill(); };
  }, []);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  /* ── Master scroll-scrubbed timeline ── */
  useEffect(() => {
    if (!wrapperRef.current || !viewportRef.current) return;

    const ctx = gsap.context(() => {
      const vp = viewportRef.current!;
      const mob = isMobile;

      const f = (n: number) => (n - 1) / (TOTAL_FRAMES - 1);
      const d1 = 1 / (TOTAL_FRAMES - 1);
      const ease = "power2.out";
      const easeOut = "power2.in";
      const ds = d1 * 0.6;

      const sectionStops = [
        f(1), f(2),
        f(7), f(8), f(9), f(10),
        f(17), f(18), f(19), f(20),
        f(28), f(29), f(30), f(31),
        f(38), f(39), f(40), f(41), f(42), f(43),
        f(49), f(50), f(51), f(52),
        f(57), f(58), f(59),
        f(64), f(65), f(67),
      ];

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          snap: {
            snapTo: sectionStops,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power1.inOut",
            directional: true,
          },
        },
      });

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

      /* ═══ Hero → Pain ═══ */
      master.to(heroAlpha, { opacity: 0, duration: d1 * 2, ease: easeOut }, f(3));
      master.to(heroHeadline, { opacity: 0, duration: d1 * 2, ease: easeOut }, f(3));
      master.to(heroLogo, { opacity: 0, duration: d1 * 2, ease: easeOut }, f(3));
      master.to(heroBtn, { opacity: 0, duration: d1 * 2, ease: easeOut }, f(3));
      master.to(heroCard, {
        backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "none",
        backdropFilter: "blur(12px)", duration: d1 * 2.5, ease,
      }, f(3.5));
      master.to(heroIcon, { opacity: 0, duration: d1 * 1.5, ease: easeOut }, f(3.5));
      master.set(heroLayer, { opacity: 0 }, f(5.5));
      master.to(painLayer, { opacity: 1, duration: d1 * 2.5, ease }, f(4));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(4));
      master.to(glassCard, { opacity: 1, duration: d1 * 2, ease }, f(4));

      /* ═══ Pain IN ═══ */
      master.fromTo(painText1, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(7));
      master.fromTo(painBlob, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: ds, ease }, f(7));

      master.fromTo(painText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(8));
      master.fromTo(glassStrip1, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(8));
      if (!mob) {
        master.to(painBlob, { width: W(1051), height: H(666), left: X(220), top: Y(813), duration: ds, ease }, f(8));
      } else {
        master.to(painBlob, { scale: 1.2, duration: ds, ease }, f(8));
      }

      master.fromTo(painText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(9));
      master.fromTo(glassStrip2, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(9));
      if (!mob) {
        master.to(painBlob, { width: W(1232), height: H(848), left: X(130), top: Y(908), duration: ds, ease }, f(9));
      } else {
        master.to(painBlob, { scale: 1.4, duration: ds, ease }, f(9));
      }

      /* Pain OUT */
      master.to(painText3, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(11));
      master.to(glassStrip2, { opacity: 0, duration: ds, ease: easeOut }, f(11));
      master.to(painText2, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(12));
      master.to(glassStrip1, { opacity: 0, duration: ds, ease: easeOut }, f(12));
      master.to(painText1, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(12));
      master.to(painBlob, { opacity: 0, duration: ds, ease: easeOut }, f(12));

      /* ═══ Pain → Calc ═══ */
      master.to(painLayer, { opacity: 0, duration: d1 * 1.5, ease }, f(13));
      master.to(bg, { backgroundColor: "#ff6b5c", duration: d1 * 3, ease }, f(13));
      master.to(calcLayer, { opacity: 1, duration: d1 * 2, ease }, f(14.5));

      /* ═══ Calc IN ═══ */
      master.fromTo(calcPanel, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(17));
      master.fromTo(calcHeading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(17));
      master.fromTo(calcAmount, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: ds, ease }, f(18));
      master.fromTo(calcFifty, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: ds, ease }, f(18));
      master.fromTo(calcFees, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: ds, ease }, f(19));
      master.fromTo(calcNotads, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(19));

      /* Calc OUT */
      master.to(calcFees, { opacity: 0, x: 20, duration: ds, ease: easeOut }, f(21));
      master.to(calcNotads, { opacity: 0, y: -10, duration: ds, ease: easeOut }, f(21));
      master.to(calcAmount, { opacity: 0, scale: 0.9, duration: ds, ease: easeOut }, f(22));
      master.to(calcFifty, { opacity: 0, scale: 0.8, duration: ds, ease: easeOut }, f(22));
      master.to(calcPanel, { opacity: 0, duration: ds, ease: easeOut }, f(22));
      master.to(calcHeading, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(22));

      /* ═══ Calc → Solution ═══ */
      master.to(calcLayer, { opacity: 0, duration: d1 * 1.5, ease }, f(23));
      master.to(iconTeal, { opacity: 0, duration: d1 * 1.5, ease }, f(23));
      master.to(bg, { backgroundColor: "#ffffff", duration: d1 * 3.5, ease }, f(23));
      master.fromTo(blobCoral, { opacity: 0 }, { opacity: 1, duration: d1 * 3, ease }, f(24));
      master.fromTo(blobMint, { opacity: 0 }, { opacity: 1, duration: d1 * 3, ease }, f(24));

      const blobDuration = f(67) - f(27);
      master.to(blobCoral, {
        rotation: 60, x: "5vw", y: "5vh", scale: 1.1,
        duration: blobDuration, ease: "none",
      }, f(27));
      master.to(blobMint, {
        rotation: -45, x: "-5vw", y: "-5vh", scale: 1.1,
        duration: blobDuration, ease: "none",
      }, f(27));

      master.to(solLayer, { opacity: 1, duration: d1 * 2, ease }, f(25));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(25.5));

      /* ═══ Solution IN ═══ */
      master.fromTo(solText1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(28));
      master.fromTo(solText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(29));
      master.fromTo(solText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(30));

      /* Solution OUT */
      master.to(solText3, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(32));
      master.to(solText2, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(33));
      master.to(solText1, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(33));

      /* ═══ Solution → NO ═══ */
      master.to(solLayer, { opacity: 0, duration: d1 * 2, ease }, f(34));
      master.to(noLayer, { opacity: 1, duration: d1 * 2, ease }, f(35.5));

      /* ═══ NO IN ═══ */
      master.fromTo(noText, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: ds, ease }, f(38));
      master.fromTo(noItem1, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(39));
      master.fromTo(noItem2, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(40));
      master.fromTo(noItem3, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(41));
      master.fromTo(noItem4, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(42));
      master.fromTo(noDot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: ds, ease }, f(42));

      /* NO OUT */
      master.to(noItem4, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noDot, { opacity: 0, scale: 0, duration: ds, ease: easeOut }, f(44));
      master.to(noItem3, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noItem2, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noItem1, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noText, { opacity: 0, scale: 0.5, duration: ds, ease: easeOut }, f(45));

      /* ═══ NO → How ═══ */
      master.to(noLayer, { opacity: 0, duration: d1 * 2, ease }, f(46));
      master.to(howLayer, { opacity: 1, duration: d1 * 2, ease }, f(46.5));

      /* ═══ How IN ═══ */
      master.fromTo(howStep1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(49));
      master.fromTo(howStep2, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(50));
      master.fromTo(howStep3, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(50));
      master.fromTo(howMentic, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: ds, ease }, f(51));
      master.fromTo(howRest, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: ds, ease }, f(51));

      /* How OUT */
      master.to(howStep3, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howStep2, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howStep1, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howMentic, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(53));
      master.to(howRest, { opacity: 0, y: -10, duration: ds, ease: easeOut }, f(53));

      /* ═══ How → Value ═══ */
      master.to(howLayer, { opacity: 0, duration: d1 * 2, ease }, f(54));
      master.to(valLayer, { opacity: 1, duration: d1 * 2, ease }, f(54.5));

      /* ═══ Value IN ═══ */
      master.fromTo(valOne, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(57));
      master.fromTo(valEvery, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(58));
      master.fromTo(valAll, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(58));

      /* Value OUT */
      master.to(valAll, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));
      master.to(valEvery, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));
      master.to(valOne, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));

      /* ═══ Value → CTA ═══ */
      master.to(valLayer, { opacity: 0, duration: d1 * 1.5, ease }, f(61));
      master.to(ctaLayer, { opacity: 1, duration: d1 * 1.5, ease }, f(61.5));

      /* ═══ CTA IN ═══ */
      master.fromTo(ctaIcon, { opacity: 0, scale: 0.3, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: ds * 2, ease }, f(64));
      master.fromTo(ctaSign, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: ds, ease }, f(64));
      master.fromTo(ctaUp, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: ds, ease }, f(64));
      master.fromTo(ctaNow, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: ds, ease }, f(65));
      master.fromTo(ctaAlpha, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(65));
      master.fromTo(ctaButton, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: ds, ease: "back.out(1.4)" }, f(65));

    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  /* ── Shorthand for mobile flex layer ── */
  const mLayer = (z: number): React.CSSProperties => ({
    position: "absolute", inset: 0, zIndex: z, opacity: 0,
    ...(isMobile ? {
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 24px", gap: 12, textAlign: "center",
    } : {}),
  });

  return (
    <>
      <div ref={wrapperRef} style={{ height: `${TOTAL_FRAMES * 25}vh`, position: "relative" }}>
        <div
          ref={viewportRef}
          style={{
            position: "sticky", top: 0,
            width: "100vw", height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* ── Background ── */}
          <div id="bg" style={{ position: "absolute", inset: 0, backgroundColor: "#ffe5e5", zIndex: 0 }} />

          {/* ── Persistent teal icon ── */}
          <button
            id="icon-teal"
            onClick={() => lenisRef.current?.scrollTo(0, { duration: 1.5 })}
            style={{
              position: "absolute",
              top: isMobile ? 16 : Y(53),
              left: isMobile ? 16 : X(61),
              width: isMobile ? 40 : W(65),
              height: "auto", zIndex: 10, opacity: 0,
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
            }}
          >
            <Image src="/images/mentic-icon-teal.png" alt="Mentic" width={65} height={65} style={{ width: "100%", height: "auto" }} />
          </button>

          {/* ── Persistent glass card ── */}
          <div
            id="glass-card"
            style={{
              position: "absolute",
              ...(isMobile
                ? { inset: 8 }
                : { top: Y(20), left: X(24), width: W(1443), height: H(919) }),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "17.872px",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
              zIndex: 1, opacity: 0,
            }}
          />

          {/* ── Glass strips (desktop only) ── */}
          {!isMobile && (
            <>
              <div
                id="glass-strip-1"
                style={{
                  position: "absolute",
                  left: X(24), top: Y(229), width: W(984), height: H(152),
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "0 12px 12px 0", zIndex: 2, opacity: 0,
                }}
              />
              <div
                id="glass-strip-2"
                style={{
                  position: "absolute",
                  left: X(24), top: Y(652), width: W(984), height: H(141),
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "0 12px 12px 0", zIndex: 2, opacity: 0,
                }}
              />
            </>
          )}
          {/* Hidden placeholders for GSAP when mobile */}
          {isMobile && (
            <>
              <div id="glass-strip-1" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              <div id="glass-strip-2" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
            </>
          )}

          {/* ── Gradient blobs ── */}
          <div
            id="blob-coral"
            className="gradient-blob gradient-blob-coral"
            style={{
              width: isMobile ? "100vw" : "80vw",
              height: isMobile ? "100vw" : "80vw",
              left: "-30%", top: "-20%",
              opacity: 0, zIndex: 1,
            }}
          />
          <div
            id="blob-mint"
            className="gradient-blob gradient-blob-mint"
            style={{
              width: isMobile ? "90vw" : "70vw",
              height: isMobile ? "90vw" : "70vw",
              right: "-20%", bottom: "-25%",
              left: "auto", top: "auto",
              opacity: 0, zIndex: 1,
            }}
          />

          {/* ═══════════════════════════════════════
              HERO LAYER
          ═══════════════════════════════════════ */}
          <div id="hero-layer" style={{
            position: "absolute", inset: 0, zIndex: 5,
            ...(isMobile ? {
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "0 20px", gap: 16,
            } : {}),
          }}>
            {/* Coral card — always absolute */}
            <div
              id="hero-card"
              style={{
                position: "absolute",
                ...(isMobile
                  ? { inset: 8, borderRadius: "17.872px" }
                  : { top: Y(24), left: X(26), width: W(1443), height: H(919), borderRadius: "17.872px" }),
                background: "#ff6b5c",
                boxShadow: "-1.787px -1.787px 23.413px rgba(0,0,0,0.25), 2.681px 2.681px 19.302px rgba(0,0,0,0.25)",
              }}
            />
            {/* Icon */}
            <Image
              id="hero-icon"
              src="/images/mentic-icon-mint.png"
              alt="Mentic"
              width={65}
              height={65}
              style={isMobile ? {
                width: 44, height: 44, zIndex: 2, order: 1,
                filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
              } : {
                position: "absolute",
                top: Y(51), left: X(61),
                width: W(65), height: "auto", zIndex: 2,
                filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
              }}
            />
            {/* "mentic" logo */}
            <div
              id="hero-logo"
              className="font-qurova"
              style={isMobile ? {
                fontSize: "15vw", color: "#8bf2d3", lineHeight: 0.87,
                zIndex: 2, order: 2,
              } : {
                position: "absolute",
                top: Y(700), left: X(94), width: W(775),
                fontSize: FS(235.633), color: "#8bf2d3", lineHeight: 0.87, zIndex: 2,
              }}
            >
              mentic
            </div>
            {/* Headline */}
            <div
              id="hero-headline"
              style={isMobile ? {
                fontSize: 20, fontWeight: 300, color: "#faf9f6",
                lineHeight: 1.3, zIndex: 2, order: 3,
                maxWidth: 320, textAlign: "center",
              } : {
                position: "absolute",
                top: Y(381), left: X(850), width: W(544),
                fontSize: FS(40), fontWeight: 300,
                color: "#faf9f6", lineHeight: 1.25, zIndex: 2,
              }}
            >
              The{" "}
              <span style={{ fontWeight: 600 }}>A</span>
              <span style={{ fontWeight: 700 }}>utonomous </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>Advertising Agent</span>
              <span style={{ fontWeight: 300 }}> for your business.</span>
            </div>
            {/* Alpha text */}
            <div
              id="hero-alpha"
              style={isMobile ? {
                fontSize: 13, fontWeight: 700, letterSpacing: "0.75px",
                zIndex: 2, order: 4, whiteSpace: "nowrap",
              } : {
                position: "absolute",
                top: Y(69), left: X(1083),
                fontSize: FS(25), fontWeight: 700,
                letterSpacing: "0.75px", zIndex: 2, whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#8bf2d3" }}>Alpha </span>
              <span style={{ color: "white" }}>release</span>
              <span style={{ color: "#8bf2d3" }}> coming soon!</span>
            </div>
            {/* Sign up button */}
            <button
              onClick={openSignup}
              id="hero-btn"
              style={isMobile ? {
                width: 180, height: 52,
                background: "white", border: "none",
                borderRadius: "60px",
                boxShadow: "4.508px 4.508px 24.795px rgba(0,0,0,0.13), inset -1.503px -1.503px 17.131px rgba(0,0,0,0.11)",
                fontSize: 18, fontWeight: 700,
                color: "#003c46", letterSpacing: "0.9px",
                cursor: "pointer", zIndex: 2, order: 5,
                fontFamily: "'Nunito Sans', sans-serif",
              } : {
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
              PAIN LAYER
          ═══════════════════════════════════════ */}
          <div id="pain-layer" style={mLayer(4)}>
            {/* Coral gradient blob — always absolute */}
            <div
              id="pain-blob"
              className="gradient-blob gradient-blob-coral"
              style={{
                position: "absolute",
                ...(isMobile
                  ? { width: "80vw", height: "80vw", left: "10%", top: "15%" }
                  : { width: W(836), height: H(544), left: X(328), top: Y(208) }),
                transform: "rotate(-90deg)",
              }}
            />
            <div
              id="pain-text-1"
              style={isMobile ? {
                fontSize: 18, fontWeight: 300, color: "#003c46",
                lineHeight: 1.35, zIndex: 3, opacity: 0,
                maxWidth: 340, textAlign: "left" as const,
              } : {
                position: "absolute",
                top: Y(251), left: X(294), width: W(485),
                fontSize: FS(35), fontWeight: 300,
                color: "#003c46", lineHeight: 1.3, zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 700 }}>$3K–$10K</span>/month in{" "}
              <span style={{ fontWeight: 700 }}>retainers</span>.
              <br />
              <span style={{ fontWeight: 700 }}>Before</span> any{" "}
              <span style={{ fontWeight: 700 }}>ads</span> run.
            </div>
            <div
              id="pain-text-2"
              style={isMobile ? {
                fontSize: 18, fontWeight: 500, color: "#003c46",
                lineHeight: 1.35, zIndex: 3, opacity: 0,
                maxWidth: 340, textAlign: "left" as const,
              } : {
                position: "absolute",
                top: Y(439), left: X(294), width: W(588),
                fontSize: FS(35), fontWeight: 500,
                color: "#003c46", lineHeight: 1.35, zIndex: 3, opacity: 0,
              }}
            >
              Your <span style={{ fontWeight: 800 }}>ad budget</span> pays for
              <span style={{ fontWeight: 300 }}> your agency</span>{" "}
              <span style={{ fontWeight: 800 }}>before</span> it pays for a{" "}
              <span style={{ fontWeight: 800 }}>single</span> ad.
            </div>
            <div
              id="pain-text-3"
              style={isMobile ? {
                fontSize: 18, fontWeight: 300, color: "#003c46",
                lineHeight: 1.35, zIndex: 3, opacity: 0,
                maxWidth: 340, textAlign: "left" as const,
              } : {
                position: "absolute",
                top: Y(663), left: X(294), width: W(679),
                fontSize: FS(35), fontWeight: 300,
                color: "#003c46", lineHeight: 1.3, zIndex: 3, opacity: 0,
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
              CALC LAYER
          ═══════════════════════════════════════ */}
          <div id="calc-layer" style={mLayer(4)}>
            {/* Panel — always absolute */}
            <div
              id="calc-panel"
              style={{
                position: "absolute",
                ...(isMobile
                  ? { top: 0, right: 0, width: "70%", height: "30%", borderRadius: "0 0 0 40px" }
                  : { top: Y(20), right: X(24), width: W(685), height: H(357), borderRadius: "0 0 0 100px" }),
                background: "#ff6b5c", zIndex: 2, opacity: 0,
              }}
            />
            <div
              id="calc-heading"
              style={isMobile ? {
                fontSize: 20, color: "white", lineHeight: 1.3,
                zIndex: 3, opacity: 0, order: 1,
              } : {
                position: "absolute",
                top: Y(79), left: X(904), width: W(508),
                fontSize: FS(40), color: "white", lineHeight: 1.3,
                zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ fontWeight: 400 }}>MONTHLY </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>ADVERTISING </span>
              <span style={{ fontWeight: 700 }}>BUDGET?</span>
            </div>
            <div
              id="calc-amount"
              style={isMobile ? {
                fontSize: 36, fontWeight: 800, lineHeight: 1,
                zIndex: 3, opacity: 0, order: 2,
              } : {
                position: "absolute",
                top: Y(199), left: X(903), width: W(509),
                fontSize: FS(80), fontWeight: 800, lineHeight: 1,
                zIndex: 3, opacity: 0,
              }}
            >
              <span style={{ color: "#8bf2d3" }}>6 000</span>
              <span style={{ color: "white" }}> USD</span>
            </div>
            <div
              id="calc-fifty"
              style={isMobile ? {
                fontSize: 90, fontWeight: 700, color: "white",
                lineHeight: 1, zIndex: 3, opacity: 0, order: 3,
              } : {
                position: "absolute",
                top: Y(580), left: X(70), width: W(730),
                fontSize: FS(315.261), fontWeight: 700,
                color: "white", lineHeight: 1, zIndex: 3, opacity: 0,
              }}
            >
              50%
            </div>
            <div
              id="calc-fees"
              style={isMobile ? {
                fontSize: 18, fontWeight: 400, color: "white",
                lineHeight: 1.3, zIndex: 3, opacity: 0, order: 4,
                maxWidth: 280,
              } : {
                position: "absolute",
                top: Y(575), left: X(800), width: W(452.715),
                fontSize: FS(50.442), fontWeight: 400,
                color: "white", lineHeight: 1.3, zIndex: 3, opacity: 0,
              }}
            >
              of your cost is <span style={{ fontWeight: 700 }}>management</span> fees.
            </div>
            <div
              id="calc-notads"
              style={isMobile ? {
                fontSize: 42, fontWeight: 800, zIndex: 3, opacity: 0, order: 5,
              } : {
                position: "absolute",
                top: Y(730), left: X(800), width: W(537.205),
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
              SOLUTION LAYER
          ═══════════════════════════════════════ */}
          <div id="sol-layer" style={mLayer(3)}>
            <div
              id="sol-text-1"
              style={isMobile ? {
                fontSize: 28, fontWeight: 700, color: "#003c46",
                lineHeight: 1.3, zIndex: 2, opacity: 0,
                maxWidth: 340,
              } : {
                position: "absolute",
                top: Y(698), left: X(94), width: W(717),
                fontSize: FS(70), fontWeight: 700,
                color: "#003c46", lineHeight: 1.3, zIndex: 2, opacity: 0,
              }}
            >
              Your budget{" "}
              <span style={{ color: "#ff6b5c" }}>doesn&apos;t</span> have to
              be <span style={{ color: "#ff6b5c" }}>wasted</span>.
            </div>
            <div
              id="sol-text-2"
              style={isMobile ? {
                fontSize: 16, fontWeight: 300, color: "#1e1e1e",
                lineHeight: 1.4, zIndex: 2, opacity: 0,
                maxWidth: 320,
              } : {
                position: "absolute",
                top: Y(307), left: X(781), width: W(596),
                fontSize: FS(30), fontWeight: 300,
                color: "#1e1e1e", lineHeight: 1.4, zIndex: 2, opacity: 0,
              }}
            >
              Mentic <span style={{ fontWeight: 500 }}>builds</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>strategy</span>,{" "}
              <span style={{ fontWeight: 500 }}>launches</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>campaigns</span>, and{" "}
              <span style={{ fontWeight: 700 }}>optimises</span> them autonomously.
            </div>
            <div
              id="sol-text-3"
              style={isMobile ? {
                fontSize: 14, fontWeight: 200, color: "#1e1e1e",
                lineHeight: 1.35, zIndex: 2, opacity: 0,
                maxWidth: 280,
              } : {
                position: "absolute",
                top: Y(456), left: X(1061), width: W(320),
                fontSize: FS(24), fontWeight: 200,
                color: "#1e1e1e", lineHeight: 1.35, zIndex: 2, opacity: 0,
              }}
            >
              with <span style={{ fontWeight: 500 }}>intelligence</span> based on a vast{" "}
              <span style={{ fontWeight: 800, color: "#ff6b5c" }}>agentic</span> infrastructure.
            </div>
          </div>

          {/* ═══════════════════════════════════════
              NO LAYER
          ═══════════════════════════════════════ */}
          <div id="no-layer" style={mLayer(3)}>
            <div
              id="no-text"
              style={isMobile ? {
                fontSize: 120, fontWeight: 700, color: "#ff6b5c",
                lineHeight: 0.85, zIndex: 2, opacity: 0,
              } : {
                position: "absolute",
                top: Y(545.12), left: X(61), width: W(692.509),
                fontSize: FS(446.06), fontWeight: 700,
                color: "#ff6b5c", lineHeight: 0.75, zIndex: 2, opacity: 0,
              }}
            >
              NO
            </div>
            <div
              id="no-item-1"
              style={isMobile ? {
                fontSize: 24, fontWeight: 500, color: "#ff6b5c",
                zIndex: 2, opacity: 0,
              } : {
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
              style={isMobile ? {
                fontSize: 24, fontWeight: 500, color: "#003c46",
                zIndex: 2, opacity: 0,
              } : {
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
              style={isMobile ? {
                fontSize: 24, fontWeight: 500, color: "#ff6b5c",
                zIndex: 2, opacity: 0,
              } : {
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
              style={isMobile ? {
                fontSize: 24, color: "#003c46",
                zIndex: 2, opacity: 0,
              } : {
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
              style={isMobile ? {
                width: 12, height: 12, borderRadius: "50%",
                background: "#003c46", zIndex: 2, opacity: 0,
              } : {
                position: "absolute",
                top: Y(822.79), left: X(1231.91),
                width: FS(22.303), height: FS(22.303),
                borderRadius: "50%", background: "#003c46",
                zIndex: 2, opacity: 0,
              }}
            />
          </div>

          {/* ═══════════════════════════════════════
              HOW LAYER
          ═══════════════════════════════════════ */}
          <div id="how-layer" style={mLayer(3)}>
            <div id="how-step-1" style={isMobile ? {
              zIndex: 2, opacity: 0, color: "#003c46",
            } : {
              position: "absolute",
              top: Y(338), left: X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: isMobile ? 28 : FS(59.935), fontWeight: 600 }}>Tell</span>
              <span style={{ fontSize: isMobile ? 17 : FS(34.248), fontWeight: 300 }}> it your goal</span>
            </div>
            <div id="how-step-2" style={isMobile ? {
              zIndex: 2, opacity: 0, color: "#003c46",
            } : {
              position: "absolute",
              top: Y(463), left: X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: isMobile ? 28 : FS(59.935), fontWeight: 600 }}>Set</span>
              <span style={{ fontSize: isMobile ? 17 : FS(34.248), fontWeight: 300 }}> your budget</span>
            </div>
            <div id="how-step-3" style={isMobile ? {
              zIndex: 2, opacity: 0, color: "#003c46",
            } : {
              position: "absolute",
              top: Y(587.16), left: X(265),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: isMobile ? 28 : FS(59.935), fontWeight: 600 }}>Add</span>
              <span style={{ fontSize: isMobile ? 17 : FS(34.248), fontWeight: 300 }}> your creatives</span>
            </div>
            <div id="how-mentic" className="font-qurova" style={isMobile ? {
              fontSize: 52, color: "#ff6b5c", lineHeight: 0.9,
              textAlign: "center", zIndex: 2, opacity: 0,
              marginTop: 12,
            } : {
              position: "absolute",
              top: Y(441), left: X(863), width: W(411),
              fontSize: FS(121.708), color: "#ff6b5c",
              lineHeight: 0.9, textAlign: "center",
              zIndex: 2, opacity: 0,
            }}>
              mentic
            </div>
            <div id="how-rest" style={isMobile ? {
              fontSize: 22, color: "#ff6b5c",
              zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(547.73), left: X(872.36), width: W(306.143),
              fontSize: FS(46.493), color: "#ff6b5c",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontWeight: 700 }}>does</span>{" "}
              <span style={{ fontWeight: 400 }}>the</span>{" "}
              <span style={{ fontWeight: 300 }}>rest.</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              VALUE LAYER
          ═══════════════════════════════════════ */}
          <div id="val-layer" style={{
            ...mLayer(3),
            ...(isMobile ? { gap: 20 } : {}),
          }}>
            <div id="val-one" style={isMobile ? {
              display: "flex", flexDirection: "column" as const,
              alignItems: "center", zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(287), left: X(301),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: isMobile ? 40 : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ONE</span>
              <span style={{ fontSize: isMobile ? 20 : FS(47.425), fontWeight: 300, color: "#1e1e1e", marginLeft: isMobile ? 0 : "0.3em" }}>subscription</span>
            </div>
            <div id="val-every" style={isMobile ? {
              display: "flex", flexDirection: "column" as const,
              alignItems: "center", zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(455.75), left: X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: isMobile ? 40 : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>EVERY</span>
              <span style={{ fontSize: isMobile ? 20 : FS(47.425), fontWeight: 300, color: "black", marginLeft: isMobile ? 0 : "0.3em" }}>
                dollar <span style={{ fontWeight: 500 }}>spend</span> on ads.
              </span>
            </div>
            <div id="val-all" style={isMobile ? {
              display: "flex", flexDirection: "column" as const,
              alignItems: "center", zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(624.5), left: X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: isMobile ? 40 : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ALL</span>
              <span style={{ fontSize: isMobile ? 20 : FS(47.425), fontWeight: 300, color: "black", marginLeft: isMobile ? 0 : "0.3em" }}>
                advertising <span style={{ fontWeight: 500 }}>platforms</span> centralised
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              CTA LAYER
          ═══════════════════════════════════════ */}
          <div id="cta-layer" style={mLayer(3)}>
            <div
              id="cta-icon"
              style={isMobile ? {
                width: 80, height: 80, position: "relative",
                zIndex: 2, opacity: 0,
              } : {
                position: "absolute",
                top: Y(374), left: X(671),
                width: W(219), height: H(219),
                zIndex: 2, opacity: 0,
              }}
            >
              <Image src="/images/mentic-icon-orange.png" alt="Mentic" fill style={{ objectFit: "contain" }} />
            </div>
            <div id="cta-sign" style={isMobile ? {
              fontSize: 48, fontWeight: 700, color: "#003c46",
              lineHeight: 1.1, zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(606), left: X(149),
              fontSize: FS(100), fontWeight: 700,
              color: "#003c46", lineHeight: 1.1, zIndex: 2, opacity: 0,
            }}>
              Sign
            </div>
            <div id="cta-up" style={isMobile ? {
              fontSize: 72, fontWeight: 700, color: "#ff6b5c",
              lineHeight: 0.83, zIndex: 2, opacity: 0,
              marginTop: -8,
            } : {
              position: "absolute",
              top: Y(730), left: X(149),
              fontSize: FS(150), fontWeight: 700,
              color: "#ff6b5c", lineHeight: 0.83, zIndex: 2, opacity: 0,
            }}>
              UP
            </div>
            <div id="cta-now" style={isMobile ? {
              fontSize: 48, fontWeight: 700, color: "#8bf2d3",
              lineHeight: 1.1, zIndex: 2, opacity: 0,
              marginTop: -4,
            } : {
              position: "absolute",
              top: Y(754), left: X(367),
              fontSize: FS(100), fontWeight: 700,
              color: "#8bf2d3", lineHeight: 1.1, zIndex: 2, opacity: 0,
            }}>
              now
            </div>
            <div id="cta-alpha" style={isMobile ? {
              fontSize: 14, fontWeight: 300, color: "#1e1e1e",
              zIndex: 2, opacity: 0,
            } : {
              position: "absolute",
              top: Y(709), left: X(1096), width: W(323),
              fontSize: FS(30), fontWeight: 300,
              color: "#1e1e1e", zIndex: 2, opacity: 0,
            }}>
              Alpha releasing <span style={{ fontWeight: 600 }}>soon!</span>
            </div>
            <button
              onClick={openSignup}
              id="cta-button"
              style={isMobile ? {
                width: 160, height: 52,
                background: "#8bf2d3", border: "none",
                borderRadius: "20px",
                boxShadow: "2px 2px 16.9px rgba(0,0,0,0.25)",
                fontSize: 18, fontWeight: 700,
                color: "#003c46",
                fontFamily: "'Nunito Sans', sans-serif",
                cursor: "pointer", zIndex: 2, opacity: 0,
              } : {
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

          {/* ═══════════════════════════════════════
              SIGNUP LAYER
          ═══════════════════════════════════════ */}
          <div
            ref={signupLayerRef}
            id="signup-layer"
            style={{
              position: "absolute", inset: 0, zIndex: 20,
              opacity: 0, pointerEvents: "none",
            }}
          >
            <div id="signup-bg" style={{ position: "absolute", inset: 0, background: "#ffffff" }} />
            <div id="signup-blobs">
              <div
                className="gradient-blob gradient-blob-coral"
                style={{
                  width: isMobile ? "100vw" : "80vw",
                  height: isMobile ? "100vw" : "80vw",
                  left: "-30%", top: "-30%",
                  transform: "rotate(-134.46deg)",
                }}
              />
              <div
                className="gradient-blob gradient-blob-mint"
                style={{
                  width: isMobile ? "90vw" : "70vw",
                  height: isMobile ? "90vw" : "70vw",
                  right: "-15%", bottom: "-20%",
                  left: "auto", top: "auto",
                  transform: "rotate(-134.46deg)",
                }}
              />
            </div>
            <div
              id="signup-glass"
              style={{
                position: "absolute",
                inset: isMobile ? 8 : "2.5% 1.6%",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "17.872px",
                boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex",
              flexDirection: isMobile ? "column" as const : "row" as const,
              alignItems: "center", justifyContent: "center",
              gap: isMobile ? 24 : "8%",
              padding: isMobile ? "60px 24px 24px" : "0 5%",
            }}>
              <div
                id="signup-icon"
                style={{
                  width: isMobile ? 100 : 219,
                  height: isMobile ? 100 : 219,
                  flexShrink: 0, position: "relative",
                }}
              >
                <Image src="/images/mentic-icon-orange.png" alt="Mentic" fill style={{ objectFit: "contain" }} />
              </div>
              <div
                id="signup-card"
                style={{
                  width: isMobile ? "100%" : 361,
                  maxWidth: 400,
                  background: "#ff6b5c",
                  borderRadius: "17.872px",
                  boxShadow: "3px 3px 10.3px rgba(0,0,0,0.25)",
                  padding: isMobile ? "24px 20px" : "32px 34px",
                  boxSizing: "border-box" as const,
                  flexShrink: 0,
                }}
              >
                <div style={{ marginBottom: isMobile ? 16 : 28 }}>
                  <div style={{ fontSize: isMobile ? 30 : 39, fontWeight: 700, color: "#003c46", lineHeight: 1.1 }}>
                    Sign
                  </div>
                  <div style={{ fontSize: isMobile ? 44 : 59, fontWeight: 700, color: "#8bf2d3", lineHeight: 1 }}>
                    UP
                  </div>
                </div>
                <form
                  id="signup-form"
                  onSubmit={(e) => { e.preventDefault(); closeSignup(); }}
                >
                  <div style={{
                    display: "flex", gap: isMobile ? 12 : 20,
                    marginBottom: isMobile ? 10 : 16,
                    flexDirection: isMobile ? "column" as const : "row" as const,
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>
                        Name:
                      </label>
                      <input className="modal-input" placeholder="John" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>
                        Surname:
                      </label>
                      <input className="modal-input" placeholder="Doe" />
                    </div>
                  </div>
                  <div style={{ marginBottom: isMobile ? 10 : 16 }}>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>
                      Email:
                    </label>
                    <input className="modal-input" type="email" placeholder="example@company.com" style={{ width: "100%" }} />
                  </div>
                  <div style={{ marginBottom: isMobile ? 14 : 24 }}>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>
                      Company:
                    </label>
                    <input className="modal-input" placeholder="Example Inc." style={{ width: "100%" }} />
                  </div>
                  <button type="submit" className="modal-submit">
                    Submit!
                  </button>
                </form>
              </div>
            </div>
            <button
              onClick={closeSignup}
              style={{
                position: "absolute",
                top: isMobile ? 12 : 20,
                left: isMobile ? 12 : 24,
                width: isMobile ? 44 : 50,
                height: isMobile ? 44 : 50,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                cursor: "pointer", zIndex: 25,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 200ms, transform 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#003c46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ── Loading screen ── */}
      <div
        ref={loaderRef}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "#ff6b5c",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16,
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
          style={{ fontSize: 32, color: "#8bf2d3", letterSpacing: "0.05em" }}
        >
          mentic
        </div>
      </div>
    </>
  );
}

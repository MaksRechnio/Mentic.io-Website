"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import emailjs from "@emailjs/browser";
gsap.registerPlugin(ScrollTrigger);

const EMAILJS_PUBLIC_KEY = "vL-JN3gWKUaXsCkWK";
const EMAILJS_SERVICE_ID = "service_43fsg3n";
const EMAILJS_TEMPLATE_USER = "template_6i6qlv1";
const EMAILJS_TEMPLATE_TEAM = "template_ahcl5qh";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbwB0LOjHm0kt2R0N367cmyaWWcsgDINtOz6kALaKsdFYZo3cnYESvsdJX64bNYSWeZc/exec";
const RECAPTCHA_SITE_KEY = "6Ldl23wsAAAAALU_SmSuijf2skLsOd6eZ74Dv4C2";

/* ── Desktop: Figma frame = 1491 × 967 px ── */
const X = (x: number) => `${(x / 1491) * 100}%`;
const Y = (y: number) => `${(y / 967) * 100}%`;
const W = (w: number) => `${(w / 1491) * 100}%`;
const H = (h: number) => `${(h / 967) * 100}%`;
const FS = (px: number) => `${(px / 1491) * 100}vw`;

/* ── Mobile: Figma frame = 393 × 852 px ── */
const MX = (x: number) => `${(x / 393) * 100}%`;
const MY = (y: number) => `${(y / 852) * 100}%`;
const MW = (w: number) => `${(w / 393) * 100}%`;
const MH = (h: number) => `${(h / 852) * 100}%`;
const MFS = (px: number) => `${(px / 393) * 100}vw`;

const TOTAL_FRAMES = 67;

export default function PreviewLanding() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const signupLayerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", company: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Load reCAPTCHA + init EmailJS ── */
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    if (!document.querySelector(`script[src*="recaptcha"]`)) {
      const s = document.createElement("script");
      s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    const { firstName, lastName, email, company } = formData;
    const errors: Record<string, boolean> = {};

    if (!firstName.trim()) errors.firstName = true;
    if (!lastName.trim()) errors.lastName = true;
    if (!email.trim() || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim())) errors.email = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.firstName || errors.lastName) setFormError(errors.email ? "Please fill in your name and a valid email." : "Please enter your full name.");
      else setFormError("Please enter a valid email address.");
      return;
    }

    setFormStatus("submitting");
    const timestamp = new Date().toISOString();

    try {
      const grecaptcha = (window as unknown as Record<string, unknown>).grecaptcha as { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } | undefined;
      let token = "";
      if (grecaptcha) {
        token = await new Promise<string>((resolve, reject) => {
          grecaptcha.ready(() => { grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "signup" }).then(resolve).catch(reject); });
        });
      }

      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), company: company.trim(), recaptchaToken: token, timestamp }),
      });

      const emailParams = {
        first_name: firstName.trim(), last_name: lastName.trim(),
        email: email.trim(), to_email: email.trim(), reply_to: email.trim(),
        company: company.trim() || "N/A", timestamp,
      };

      await Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_USER, emailParams),
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TEAM, emailParams),
      ]);

      setFormStatus("success");
      // Animate to success screen
      requestAnimationFrame(() => {
        const tl = gsap.timeline();
        tl.to("#signup-card", { opacity: 0, y: 40, scale: 0.9, duration: 0.4, ease: "power2.in" });
        tl.to("#signup-icon", { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" }, "<0.1");
        tl.set("#signup-card", { display: "none" });
        tl.set("#signup-icon", { display: "none" });
        tl.fromTo("#success-screen", { opacity: 0 }, { opacity: 1, duration: 0.01 });
        tl.fromTo("#success-icon", { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" });
        tl.fromTo("#success-logo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
        tl.fromTo("#success-message", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
        tl.fromTo("#success-socials", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
        // Auto-close after 10 seconds
        setTimeout(() => {
          setFormStatus("idle");
          setFormData({ firstName: "", lastName: "", email: "", company: "" });
          setFieldErrors({});
          setFormError("");
          gsap.set("#signup-card", { display: "block", opacity: 1, y: 0, scale: 1 });
          gsap.set("#signup-icon", { display: "block", opacity: 1 });
          gsap.set("#success-screen", { opacity: 0 });
          closeSignup();
        }, 10000);
      });
    } catch (err) {
      console.error("Signup error:", err);
      setFormStatus("error");
      setFormError("Something went wrong. Please try again.");
    }
  }, [formData]);

  const openSignup = useCallback(() => {
    if (!signupLayerRef.current) return;
    const signup = signupLayerRef.current;
    lenisRef.current?.stop();
    const tl = gsap.timeline();
    tl.set(signup, { opacity: 1, pointerEvents: "auto" });
    tl.fromTo("#signup-bg", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    tl.fromTo("#signup-blobs > div", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "<0.1");
    tl.fromTo("#signup-glass", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.1");
    const mob = window.innerWidth < 1024;
    tl.fromTo("#signup-icon", { opacity: 0, scale: 0.3, rotation: -90, ...(mob && { xPercent: -50 }) }, { opacity: 1, scale: 1, rotation: 0, ...(mob && { xPercent: -50 }), duration: 0.5, ease: "back.out(1.4)" }, "<0.1");
    tl.fromTo("#signup-card", { opacity: 0, x: 60, scale: 0.95, ...(mob && { xPercent: -50 }) }, { opacity: 1, x: 0, scale: 1, ...(mob && { xPercent: -50 }), duration: 0.5, ease: "power2.out" }, "<0.15");
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
    const mob = window.innerWidth < 1024;
    tl.to(signup.querySelectorAll("#signup-form > *"), { opacity: 0, y: -10, duration: 0.2, ease: "power2.in", stagger: 0.03 });
    tl.to(signup.querySelector("#signup-card"), { opacity: 0, x: 40, ...(mob && { xPercent: -50 }), duration: 0.3, ease: "power2.in" }, "<0.1");
    tl.to(signup.querySelector("#signup-icon"), { opacity: 0, scale: 0.5, ...(mob && { xPercent: -50 }), duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelector("#signup-glass"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelectorAll("#signup-blobs > div"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
    tl.to(signup.querySelector("#signup-bg"), { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
  }, []);

  /* ── Splash intro animation ── */
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;
    const icon = loader.querySelector("#splash-icon");
    const logo = loader.querySelector("#splash-logo");
    const btn = loader.querySelector("#splash-btn");
    const tagline = loader.querySelector("#splash-tagline");
    const blob1 = loader.querySelector("#splash-blob-1");
    const blob2 = loader.querySelector("#splash-blob-2");

    gsap.set([icon, logo, btn, tagline], { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(blob1, { opacity: 0, scale: 0.5 }, { opacity: 0.4, scale: 1, duration: 1.5, ease: "power2.out" });
    tl.fromTo(blob2, { opacity: 0, scale: 0.5 }, { opacity: 0.3, scale: 1, duration: 1.5, ease: "power2.out" }, "<0.2");
    tl.fromTo(icon, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2.5)" }, 0.3);
    tl.fromTo(logo, { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.out" }, "-=0.3");
    tl.fromTo(tagline, { opacity: 0, letterSpacing: "0.5em", y: 10 }, { opacity: 0.7, letterSpacing: "0.2em", y: 0, duration: 0.8, ease: "power2.out" }, "-=0.2");
    tl.fromTo(btn, { opacity: 0, scale: 0.5, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(3)" }, "-=0.3");

    // Gentle continuous blob drift
    gsap.to(blob1, { rotation: 360, duration: 40, repeat: -1, ease: "none" });
    gsap.to(blob2, { rotation: -360, duration: 50, repeat: -1, ease: "none" });

    // Subtle icon float
    gsap.to(icon, { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });

    // Tagline gentle opacity pulse
    gsap.to(tagline, { opacity: 0.5, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

    // Button border glow pulse
    gsap.to(btn, {
      boxShadow: "0 0 20px 2px rgba(139,242,211,0.15), inset 0 0 20px rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.5)",
      duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5,
    });

    return () => { tl.kill(); };
  }, []);

  /* ── Splash "Begin" handler ── */
  const handleBegin = useCallback(() => {
    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(15);

    // Scroll to top
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });

    // Cinematic exit
    const loader = loaderRef.current;
    const vp = viewportRef.current;
    if (!loader) return;
    const btn = loader.querySelector("#splash-btn");
    const icon = loader.querySelector("#splash-icon");
    const logo = loader.querySelector("#splash-logo");
    const tagline = loader.querySelector("#splash-tagline");

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(loader, { display: "none" });

        // Play hero entrance after splash is gone
        if (!vp) return;
        const heroLayer = vp.querySelector("#hero-layer") as HTMLElement;
        const heroCard = vp.querySelector("#hero-card") as HTMLElement;
        const heroIcon = vp.querySelector("#hero-icon") as HTMLElement;
        const heroAlpha = vp.querySelector("#hero-alpha") as HTMLElement;
        const heroLogo = vp.querySelector("#hero-logo") as HTMLElement;
        const heroHeadline = vp.querySelector("#hero-headline") as HTMLElement;
        const heroBtn = vp.querySelector("#hero-btn") as HTMLElement;

        // Hero layer is hidden in JSX (opacity:0). Set up initial states then animate.
        gsap.set(heroLayer, { opacity: 1 });
        gsap.set([heroCard, heroIcon, heroAlpha, heroLogo, heroHeadline, heroBtn], { opacity: 0 });
        gsap.set(heroCard, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(heroLogo, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(heroHeadline, { clipPath: "inset(0 0 100% 0)" });

        const hero = gsap.timeline();
        hero.to(heroCard, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power4.out" });
        hero.fromTo(heroIcon, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.5");
        hero.to(heroLogo, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.out" }, "-=0.4");
        hero.to(heroHeadline, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" }, "-=0.5");
        hero.fromTo(heroAlpha, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
        hero.fromTo(heroBtn, { opacity: 0, scale: 0.5, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.5)" }, "-=0.2");
        hero.call(() => sfxClick(), [], 0.4);
        hero.call(() => sfxClick(), [], 0.7);
      },
    });

    // Button collapses inward with a flash
    tl.to(btn, { scale: 0.85, duration: 0.08, ease: "power2.in" });
    tl.to(btn, { scale: 1.15, opacity: 0, duration: 0.25, ease: "power2.out" });

    // Logo and icon fly apart
    tl.to(icon, { scale: 1.3, opacity: 0, rotation: 90, duration: 0.4, ease: "power2.in" }, "-=0.15");
    tl.to(logo, { opacity: 0, clipPath: "inset(0 0 0 100%)", duration: 0.35, ease: "power2.in" }, "<");
    tl.to(tagline, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, "<");

    // Background sweeps away
    tl.to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power3.inOut" }, "-=0.1");
  }, []);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({ duration: 2.2, easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), smoothWheel: true });
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
        f(1), f(2), f(7), f(8), f(9), f(10),
        f(17), f(18), f(19), f(20),
        f(28), f(29), f(30), f(31),
        f(38), f(39), f(40), f(41), f(42), f(43),
        f(49), f(50), f(51), f(52),
        f(57), f(58), f(59),
        f(64), f(65), f(67),
      ];

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current, start: "top top", end: "bottom bottom", scrub: 1,
          snap: {
            snapTo: sectionStops,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power1.inOut",
            directional: true,
          },
        },
      });

      // Helper: schedule a click sound at the end of an element's appear animation
      const clk = (pos: number) => master.call(() => sfxClick(), [], pos + ds);

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

      /* ═══ Hero → Pain (exit mirrors entrance so scroll-back replays it) ═��═ */
      master.to(heroBtn, { opacity: 0, scale: 0.5, y: 20, duration: d1 * 1.2, ease: easeOut }, f(3));
      master.to(heroAlpha, { opacity: 0, y: 10, duration: d1 * 1.2, ease: easeOut }, f(3));
      master.to(heroHeadline, { opacity: 0, clipPath: "inset(0 0 100% 0)", duration: d1 * 1.5, ease: easeOut }, f(3.2));
      master.to(heroLogo, { opacity: 0, clipPath: "inset(0 100% 0 0)", duration: d1 * 1.5, ease: easeOut }, f(3.4));
      master.to(heroIcon, { opacity: 0, scale: 0, rotation: -180, duration: d1 * 1.5, ease: easeOut }, f(3.5));
      master.to(heroCard, { opacity: 0, clipPath: "inset(100% 0 0 0)", duration: d1 * 2, ease: easeOut }, f(3.8));
      master.to(heroCard, { backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "none", backdropFilter: "blur(12px)", duration: d1 * 2.5, ease }, f(3.5));
      master.to(heroLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 0.5, ease: easeOut }, f(5.5));
      master.to(painLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2.5, ease }, f(4));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(4));
      master.to(glassCard, { opacity: 1, duration: d1 * 2, ease }, f(4));

      /* ═══ Pain IN ═══ */
      master.fromTo(painText1, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(7));
      master.fromTo(painBlob, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: ds, ease }, f(7));
      clk(f(7));
      master.fromTo(painText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(8));
      master.fromTo(glassStrip1, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(8));
      clk(f(8));
      if (!mob) {
        master.to(painBlob, { width: W(1051), height: H(666), left: X(220), top: Y(813), duration: ds, ease }, f(8));
      } else {
        master.to(painBlob, { scale: 1.2, duration: ds, ease }, f(8));
      }
      master.fromTo(painText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(9));
      master.fromTo(glassStrip2, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(9));
      clk(f(9));
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
      master.to(painLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 1.5, ease }, f(13));
      master.to(bg, { backgroundColor: "#ff6b5c", duration: d1 * 3, ease }, f(13));
      master.to(calcLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2, ease }, f(14.5));

      /* ═══ Calc IN ═══ */
      master.fromTo(calcPanel, { opacity: 0 }, { opacity: 1, duration: ds, ease }, f(17));
      master.fromTo(calcHeading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(17));
      clk(f(17));
      master.fromTo(calcAmount, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: ds, ease }, f(18));
      master.fromTo(calcFifty, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: ds, ease }, f(18));
      clk(f(18));
      master.fromTo(calcFees, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: ds, ease }, f(19));
      master.fromTo(calcNotads, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(19));
      clk(f(19));

      /* Calc OUT */
      master.to(calcFees, { opacity: 0, x: 20, duration: ds, ease: easeOut }, f(21));
      master.to(calcNotads, { opacity: 0, y: -10, duration: ds, ease: easeOut }, f(21));
      master.to(calcAmount, { opacity: 0, scale: 0.9, duration: ds, ease: easeOut }, f(22));
      master.to(calcFifty, { opacity: 0, scale: 0.8, duration: ds, ease: easeOut }, f(22));
      master.to(calcPanel, { opacity: 0, duration: ds, ease: easeOut }, f(22));
      master.to(calcHeading, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(22));

      /* ═══ Calc → Solution ═══ */
      master.to(calcLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 1.5, ease }, f(23));
      master.to(iconTeal, { opacity: 0, duration: d1 * 1.5, ease }, f(23));
      master.to(bg, { backgroundColor: "#ffffff", duration: d1 * 3.5, ease }, f(23));
      master.fromTo(blobCoral, { opacity: 0 }, { opacity: 1, duration: d1 * 3, ease }, f(24));
      master.fromTo(blobMint, { opacity: 0 }, { opacity: 1, duration: d1 * 3, ease }, f(24));
      const blobDuration = f(67) - f(27);
      master.to(blobCoral, { rotation: 60, x: "5vw", y: "5vh", scale: 1.1, duration: blobDuration, ease: "none" }, f(27));
      master.to(blobMint, { rotation: -45, x: "-5vw", y: "-5vh", scale: 1.1, duration: blobDuration, ease: "none" }, f(27));
      master.to(solLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2, ease }, f(25));
      master.to(iconTeal, { opacity: 1, duration: d1 * 2, ease }, f(25.5));

      /* ═══ Solution IN ═══ */
      master.fromTo(solText1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(28));
      clk(f(28));
      master.fromTo(solText2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(29));
      clk(f(29));
      master.fromTo(solText3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: ds, ease }, f(30));
      clk(f(30));
      master.to(solText3, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(32));
      master.to(solText2, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(33));
      master.to(solText1, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(33));

      /* ═══ Solution → NO ═══ */
      master.to(solLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 2, ease }, f(34));
      master.to(noLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2, ease }, f(35.5));

      /* ═══ NO IN ═══ */
      master.fromTo(noText, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: ds, ease }, f(38));
      clk(f(38));
      master.fromTo(noItem1, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(39));
      clk(f(39));
      master.fromTo(noItem2, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(40));
      clk(f(40));
      master.fromTo(noItem3, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(41));
      clk(f(41));
      master.fromTo(noItem4, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: ds, ease }, f(42));
      master.fromTo(noDot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: ds, ease }, f(42));
      clk(f(42));
      master.to(noItem4, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noDot, { opacity: 0, scale: 0, duration: ds, ease: easeOut }, f(44));
      master.to(noItem3, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noItem2, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noItem1, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(44));
      master.to(noText, { opacity: 0, scale: 0.5, duration: ds, ease: easeOut }, f(45));

      /* ═══ NO → How ═══ */
      master.to(noLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 2, ease }, f(46));
      master.to(howLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2, ease }, f(46.5));

      /* ═══ How IN ═══ */
      master.fromTo(howStep1, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(49));
      clk(f(49));
      master.fromTo(howStep2, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(50));
      master.fromTo(howStep3, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: ds, ease }, f(50));
      clk(f(50));
      master.fromTo(howMentic, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: ds, ease }, f(51));
      master.fromTo(howRest, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: ds, ease }, f(51));
      clk(f(51));
      master.to(howStep3, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howStep2, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howStep1, { opacity: 0, y: -15, duration: ds, ease: easeOut }, f(53));
      master.to(howMentic, { opacity: 0, x: -30, duration: ds, ease: easeOut }, f(53));
      master.to(howRest, { opacity: 0, y: -10, duration: ds, ease: easeOut }, f(53));

      /* ═══ How → Value ═══ */
      master.to(howLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 2, ease }, f(54));
      master.to(valLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 2, ease }, f(54.5));

      /* ═══ Value IN ═══ */
      master.fromTo(valOne, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(57));
      clk(f(57));
      master.fromTo(valEvery, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(58));
      master.fromTo(valAll, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: ds, ease }, f(58));
      clk(f(58));
      master.to(valAll, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));
      master.to(valEvery, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));
      master.to(valOne, { opacity: 0, x: 30, duration: ds, ease: easeOut }, f(60));

      /* ═══ Value → CTA ═══ */
      master.to(valLayer, { opacity: 0, pointerEvents: "none", duration: d1 * 1.5, ease }, f(61));
      master.to(ctaLayer, { opacity: 1, pointerEvents: "auto", duration: d1 * 1.5, ease }, f(61.5));

      /* ═══ CTA IN ═══ */
      master.fromTo(ctaIcon, { opacity: 0, scale: 0.3, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: ds * 2, ease }, f(64));
      master.fromTo(ctaSign, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: ds, ease }, f(64));
      master.fromTo(ctaUp, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: ds, ease }, f(64));
      clk(f(64));
      master.fromTo(ctaNow, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: ds, ease }, f(65));
      master.fromTo(ctaAlpha, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ds, ease }, f(65));
      master.fromTo(ctaButton, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: ds, ease: "back.out(1.4)" }, f(65));
      clk(f(65));
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  /* ── Audio engine: ambient + SFX ── */
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode; fadeUntil: number } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swooshPlayedRef = useRef(false);

  // SFX functions — plain functions using refs, no closure issues
  function sfxClick() {
    try {
      // Haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(8);

      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      const ctx = a.ctx;
      const t = ctx.currentTime;

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.08, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      clickGain.connect(ctx.destination);

      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.15));
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2000;
      hp.Q.value = 1;
      noiseSrc.connect(hp).connect(clickGain);
      noiseSrc.start(t);
      noiseSrc.stop(t + 0.05);

      const ring = ctx.createOscillator();
      ring.type = "sine";
      ring.frequency.value = 3200 + Math.random() * 800;
      const ringGain = ctx.createGain();
      ringGain.gain.setValueAtTime(0.04, t);
      ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      ring.connect(ringGain).connect(ctx.destination);
      ring.start(t);
      ring.stop(t + 0.08);
    } catch (e) { /* silent */ }
  }

  function sfxSwoosh() {
    try {
      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      // Only play once per scroll session — reset when scrolling stops
      if (swooshPlayedRef.current) return;
      swooshPlayedRef.current = true;

      const ctx = a.ctx;
      const t = ctx.currentTime;
      const dur = 0.15;
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(600, t);
      bp.frequency.linearRampToValueAtTime(1200, t + dur);
      bp.Q.value = 0.5;
      const sg = ctx.createGain();
      sg.gain.value = 0.025;
      src.connect(bp).connect(sg).connect(ctx.destination);
      src.start(t);
      src.stop(t + dur);
    } catch (e) { /* silent */ }
  }

  // Soft tonal hover sound — gentle rising tone for button interactions
  function sfxHover() {
    try {
      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      if (navigator.vibrate) navigator.vibrate(5);
      const ctx = a.ctx;
      const t = ctx.currentTime;
      const dur = 0.12;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + dur);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.03, t);
      g.gain.linearRampToValueAtTime(0.05, t + dur * 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2000;
      lp.Q.value = 0.7;

      osc.connect(lp).connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) { /* silent */ }
  }

  // Satisfying button press sound — descending tone + thump to complement the hover's rising tone
  function sfxPress() {
    try {
      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      if (navigator.vibrate) navigator.vibrate(10);
      const ctx = a.ctx;
      const t = ctx.currentTime;

      // Descending sine tone (inverse of hover's rising tone)
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2500;
      osc.connect(lp).connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);

      // Short low thump for weight
      const thump = ctx.createOscillator();
      thump.type = "sine";
      thump.frequency.setValueAtTime(180, t);
      thump.frequency.exponentialRampToValueAtTime(80, t + 0.06);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.05, t);
      tg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      thump.connect(tg).connect(ctx.destination);
      thump.start(t);
      thump.stop(t + 0.06);
    } catch (e) { /* silent */ }
  }

  // Subtle mechanical key-press sound for typing in inputs
  function sfxType() {
    try {
      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      const ctx = a.ctx;
      const t = ctx.currentTime;

      // Soft key tap — louder, less harsh
      const dur = 0.04 + Math.random() * 0.02; // 40-60ms, slight variation
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.15));
      const src = ctx.createBufferSource();
      src.buffer = buf;

      // Lower bandpass = softer, less metallic
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2000 + Math.random() * 1000; // 2000-3000Hz, warmer
      bp.Q.value = 0.8;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.08, t); // louder
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(t);
      src.stop(t + dur);
    } catch (e) { /* silent */ }
  }

  useEffect(() => {
    const BASE_VOL = 0.12;
    const SCROLL_VOL = 0.25;

    // Create AudioContext once, reuse across all resume attempts
    function getOrCreateCtx(): AudioContext {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      return audioCtxRef.current;
    }

    function initOscillators(ctx: AudioContext) {
      // Already initialized
      if (audioRef.current) return;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // Drone: 174Hz + 174.5Hz
      [174, 174.5].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = 0.3;
        osc.connect(g).connect(master);
        osc.start();
      });

      // Pad: 262Hz triangle + swept lowpass
      const pad = ctx.createOscillator();
      pad.type = "triangle";
      pad.frequency.value = 262;
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = "lowpass";
      padFilter.frequency.value = 450;
      padFilter.Q.value = 1;
      const padGain = ctx.createGain();
      padGain.gain.value = 0.18;
      pad.connect(padFilter).connect(padGain).connect(master);
      pad.start();

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.04;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 150;
      lfo.connect(lfoG).connect(padFilter.frequency);
      lfo.start();

      // Shimmer: 392Hz + vibrato
      const shimmer = ctx.createOscillator();
      shimmer.type = "sine";
      shimmer.frequency.value = 392;
      const shimG = ctx.createGain();
      shimG.gain.value = 0.05;
      shimmer.connect(shimG).connect(master);
      shimmer.start();

      const vib = ctx.createOscillator();
      vib.type = "sine";
      vib.frequency.value = 2;
      const vibG = ctx.createGain();
      vibG.gain.value = 2;
      vib.connect(vibG).connect(shimmer.frequency);
      vib.start();

      // Warm noise
      const bufSize = ctx.sampleRate * 2;
      const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) nd[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const nf = ctx.createBiquadFilter();
      nf.type = "lowpass";
      nf.frequency.value = 400;
      nf.Q.value = 0.7;
      const ng = ctx.createGain();
      ng.gain.value = 0.05;
      noise.connect(nf).connect(ng).connect(master);
      noise.start();

      audioRef.current = { ctx, gain: master, fadeUntil: ctx.currentTime + 4 };
      master.gain.setTargetAtTime(BASE_VOL, ctx.currentTime, 1.0);
    }

    // Resume AudioContext and init oscillators — uses .then() to catch async resume
    function tryStartAudio() {
      try {
        const ctx = getOrCreateCtx();

        if (ctx.state === "running") {
          initOscillators(ctx);
          return;
        }

        if (ctx.state === "suspended") {
          ctx.resume().then(() => {
            if (ctx.state === "running") initOscillators(ctx);
          }).catch(() => {});
        }
      } catch (e) { /* silent */ }
    }

    function onScrollActivity() {
      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      if (a.ctx.currentTime < a.fadeUntil) return;
      a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
      a.gain.gain.setTargetAtTime(SCROLL_VOL, a.ctx.currentTime, 0.12);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const a2 = audioRef.current;
        if (!a2 || a2.ctx.state !== "running") return;
        a2.gain.gain.cancelScheduledValues(a2.ctx.currentTime);
        a2.gain.gain.setTargetAtTime(BASE_VOL, a2.ctx.currentTime, 0.4);
        // Reset swoosh flag when scrolling stops
        swooshPlayedRef.current = false;
      }, 200);
    }

    function onGesture() {
      tryStartAudio();
    }

    function onWheel() {
      tryStartAudio();
      onScrollActivity();
      try {
        const a = audioRef.current;
        if (a && a.ctx.currentTime >= a.fadeUntil) sfxSwoosh();
      } catch (e) { /* silent */ }
    }

    // Register only real user-activation events (NOT mousemove — it can't unlock AudioContext)
    document.addEventListener("click", onGesture);
    document.addEventListener("pointerdown", onGesture);
    document.addEventListener("keydown", onGesture);
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScrollActivity, { passive: true });

    return () => {
      document.removeEventListener("click", onGesture);
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("keydown", onGesture);
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScrollActivity);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  /* ── Custom cursor ── */
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLineRef1 = useRef<HTMLDivElement>(null);
  const cursorLineRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return; // No custom cursor on mobile/touch
    const cursor = cursorRef.current;
    const line1 = cursorLineRef1.current;
    const line2 = cursorLineRef2.current;
    if (!cursor || !line1 || !line2) return;

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;
    let hovering = false;
    let raf: number;

    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.closest("a, button, [role='button'], input, textarea, select, .modal-submit, [style*='cursor']");
      if (isInteractive && !hovering) {
        hovering = true;
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        cursor.style.borderRadius = "50%";
        cursor.style.background = "#ff6b5c";
        line1.style.opacity = "0";
        line2.style.opacity = "0";
        line1.style.transform = "rotate(45deg) scaleX(0)";
        line2.style.transform = "rotate(-45deg) scaleX(0)";
      } else if (!isInteractive && hovering) {
        hovering = false;
        cursor.style.width = "24px";
        cursor.style.height = "24px";
        cursor.style.borderRadius = "0";
        cursor.style.background = "transparent";
        line1.style.opacity = "1";
        line2.style.opacity = "1";
        line1.style.transform = "rotate(45deg) scaleX(1)";
        line2.style.transform = "rotate(-45deg) scaleX(1)";
      }
    };

    const tick = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX - 12}px, ${curY - 12}px)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const m = isMobile;

  return (
    <>
      {/* Custom cursor (desktop only) */}
      {!m && (
        <div ref={cursorRef} style={{
          position: "fixed", top: 0, left: 0, width: 24, height: 24,
          pointerEvents: "none", zIndex: 99999,
          transition: "width 0.3s cubic-bezier(0.25,1,0.5,1), height 0.3s cubic-bezier(0.25,1,0.5,1), border-radius 0.3s cubic-bezier(0.25,1,0.5,1), background 0.3s cubic-bezier(0.25,1,0.5,1)",
          transform: "translate(-100px, -100px)",
        }}>
          <div ref={cursorLineRef1} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 22, height: 3, marginLeft: -11, marginTop: -1.5,
            background: "#003c46", borderRadius: 2,
            transform: "rotate(45deg) scaleX(1)",
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.25,1,0.5,1)",
          }} />
          <div ref={cursorLineRef2} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 22, height: 3, marginLeft: -11, marginTop: -1.5,
            background: "#003c46", borderRadius: 2,
            transform: "rotate(-45deg) scaleX(1)",
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.25,1,0.5,1)",
          }} />
        </div>
      )}
      <div ref={wrapperRef} style={{ height: `${TOTAL_FRAMES * 23}vh`, position: "relative" }}>
        <div ref={viewportRef} style={{ position: "sticky", top: 0, width: "100vw", height: "100dvh", overflow: "hidden" }}>

          {/* ── Background — fixed so it covers behind iOS browser chrome ── */}
          <div id="bg" style={{ position: "fixed", inset: "-5vh -5vw", backgroundColor: "#ffe5e5", zIndex: 0 }} />

          {/* ── Persistent teal icon ── */}
          <button
            id="icon-teal"
            onClick={() => {
              sfxPress();
              const vp = viewportRef.current;
              if (!vp) return;

              // 1. Stop Lenis so it doesn't animate the scroll
              lenisRef.current?.stop();

              // 2. Hide entire viewport instantly (no visible scroll)
              gsap.set(vp, { opacity: 0 });

              // 3. Teleport to top — no scroll events since viewport is hidden
              window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

              // 4. Reset all layers to initial state (hero visible, others hidden)
              const allLayers = ["#pain-layer", "#calc-layer", "#sol-layer", "#no-layer", "#how-layer", "#val-layer", "#cta-layer"];
              allLayers.forEach(sel => {
                const el = vp.querySelector(sel) as HTMLElement;
                if (el) gsap.set(el, { opacity: 0, pointerEvents: "none" });
              });
              gsap.set(vp.querySelector("#glass-card"), { opacity: 0 });
              gsap.set(vp.querySelector("#icon-teal"), { opacity: 0 });
              gsap.set(vp.querySelector("#bg"), { backgroundColor: "#ffe5e5" });

              // Reset hero to visible
              const heroEls = ["#hero-card", "#hero-icon", "#hero-alpha", "#hero-headline", "#hero-logo", "#hero-btn"];
              heroEls.forEach(sel => {
                const el = vp.querySelector(sel) as HTMLElement;
                if (el) gsap.set(el, { opacity: 1, clearProps: "clipPath,scale,rotation,x,y,pointerEvents" });
              });
              gsap.set(vp.querySelector("#hero-layer"), { opacity: 1, pointerEvents: "auto" });
              gsap.set(vp.querySelector("#hero-card"), { backgroundColor: "#ff6b5c", clipPath: "none", boxShadow: "0 6px 32px rgba(0,0,0,0.08)", backdropFilter: "none" });

              // 5. Show viewport, replay hero entrance animation, restart Lenis
              requestAnimationFrame(() => {
                gsap.set(vp, { opacity: 1 });
                ScrollTrigger.refresh();
                lenisRef.current?.start();

                // Replay hero entrance animation (same as handleBegin onComplete)
                const heroLayer = vp.querySelector("#hero-layer") as HTMLElement;
                const heroCard = vp.querySelector("#hero-card") as HTMLElement;
                const heroIcon = vp.querySelector("#hero-icon") as HTMLElement;
                const heroAlpha = vp.querySelector("#hero-alpha") as HTMLElement;
                const heroLogo = vp.querySelector("#hero-logo") as HTMLElement;
                const heroHeadline = vp.querySelector("#hero-headline") as HTMLElement;
                const heroBtn = vp.querySelector("#hero-btn") as HTMLElement;

                gsap.set(heroLayer, { opacity: 1 });
                gsap.set([heroCard, heroIcon, heroAlpha, heroLogo, heroHeadline, heroBtn], { opacity: 0 });
                gsap.set(heroCard, { clipPath: "inset(100% 0 0 0)" });
                gsap.set(heroLogo, { clipPath: "inset(0 100% 0 0)" });
                gsap.set(heroHeadline, { clipPath: "inset(0 0 100% 0)" });

                const hero = gsap.timeline();
                hero.to(heroCard, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power4.out" });
                hero.fromTo(heroIcon, { opacity: 0, scale: 0, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.5");
                hero.to(heroLogo, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.out" }, "-=0.4");
                hero.to(heroHeadline, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" }, "-=0.5");
                hero.fromTo(heroAlpha, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
                hero.fromTo(heroBtn, { opacity: 0, scale: 0.5, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.5)" }, "-=0.2");
                hero.call(() => sfxClick(), [], 0.4);
                hero.call(() => sfxClick(), [], 0.7);
              });
            }}
            style={{
              position: "absolute",
              top: m ? MY(25) : Y(53), left: m ? MX(32) : X(61),
              width: m ? MW(65) : W(65), height: "auto",
              zIndex: 10, opacity: 0,
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
              transition: "transform 300ms cubic-bezier(0.165, 0.84, 0.44, 1), filter 300ms ease",
            }}
            onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.transform = "scale(1.12) rotate(-8deg)"; e.currentTarget.style.filter = "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25)) drop-shadow(0 0 12px rgba(139,242,211,0.4))"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) rotate(0)"; e.currentTarget.style.filter = "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))"; }}
          >
            <Image src="/images/mentic-icon-teal.png" alt="Mentic" width={65} height={65} style={{ width: "100%", height: "auto" }} />
          </button>

          {/* ── Persistent glass card ── */}
          <div
            id="glass-card"
            style={{
              position: "absolute",
              top: m ? MY(15) : Y(20), left: m ? MX(16) : X(24),
              width: m ? MW(362) : W(1443), height: m ? MH(822) : H(919),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: m ? "10.012px" : "17.872px",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
              zIndex: 1, opacity: 0,
            }}
          />

          {/* ── Glass strips (desktop only) ── */}
          {!m && (
            <>
              <div id="glass-strip-1" style={{ position: "absolute", left: X(24), top: Y(229), width: W(984), height: H(152), background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0 12px 12px 0", zIndex: 2, opacity: 0 }} />
              <div id="glass-strip-2" style={{ position: "absolute", left: X(24), top: Y(652), width: W(984), height: H(141), background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0 12px 12px 0", zIndex: 2, opacity: 0 }} />
            </>
          )}
          {m && (
            <>
              <div id="glass-strip-1" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              <div id="glass-strip-2" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
            </>
          )}

          {/* ── Gradient blobs ── */}
          <div id="blob-coral" className="gradient-blob gradient-blob-coral" style={{ width: m ? "100vw" : "80vw", height: m ? "100vw" : "80vw", left: "-30%", top: "-20%", opacity: 0, zIndex: 1 }} />
          <div id="blob-mint" className="gradient-blob gradient-blob-mint" style={{ width: m ? "90vw" : "70vw", height: m ? "90vw" : "70vw", right: "-20%", bottom: "-25%", left: "auto", top: "auto", opacity: 0, zIndex: 1 }} />

          {/* ═══ HERO LAYER ═══ */}
          <div id="hero-layer" style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "auto", opacity: 0 }}>
            <div id="hero-card" style={{
              position: "absolute",
              top: m ? MY(15) : Y(24), left: m ? MX(16) : X(26),
              width: m ? MW(362) : W(1443), height: m ? MH(822) : H(919),
              background: "#ff6b5c", borderRadius: m ? "16.698px" : "17.872px",
              boxShadow: m
                ? "0 4px 24px rgba(0,0,0,0.08)"
                : "0 6px 32px rgba(0,0,0,0.08)",
            }} />
            <Image id="hero-icon" src="/images/mentic-icon-mint.png" alt="Mentic" width={65} height={65} style={{
              position: "absolute",
              top: m ? MY(33) : Y(51), left: m ? MX(41) : X(61),
              width: m ? MW(65) : W(65), height: "auto", zIndex: 2,
              filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.25))",
            }} />
            <div id="hero-alpha" style={{
              position: "absolute",
              top: m ? MY(42) : Y(72), right: m ? undefined : X(1491 - 1164 - 229.913),
              left: m ? MX(229) : undefined,
              display: "flex", gap: m ? 14 : 18, alignItems: "center",
              zIndex: 2,
            }}>
              {/* Instagram */}
              <a href="https://www.instagram.com/mentic.io/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", opacity: 0.7, transition: "opacity 200ms, transform 200ms" }}
                onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "scale(1)"; }}>
                <svg width={m ? 22 : 26} height={m ? 22 : 26} viewBox="0 0 24 24" fill="none" stroke="#8bf2d3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#8bf2d3" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/mentic-io" target="_blank" rel="noopener noreferrer" style={{ display: "flex", opacity: 0.7, transition: "opacity 200ms, transform 200ms" }}
                onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "scale(1)"; }}>
                <svg width={m ? 22 : 26} height={m ? 22 : 26} viewBox="0 0 24 24" fill="none" stroke="#8bf2d3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://x.com/Mentic_io" target="_blank" rel="noopener noreferrer" style={{ display: "flex", opacity: 0.7, transition: "opacity 200ms, transform 200ms" }}
                onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "scale(1)"; }}>
                <svg width={m ? 20 : 24} height={m ? 20 : 24} viewBox="0 0 24 24" fill="#8bf2d3">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <div id="hero-headline" style={{
              position: "absolute",
              top: m ? MY(330) : Y(381), left: m ? MX(110) : X(850),
              width: m ? MW(249) : W(544),
              fontSize: m ? MFS(28.444) : FS(40), fontWeight: 300,
              color: "#faf9f6", lineHeight: 1.25, zIndex: 2,
            }}>
              The{" "}
              <span style={{ fontWeight: 600 }}>A</span>
              <span style={{ fontWeight: 700 }}>utonomous </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>Advertising Agent</span>
              <span style={{ fontWeight: 300 }}> for your business.</span>
            </div>
            <div id="hero-logo" className="font-qurova" style={{
              position: "absolute",
              top: m ? MY(666) : Y(700), left: m ? MX(40) : X(94),
              width: m ? MW(312) : W(775),
              fontSize: m ? MFS(94.736) : FS(235.633),
              color: "#8bf2d3", lineHeight: 0.87, zIndex: 2,
              textAlign: m ? "center" as const : undefined,
            }}>
              mentic
            </div>
            <button onClick={() => { sfxPress(); openSignup(); }} id="hero-btn" style={{
              position: "absolute",
              top: m ? MY(493) : Y(774), left: m ? MX(177) : X(1164),
              width: m ? MW(165.338) : W(229.913), height: m ? MH(64.838) : H(90.162),
              background: "white", border: "2px solid transparent",
              borderRadius: m ? MFS(43.226) : "60.108px",
              boxShadow: "4.508px 4.508px 24.795px rgba(0,0,0,0.13), inset -1.503px -1.503px 17.131px rgba(0,0,0,0.11)",
              fontSize: m ? MFS(21.613) : FS(30.054), fontWeight: 700,
              color: "#003c46", letterSpacing: "0.9px", cursor: "pointer", zIndex: 2,
              fontFamily: "'Nunito Sans', sans-serif",
              transition: "all 350ms cubic-bezier(0.165, 0.84, 0.44, 1)",
            }}
              onMouseEnter={(e) => {
                sfxHover();
                const el = e.currentTarget;
                el.style.transform = "scale(1.08) translateY(-3px)";
                el.style.boxShadow = "0 8px 32px rgba(139,242,211,0.4), 0 0 20px rgba(139,242,211,0.25), inset -1.503px -1.503px 17.131px rgba(0,0,0,0.11)";
                el.style.borderColor = "#8bf2d3";
                el.style.background = "#f0fdf8";
                el.style.letterSpacing = "2px";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1) translateY(0)";
                el.style.boxShadow = "4.508px 4.508px 24.795px rgba(0,0,0,0.13), inset -1.503px -1.503px 17.131px rgba(0,0,0,0.11)";
                el.style.borderColor = "transparent";
                el.style.background = "white";
                el.style.letterSpacing = "0.9px";
              }}
            >
              Sign up!
            </button>
          </div>

          {/* ═══ PAIN LAYER ═══ */}
          <div id="pain-layer" style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 0, pointerEvents: "none" }}>
            <div id="pain-blob" className="gradient-blob gradient-blob-coral" style={{
              position: "absolute",
              width: m ? MW(304) : W(836), height: m ? MH(334) : H(544),
              left: m ? MX(45) : X(328), top: m ? MY(259) : Y(208),
              transform: "rotate(-90deg)",
            }} />
            <div id="pain-text-1" style={{
              position: "absolute",
              top: m ? MY(287) : Y(251), left: m ? MX(65) : X(294),
              width: m ? MW(240) : W(485),
              fontSize: m ? MFS(16) : FS(35), fontWeight: 300,
              color: "#003c46", lineHeight: 1.3, zIndex: 3, opacity: 0,
            }}>
              <span style={{ fontWeight: 700 }}>$3K–$10K</span>/month in{" "}
              <span style={{ fontWeight: 700 }}>retainers</span>.
              <br />
              <span style={{ fontWeight: 700 }}>Before</span> any{" "}
              <span style={{ fontWeight: 700 }}>ads</span> run.
            </div>
            <div id="pain-text-2" style={{
              position: "absolute",
              top: m ? MY(393) : Y(439), left: m ? MX(65) : X(294),
              width: m ? MW(273) : W(588),
              fontSize: m ? MFS(16) : FS(35), fontWeight: 500,
              color: "#003c46", lineHeight: 1.35, zIndex: 3, opacity: 0,
            }}>
              Your <span style={{ fontWeight: 800 }}>ad budget</span> pays for
              <span style={{ fontWeight: 300 }}> your agency</span>{" "}
              <span style={{ fontWeight: 800 }}>before</span> it pays for a{" "}
              <span style={{ fontWeight: 800 }}>single</span> ad.
            </div>
            <div id="pain-text-3" style={{
              position: "absolute",
              top: m ? MY(522) : Y(663), left: m ? MX(65) : X(294),
              width: m ? MW(298) : W(679),
              fontSize: m ? MFS(16) : FS(35), fontWeight: 300,
              color: "#003c46", lineHeight: 1.3, zIndex: 3, opacity: 0,
            }}>
              Then <span style={{ fontWeight: 700 }}>10–20%</span> of your{" "}
              <span style={{ fontWeight: 700 }}>ad spend</span> on top.
              <br />
              The <span style={{ fontWeight: 700 }}>more</span> you{" "}
              <span style={{ fontWeight: 700 }}>invest</span>, the{" "}
              <span style={{ fontWeight: 700 }}>more</span> they{" "}
              <span style={{ fontWeight: 700 }}>take</span>.
            </div>
          </div>

          {/* ═══ CALC LAYER ═══ */}
          <div id="calc-layer" style={{ position: "absolute", inset: 0, zIndex: 6, opacity: 0, pointerEvents: "none" }}>
            <div id="calc-panel" style={{
              position: "absolute",
              top: m ? MY(15) : Y(20), right: m ? undefined : X(24),
              left: m ? MX(111) : undefined,
              width: m ? MW(267) : W(685), height: m ? MH(251) : H(357),
              background: "#ff6b5c",
              borderRadius: m ? "0 0 0 50px" : "0 0 0 100px",
              zIndex: 2, opacity: 0,
            }} />
            <div id="calc-heading" style={{
              position: "absolute",
              top: m ? MY(90) : Y(79), left: m ? MX(142) : X(904),
              width: m ? MW(236) : W(508),
              fontSize: m ? MFS(20) : FS(40), color: "white", lineHeight: 1.3,
              zIndex: 3, opacity: 0,
            }}>
              <span style={{ fontWeight: 400 }}>MONTHLY </span>
              <span style={{ fontWeight: 700, color: "#8bf2d3" }}>ADVERTISING </span>
              <span style={{ fontWeight: 700 }}>BUDGET?</span>
            </div>
            <div id="calc-amount" style={{
              position: "absolute",
              top: m ? MY(176) : Y(199), left: m ? MX(142) : X(903),
              width: m ? MW(214) : W(509),
              fontSize: m ? MFS(40) : FS(80), fontWeight: 800, lineHeight: 1,
              zIndex: 3, opacity: 0,
            }}>
              <span style={{ color: "#8bf2d3" }}>6 000</span>
              <span style={{ color: "white" }}> USD</span>
            </div>
            <div id="calc-fifty" style={{
              position: "absolute",
              top: m ? MY(495) : Y(580), left: m ? MX(61) : X(70),
              width: m ? MW(271) : W(730),
              fontSize: m ? MFS(120) : FS(315.261), fontWeight: 700,
              color: "white", lineHeight: 1, zIndex: 3, opacity: 0,
            }}>
              50%
            </div>
            <div id="calc-fees" style={{
              position: "absolute",
              top: m ? MY(631) : Y(575), left: m ? MX(71) : X(800),
              width: m ? MW(251) : W(452.715),
              fontSize: m ? MFS(27.943) : FS(50.442), fontWeight: 400,
              color: "white", lineHeight: 1.3, zIndex: 3, opacity: 0,
            }}>
              of your cost is <span style={{ fontWeight: 700 }}>management</span> fees.
            </div>
            <div id="calc-notads" style={{
              position: "absolute",
              top: m ? MY(714) : Y(730), left: m ? MX(71) : X(800),
              width: m ? MW(251) : W(537.205),
              fontSize: m ? MFS(55) : FS(104.814), fontWeight: 800,
              zIndex: 3, opacity: 0,
            }}>
              <span style={{ color: "#8bf2d3" }}>NOT</span>
              <span style={{ color: "white" }}> </span>
              <span style={{ color: "white", fontWeight: 600 }}>ADS</span>
            </div>
          </div>

          {/* ═══ SOLUTION LAYER ═══ */}
          <div id="sol-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
            <div id="sol-text-1" style={{
              position: "absolute",
              top: m ? MY(663) : Y(698), left: m ? MX(44) : X(94),
              width: m ? MW(324) : W(717),
              fontSize: m ? MFS(31.632) : FS(70), fontWeight: 700,
              color: "#003c46", lineHeight: 1.3, zIndex: 2, opacity: 0,
            }}>
              Your budget{" "}
              <span style={{ color: "#ff6b5c" }}>doesn&apos;t</span> have to
              be <span style={{ color: "#ff6b5c" }}>wasted</span>.
            </div>
            <div id="sol-text-2" style={{
              position: "absolute",
              top: m ? MY(299) : Y(307), left: m ? MX(84) : X(781),
              width: m ? MW(279) : W(596),
              fontSize: m ? MFS(16) : FS(30), fontWeight: 300,
              color: "#1e1e1e", lineHeight: 1.4, zIndex: 2, opacity: 0,
            }}>
              Mentic <span style={{ fontWeight: 500 }}>builds</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>strategy</span>,{" "}
              <span style={{ fontWeight: 500 }}>launches</span> your{" "}
              <span style={{ color: "#ff6b5c", fontWeight: 700 }}>campaigns</span>, and{" "}
              <span style={{ fontWeight: 700 }}>optimises</span> them autonomously.
            </div>
            <div id="sol-text-3" style={{
              position: "absolute",
              top: m ? MY(390) : Y(456), left: m ? MX(152) : X(1061),
              width: m ? MW(226) : W(320),
              fontSize: m ? MFS(16) : FS(24), fontWeight: 200,
              color: "#1e1e1e", lineHeight: 1.35, zIndex: 2, opacity: 0,
            }}>
              with <span style={{ fontWeight: 500 }}>intelligence</span> based on a vast{" "}
              <span style={{ fontWeight: 800, color: "#ff6b5c" }}>agentic</span> infrastructure.
            </div>
          </div>

          {/* ═══ NO LAYER ═══ */}
          <div id="no-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
            <div id="no-text" style={{
              position: "absolute",
              top: m ? MY(264) : Y(545.12), left: m ? MX(64) : X(61),
              width: m ? MW(266) : W(692.509),
              fontSize: m ? MFS(171.337) : FS(446.06), fontWeight: 700,
              color: "#ff6b5c", lineHeight: 0.75, zIndex: 2, opacity: 0,
            }}>
              NO
            </div>
            <div id="no-item-1" style={{
              position: "absolute",
              top: m ? MY(415) : Y(544), left: m ? MX(76) : X(768.01),
              fontSize: m ? MFS(28) : FS(55.758), fontWeight: 500,
              color: "#ff6b5c", zIndex: 2, opacity: 0,
            }}>
              Retainers,
            </div>
            <div id="no-item-2" style={{
              position: "absolute",
              top: m ? MY(464) : Y(623.18), left: m ? MX(76) : X(768.01),
              fontSize: m ? MFS(28) : FS(55.758), fontWeight: 500,
              color: "#003c46", zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontWeight: 800 }}>%</span> of spend,
            </div>
            <div id="no-item-3" style={{
              position: "absolute",
              top: m ? MY(512) : Y(697.89), left: m ? MX(76) : X(768.01),
              fontSize: m ? MFS(28) : FS(55.758), fontWeight: 500,
              color: "#ff6b5c", zIndex: 2, opacity: 0,
            }}>
              Agency,
            </div>
            <div id="no-item-4" style={{
              position: "absolute",
              top: m ? MY(561) : Y(784.87), left: m ? MX(76) : X(768.01),
              fontSize: m ? MFS(28) : FS(55.758),
              color: "#003c46", zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontWeight: 600 }}>Expertise</span>{" "}
              <span style={{ fontWeight: 500 }}>needed</span>
            </div>
            <div id="no-dot" style={{
              position: "absolute",
              top: m ? MY(374) : Y(822.79), left: m ? MX(330) : X(1231.91),
              width: m ? MFS(22.303) : FS(22.303), height: m ? MFS(22.303) : FS(22.303),
              borderRadius: "50%", background: "#003c46", zIndex: 2, opacity: 0,
            }} />
          </div>

          {/* ═══ HOW LAYER ═══ */}
          <div id="how-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
            <div id="how-step-1" style={{
              position: "absolute",
              top: m ? MY(262) : Y(338), left: m ? MX(70) : X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: m ? MFS(36.234) : FS(59.935), fontWeight: 600 }}>Tell</span>
              <span style={{ fontSize: m ? MFS(20.705) : FS(34.248), fontWeight: 300 }}> it your goal</span>
            </div>
            <div id="how-step-2" style={{
              position: "absolute",
              top: m ? MY(339) : Y(463), left: m ? MX(70) : X(265.86),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: m ? MFS(36.234) : FS(59.935), fontWeight: 600 }}>Set</span>
              <span style={{ fontSize: m ? MFS(20.705) : FS(34.248), fontWeight: 300 }}> your budget</span>
            </div>
            <div id="how-step-3" style={{
              position: "absolute",
              top: m ? MY(414) : Y(587.16), left: m ? MX(70) : X(265),
              zIndex: 2, opacity: 0, color: "#003c46",
            }}>
              <span style={{ fontSize: m ? MFS(36.234) : FS(59.935), fontWeight: 600 }}>Add</span>
              <span style={{ fontSize: m ? MFS(20.705) : FS(34.248), fontWeight: 300 }}> your creatives</span>
            </div>
            <div id="how-mentic" className="font-qurova" style={{
              position: "absolute",
              top: m ? MY(643) : Y(441), left: m ? MX(65) : X(863),
              width: m ? MW(283) : W(411),
              fontSize: m ? MFS(83.927) : FS(121.708),
              color: "#ff6b5c", lineHeight: 0.9, textAlign: "center",
              zIndex: 2, opacity: 0,
            }}>
              mentic
            </div>
            <div id="how-rest" style={{
              position: "absolute",
              top: m ? MY(701) : Y(547.73), left: m ? MX(70) : X(872.36),
              width: m ? MW(229) : W(306.143),
              fontSize: m ? MFS(34.787) : FS(46.493), color: "#ff6b5c",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontWeight: 700 }}>does</span>{" "}
              <span style={{ fontWeight: 400 }}>the</span>{" "}
              <span style={{ fontWeight: 300 }}>rest.</span>
            </div>
          </div>

          {/* ═══ VALUE LAYER ═══ */}
          <div id="val-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
            <div id="val-one" style={{
              position: "absolute",
              top: m ? MY(310) : Y(287), left: m ? MX(44) : X(301),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: m ? MFS(40) : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ONE</span>
              <span style={{ fontSize: m ? MFS(24) : FS(47.425), fontWeight: 300, color: "#1e1e1e", marginLeft: "0.3em" }}>subscription.</span>
            </div>
            <div id="val-every" style={{
              position: "absolute",
              top: m ? MY(418) : Y(455.75), left: m ? MX(49) : X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: m ? MFS(48) : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>EVERY</span>
              <span style={{ fontSize: m ? MFS(18) : FS(47.425), fontWeight: 300, color: "black", marginLeft: "0.3em" }}>
                dollar <span style={{ fontWeight: 500 }}>spend</span> on ads.
              </span>
            </div>
            <div id="val-all" style={{
              position: "absolute",
              top: m ? MY(529) : Y(624.5), left: m ? MX(49) : X(314),
              display: "flex", alignItems: "baseline",
              zIndex: 2, opacity: 0,
            }}>
              <span style={{ fontSize: m ? MFS(48) : FS(80.683), fontWeight: 800, color: "#ff6b5c" }}>ALL</span>
              <span style={{ fontSize: m ? MFS(16) : FS(47.425), fontWeight: 300, color: "black", marginLeft: "0.3em" }}>
                advertising <span style={{ fontWeight: 500 }}>platforms</span> centralised.
              </span>
            </div>
          </div>

          {/* ═══ CTA LAYER ═══ */}
          <div id="cta-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
            {/* Orange icon — desktop only, hidden on mobile */}
            <div id="cta-icon" style={{
              position: "absolute",
              ...(m
                ? { width: 0, height: 0, overflow: "hidden" as const }
                : { top: Y(374), left: X(671), width: W(219), height: H(219) }),
              zIndex: 2, opacity: 0,
            }}>
              <Image src="/images/mentic-icon-orange.png" alt="Mentic" fill style={{ objectFit: "contain" }} />
            </div>
            <div id="cta-sign" style={{
              position: "absolute",
              top: m ? MY(602) : Y(606), left: m ? MX(44) : X(149),
              fontSize: m ? MFS(72.47) : FS(100), fontWeight: 700,
              color: "#003c46", lineHeight: 1.1, zIndex: 2, opacity: 0,
            }}>
              Sign
            </div>
            <div id="cta-up" style={{
              position: "absolute",
              top: m ? MY(692) : Y(730), left: m ? MX(44) : X(149),
              fontSize: m ? MFS(108.705) : FS(150), fontWeight: 700,
              color: "#ff6b5c", lineHeight: 0.83, zIndex: 2, opacity: 0,
            }}>
              UP
            </div>
            <div id="cta-now" style={{
              position: "absolute",
              top: m ? MY(709) : Y(754), left: m ? MX(202) : X(367),
              fontSize: m ? MFS(72.47) : FS(100), fontWeight: 700,
              color: "#8bf2d3", lineHeight: 1.1, zIndex: 2, opacity: 0,
            }}>
              now
            </div>
            <div id="cta-alpha" style={{
              position: "absolute",
              top: m ? MY(316) : Y(709), left: m ? MX(92) : X(1096),
              width: m ? MW(209) : W(323),
              fontSize: m ? MFS(20) : FS(30), fontWeight: 300,
              color: "#1e1e1e", zIndex: 2, opacity: 0,
              textAlign: m ? "center" as const : undefined,
            }}>
              Alpha releasing <span style={{ fontWeight: 600 }}>soon!</span>
            </div>
            <button onClick={() => { sfxPress(); openSignup(); }} id="cta-button" style={{
              position: "absolute",
              top: m ? MY(368) : Y(777), left: m ? MX(99) : X(1190),
              width: m ? MW(195) : W(195), height: m ? MH(78) : H(78),
              background: m ? "#003c46" : "#8bf2d3", border: "2px solid transparent",
              borderRadius: m ? "15px" : "20px",
              boxShadow: "2px 2px 16.9px rgba(0,0,0,0.25)",
              fontSize: m ? MFS(30) : FS(30), fontWeight: 700,
              color: m ? "#ff6b5c" : "#003c46",
              fontFamily: "'Nunito Sans', sans-serif",
              cursor: "pointer", zIndex: 2, opacity: 0,
              transition: "all 350ms cubic-bezier(0.165, 0.84, 0.44, 1)",
            }}
              onMouseEnter={(e) => {
                sfxHover();
                const el = e.currentTarget;
                el.style.transform = "scale(1.08) translateY(-3px)";
                el.style.boxShadow = m
                  ? "0 8px 32px rgba(255,107,92,0.4), 0 0 20px rgba(255,107,92,0.25)"
                  : "0 8px 32px rgba(139,242,211,0.5), 0 0 24px rgba(139,242,211,0.3)";
                el.style.borderColor = m ? "#ff6b5c" : "#003c46";
                el.style.letterSpacing = "2px";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1) translateY(0)";
                el.style.boxShadow = "2px 2px 16.9px rgba(0,0,0,0.25)";
                el.style.borderColor = "transparent";
                el.style.letterSpacing = "normal";
              }}
            >
              Sign up!
            </button>
          </div>

          {/* ═══ SIGNUP LAYER ═══ */}
          <div ref={signupLayerRef} id="signup-layer" style={{ position: "absolute", inset: 0, zIndex: 20, opacity: 0, pointerEvents: "none" }}>
            <div id="signup-bg" style={{ position: "absolute", inset: 0, background: "#ffffff" }} />
            <div id="signup-blobs">
              <div className="gradient-blob gradient-blob-coral" style={{ width: m ? "100vw" : "80vw", height: m ? "100vw" : "80vw", left: "-30%", top: "-30%", transform: "rotate(-134.46deg)" }} />
              <div className="gradient-blob gradient-blob-mint" style={{ width: m ? "90vw" : "70vw", height: m ? "90vw" : "70vw", right: "-15%", bottom: "-20%", left: "auto", top: "auto", transform: "rotate(-134.46deg)" }} />
            </div>
            <div id="signup-glass" style={{
              position: "absolute",
              inset: m ? `${MY(15)} ${MX(16)}` : "2.5% 1.6%",
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: m ? "10.012px" : "17.872px",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
            }} />

            {/* Signup icon */}
            <div id="signup-icon" style={{
              position: "absolute",
              ...(m
                ? { top: MY(128), left: "50%", transform: "translateX(-50%)", width: MW(139), height: MW(139) }
                : { top: "50%", left: "30%", transform: "translate(-50%, -50%)", width: 219, height: 219 }),
            }}>
              <Image src="/images/mentic-icon-orange.png" alt="Mentic" fill style={{ objectFit: "contain" }} />
            </div>

            {/* Signup card */}
            <div id="signup-card" style={{
              position: "absolute",
              ...(m
                ? { top: MY(352), left: "50%", transform: "translateX(-50%)", width: MW(307) }
                : { top: "50%", right: "8%", transform: "translateY(-50%)", width: 361 }),
              background: "#ff6b5c",
              borderRadius: m ? "15.199px" : "17.872px",
              boxShadow: m ? "2.551px 2.551px 8.759px rgba(0,0,0,0.25)" : "3px 3px 10.3px rgba(0,0,0,0.25)",
              padding: m ? "7.5% 9.4%" : "32px 34px",
              boxSizing: "border-box" as const,
            }}>
              <div style={{ marginBottom: m ? "3.8%" : 28 }}>
                <div style={{ fontSize: m ? "clamp(24px, 8.5vw, 34px)" : 39, fontWeight: 700, color: "#003c46", lineHeight: 1.1 }}>Sign</div>
                <div style={{ fontSize: m ? "clamp(36px, 12.7vw, 50px)" : 59, fontWeight: 700, color: "#8bf2d3", lineHeight: 1 }}>UP</div>
              </div>
              <form id="signup-form" onSubmit={(e) => { sfxPress(); handleFormSubmit(e); }} noValidate>
                {formError && (
                  <div style={{
                    background: "#003c46", color: "#8bf2d3", fontSize: m ? 11 : 13, fontWeight: 600,
                    padding: m ? "6px 12px" : "8px 14px", borderRadius: m ? 6 : 8,
                    marginBottom: m ? 10 : 12, lineHeight: 1.4,
                  }}>{formError}</div>
                )}
                <div style={{ display: "flex", gap: m ? "6.8%" : 20, marginBottom: m ? "4%" : 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: m ? "clamp(9px, 3vw, 12px)" : 14, fontWeight: 600, color: "white", marginBottom: m ? 4 : 6 }}>Name: <span style={{ color: "#8bf2d3" }}>*</span></label>
                    <input className="modal-input" placeholder="John" value={formData.firstName} onKeyDown={() => sfxType()} onChange={(e) => { setFormData(p => ({ ...p, firstName: e.target.value })); setFieldErrors(p => ({ ...p, firstName: false })); }} style={{ ...(m ? { height: "clamp(22px, 6.9vw, 28px)", borderRadius: "4.252px", fontSize: "clamp(9px, 3vw, 12px)" } : {}), ...(fieldErrors.firstName ? { border: "2px solid #003c46", background: "rgba(255,255,255,0.28)" } : {}) }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: m ? "clamp(9px, 3vw, 12px)" : 14, fontWeight: 600, color: "white", marginBottom: m ? 4 : 6 }}>Surname: <span style={{ color: "#8bf2d3" }}>*</span></label>
                    <input className="modal-input" placeholder="Doe" value={formData.lastName} onKeyDown={() => sfxType()} onChange={(e) => { setFormData(p => ({ ...p, lastName: e.target.value })); setFieldErrors(p => ({ ...p, lastName: false })); }} style={{ ...(m ? { height: "clamp(22px, 6.9vw, 28px)", borderRadius: "4.252px", fontSize: "clamp(9px, 3vw, 12px)" } : {}), ...(fieldErrors.lastName ? { border: "2px solid #003c46", background: "rgba(255,255,255,0.28)" } : {}) }} />
                  </div>
                </div>
                <div style={{ marginBottom: m ? "4%" : 16 }}>
                  <label style={{ display: "block", fontSize: m ? "clamp(9px, 3vw, 12px)" : 14, fontWeight: 600, color: "white", marginBottom: m ? 4 : 6 }}>Email: <span style={{ color: "#8bf2d3" }}>*</span></label>
                  <input className="modal-input" type="email" placeholder="example@company.com" value={formData.email} onKeyDown={() => sfxType()} onChange={(e) => { setFormData(p => ({ ...p, email: e.target.value })); setFieldErrors(p => ({ ...p, email: false })); }} style={{ width: "100%", ...(m ? { height: "clamp(22px, 6.9vw, 28px)", borderRadius: "4.252px", fontSize: "clamp(9px, 3vw, 12px)" } : {}), ...(fieldErrors.email ? { border: "2px solid #003c46", background: "rgba(255,255,255,0.28)" } : {}) }} />
                </div>
                <div style={{ marginBottom: m ? "5.6%" : 24 }}>
                  <label style={{ display: "block", fontSize: m ? "clamp(9px, 3vw, 12px)" : 14, fontWeight: 600, color: "white", marginBottom: m ? 4 : 6 }}>Company: <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 400, fontSize: m ? "clamp(8px, 2.5vw, 10px)" : 11 }}>(optional)</span></label>
                  <input className="modal-input" placeholder="Example Inc." value={formData.company} onKeyDown={() => sfxType()} onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))} style={{ width: "100%", ...(m ? { height: "clamp(22px, 6.9vw, 28px)", borderRadius: "4.252px", fontSize: "clamp(9px, 3vw, 12px)" } : {}) }} />
                </div>
                <button type="submit" disabled={formStatus === "submitting"} className="modal-submit" style={{ ...(m ? { fontSize: "clamp(8px, 2.7vw, 11px)", padding: "5px 14px", borderRadius: "7.152px" } : {}), ...(formStatus === "submitting" ? { opacity: 0.6, cursor: "not-allowed" } : {}), transition: "all 300ms cubic-bezier(0.165, 0.84, 0.44, 1)" }}
                  onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,242,211,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0.841px 0.841px 7.107px rgba(0,0,0,0.25)"; }}
                >
                  {formStatus === "submitting" ? "Submitting..." : "Submit!"}
                </button>
                <p style={{ margin: "8px 0 0", fontSize: m ? 8 : 9, color: "rgba(255,255,255,0.35)", lineHeight: 1.4, fontFamily: "'Nunito Sans', sans-serif" }}>
                  Protected by reCAPTCHA. Google{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Privacy</a>{" & "}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms</a>.
                </p>
              </form>
            </div>

            {/* Back button */}
            <button onClick={() => { sfxPress(); closeSignup(); }} style={{
              position: "absolute", top: m ? 16 : 24, left: m ? 16 : 28,
              background: "none", border: "none", padding: m ? 10 : 14,
              cursor: "pointer", zIndex: 25,
              transition: "transform 200ms, opacity 200ms",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
            >
              <svg width={m ? 28 : 32} height={m ? 28 : 32} viewBox="0 0 24 24" fill="none" stroke="#003c46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* ── Success screen ── */}
            <div id="success-screen" style={{
              position: "absolute", inset: 0, zIndex: 30, opacity: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: formStatus === "success" ? "auto" : "none",
            }}>
              <div id="success-icon" style={{ marginBottom: 24, opacity: 0 }}>
                <Image src="/images/mentic-icon-mint.png" alt="Mentic" width={m ? 100 : 140} height={m ? 100 : 140} style={{ filter: "drop-shadow(2px 2px 16px rgba(0,0,0,0.12))" }} />
              </div>
              <div id="success-logo" className="font-qurova" style={{ fontSize: m ? 52 : 72, color: "#8bf2d3", marginBottom: 32, opacity: 0 }}>
                mentic
              </div>
              <div id="success-message" style={{ textAlign: "center", maxWidth: m ? "80%" : 420, marginBottom: 40, opacity: 0 }}>
                <p style={{ margin: "0 0 10px", fontSize: m ? 20 : 26, color: "#003c46", lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 300 }}>Thank you for </span><span style={{ fontWeight: 700 }}>signing up.</span>
                </p>
                <p style={{ margin: 0, fontSize: m ? 14 : 16, color: "#1e1e1e", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 300 }}>We will </span><span style={{ fontWeight: 600 }}>contact you </span><span style={{ fontWeight: 300 }}>soon about your </span><span style={{ fontWeight: 700, color: "#003c46" }}>alpha access.</span>
                </p>
              </div>
              <div id="success-socials" style={{ display: "flex", alignItems: "center", gap: m ? 28 : 36, opacity: 0 }}>
                <a href="https://www.linkedin.com/company/mentic-io" target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: "#003c46", transition: "transform 200ms, opacity 200ms" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.opacity = "0.7"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}>
                  <svg width={m ? 30 : 36} height={m ? 30 : 36} viewBox="0 0 24 24" fill="none" stroke="#003c46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a href="https://www.instagram.com/mentic.io/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: "#003c46", transition: "transform 200ms, opacity 200ms" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.opacity = "0.7"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}>
                  <svg width={m ? 30 : 36} height={m ? 30 : 36} viewBox="0 0 24 24" fill="none" stroke="#003c46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="#003c46" stroke="none" /></svg>
                </a>
                <a href="https://x.com/Mentic_io" target="_blank" rel="noopener noreferrer" style={{ display: "flex", color: "#003c46", transition: "transform 200ms, opacity 200ms" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.opacity = "0.7"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}>
                  <svg width={m ? 28 : 34} height={m ? 28 : 34} viewBox="0 0 24 24" fill="#003c46"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Splash screen ── */}
      <div ref={loaderRef} style={{
        position: "fixed", inset: 0, zIndex: 200, background: "#ff6b5c",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        overflow: "hidden", clipPath: "inset(0 0 0% 0)",
      }}>
        {/* Animated background blobs */}
        <div id="splash-blob-1" className="gradient-blob" style={{
          position: "absolute", width: m ? "120vw" : "70vw", height: m ? "120vw" : "70vw",
          left: "-20%", top: "-30%", opacity: 0,
          background: "radial-gradient(ellipse at center, rgba(139,242,211,0.35) 0%, rgba(139,242,211,0.12) 40%, transparent 70%)",
        }} />
        <div id="splash-blob-2" className="gradient-blob" style={{
          position: "absolute", width: m ? "100vw" : "60vw", height: m ? "100vw" : "60vw",
          right: "-15%", bottom: "-25%", left: "auto", top: "auto", opacity: 0,
          background: "radial-gradient(ellipse at center, rgba(0,60,70,0.2) 0%, rgba(0,60,70,0.08) 40%, transparent 70%)",
        }} />

        <div id="splash-icon" style={{ marginBottom: m ? 16 : 24, opacity: 0 }}>
          <Image src="/images/mentic-icon-mint.png" alt="Mentic" width={m ? 120 : 160} height={m ? 120 : 160} priority style={{ filter: "drop-shadow(3px 3px 24px rgba(0,0,0,0.2))" }} />
        </div>
        <div id="splash-logo" className="font-qurova" style={{
          fontSize: m ? 60 : 88, color: "#8bf2d3", letterSpacing: "0.04em",
          marginBottom: m ? 12 : 16, opacity: 0,
          filter: "drop-shadow(2px 2px 12px rgba(0,0,0,0.12))",
        }}>mentic</div>
        <div id="splash-tagline" style={{
          fontSize: m ? 12 : 14, fontWeight: 400, color: "#faf9f6",
          letterSpacing: "0.2em", textTransform: "uppercase" as const,
          marginBottom: m ? 52 : 72, opacity: 0,
        }}>The Autonomous Advertising Agent</div>
        <button
          id="splash-btn"
          onClick={() => { sfxPress(); handleBegin(); }}
          style={{
            position: "relative", background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            borderRadius: m ? 50 : 60,
            padding: m ? "14px 52px" : "18px 72px",
            fontSize: m ? 14 : 16, fontWeight: 600,
            color: "rgba(255,255,255,0.85)", letterSpacing: "3px", textTransform: "uppercase" as const,
            fontFamily: "'Nunito Sans', sans-serif",
            cursor: "pointer", opacity: 0,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 0 0 0 rgba(139,242,211,0), inset 0 0 20px rgba(255,255,255,0.04)",
            transition: "all 400ms cubic-bezier(0.165, 0.84, 0.44, 1)",
          }}
          onMouseEnter={(e) => {
            sfxHover();
            const el = e.currentTarget;
            el.style.borderColor = "rgba(139,242,211,0.6)";
            el.style.background = "rgba(139,242,211,0.1)";
            el.style.color = "#8bf2d3";
            el.style.boxShadow = "0 0 32px 4px rgba(139,242,211,0.2), inset 0 0 24px rgba(139,242,211,0.06)";
            el.style.transform = "scale(1.06)";
            el.style.letterSpacing = "4px";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(255,255,255,0.35)";
            el.style.background = "rgba(255,255,255,0.06)";
            el.style.color = "rgba(255,255,255,0.85)";
            el.style.boxShadow = "0 0 0 0 rgba(139,242,211,0), inset 0 0 20px rgba(255,255,255,0.04)";
            el.style.transform = "scale(1)";
            el.style.letterSpacing = "3px";
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
          }}
        >
          Begin
        </button>
      </div>
    </>
  );
}

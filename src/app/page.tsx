"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import emailjs from "@emailjs/browser";
gsap.registerPlugin(ScrollTrigger);

const EMAILJS_PUBLIC_KEY = "vL-JN3gWKUaXsCkWK";
const EMAILJS_SERVICE_ID = "service_43fsg3n";
const EMAILJS_TEMPLATE_USER = "template_6i6qlv1";
const EMAILJS_TEMPLATE_TEAM = "template_ahcl5qh";
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

// Layout uses normal-flow sections with ScrollTrigger animations

export default function PreviewLanding() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const signupLayerRef = useRef<HTMLDivElement>(null);
  const mobileBgRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [soundMuted, setSoundMuted] = useState(true);
  const [soundBtnDark, setSoundBtnDark] = useState(false); // true = dark icon for white bg sections
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

    const fn = firstName.trim(), ln = lastName.trim(), em = email.trim(), co = company.trim();
    const timestamp = new Date().toISOString();

    // Get reCAPTCHA token
    const grecaptcha = (window as unknown as Record<string, unknown>).grecaptcha as { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } | undefined;
    let token = "";
    if (grecaptcha) {
      try { token = await new Promise<string>((res) => { grecaptcha.ready(() => { grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "signup" }).then(res).catch(() => res("")); }); }); } catch { /* continue without token */ }
    }

    // Send to our API route (server-side proxy to Google Sheets — no CORS issues)
    const emailParams = { first_name: fn, last_name: ln, email: em, to_email: em, reply_to: em, company: co || "N/A", timestamp };
    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: fn, lastName: ln, email: em, company: co, recaptchaToken: token, timestamp }),
    }).catch(() => {});
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_USER, emailParams).catch(() => {});
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TEAM, emailParams).catch(() => {});

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
  }, [formData]);

  const openSignup = useCallback(() => {
    if (!signupLayerRef.current) return;
    const signup = signupLayerRef.current;
    document.documentElement.style.overflow = "hidden";
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
        document.documentElement.style.overflow = "";
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

  /* ── Loading screen — percentage counter, auto-dismiss ── */
  useEffect(() => {
    if (loaded) return;
    let pct = 0;
    const start = Date.now();
    const minDuration = 1800; // minimum loader visible time (ms)

    // Simulate progress up to 90% quickly, then wait for real load
    const interval = setInterval(() => {
      if (pct < 90) {
        pct += Math.random() * 12 + 3;
        if (pct > 90) pct = 90;
        setLoadPct(Math.round(pct));
      }
    }, 120);

    const onReady = () => {
      clearInterval(interval);
      // Animate remaining 90→100
      const finish = () => {
        pct = 100;
        setLoadPct(100);
        // Wait a beat then dismiss
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
          const loader = loaderRef.current;
          const vp = viewportRef.current;
          if (!loader) { setLoaded(true); return; }

          gsap.to(loader, {
            opacity: 0, duration: 0.5, ease: "power2.in",
            onComplete: () => {
              gsap.set(loader, { display: "none" });
              setLoaded(true);

              // Play hero entrance
              if (!vp) return;
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
            },
          });
        }, remaining);
      };
      // Quick animate from current to 100
      const step = () => {
        pct += 3;
        if (pct >= 100) { finish(); return; }
        setLoadPct(Math.round(pct));
        requestAnimationFrame(step);
      };
      step();
    };

    let firedOnce = false;
    const fireOnce = () => {
      if (firedOnce) return;
      firedOnce = true;
      onReady();
    };

    if (document.readyState === "complete") {
      fireOnce();
    } else {
      window.addEventListener("load", fireOnce);
    }

    // Failsafe: Safari can delay or swallow `window.load` when dynamically
    // appended scripts (reCAPTCHA, Meta Pixel) are pending. Force-dismiss
    // the loader after a hard ceiling so the page never stays frozen.
    const failsafe = setTimeout(fireOnce, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
      window.removeEventListener("load", fireOnce);
    };
  }, [loaded]);

  /* ── Sound toggle handler ── */
  const toggleSound = useCallback(() => {
    setSoundMuted((prev) => {
      const next = !prev;
      const a = audioRef.current;
      if (a && a.ctx.state === "running") {
        a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
        a.gain.gain.setTargetAtTime(next ? 0 : 0.096, a.ctx.currentTime, 0.15);
      }
      return next;
    });
  }, []);

  /* ── Native scroll: let Safari handle it. GSAP ScrollTrigger syncs automatically. ── */

  /* ── Per-section scroll-triggered animations — one frame at a time ── */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const sections = gsap.utils.toArray<HTMLElement>("[id^='section-']");
    const totalSections = sections.length;

    const ctx = gsap.context(() => {

      /* ── Gentle snap: only corrects when very close to a section boundary ── */
      const step = 1 / (totalSections - 1);
      ScrollTrigger.create({
        snap: {
          snapTo(progress: number) {
            const nearest = Math.round(progress / step) * step;
            const distance = Math.abs(progress - nearest);
            // Only snap if within 5% of a section boundary
            return distance < 0.05 ? nearest : progress;
          },
          duration: { min: 0.2, max: 0.4 },
          delay: 0.1,
          ease: "power1.out",
        },
      });

      /* ── Layer IDs inside each section (content to show/hide) ── */
      const layerMap: Record<string, string> = {
        "section-hero": "#hero-layer",
        "section-pain": "#pain-layer",
        "section-calc": "#calc-layer",
        "section-sol": "#sol-layer",
        "section-no": "#no-layer",
        "section-how": "#how-layer",
        "section-val": "#val-layer",
        "section-cta": "#cta-layer",
      };

      /* ── Background colors per section ── */
      const bgColors: Record<string, string> = {
        "section-hero": "#ffe5e5",
        "section-pain": "#ffe5e5",
        "section-calc": "#ff6b5c",
        "section-sol": "#ffffff",
        "section-no": "#ffffff",
        "section-how": "#ffffff",
        "section-val": "#ffffff",
        "section-cta": "#ffffff",
      };

      /* ── Per-section enter animations ── */
      /* Sections with white/light bg need dark sound button */
      const darkBtnSections = new Set(["section-sol", "section-no", "section-how", "section-val", "section-cta"]);

      function enterSection(id: string) {
        const layer = layerMap[id];
        if (!layer) return;

        // Fade in the layer
        gsap.to(layer, { opacity: 1, duration: 0.4, ease: "power2.out" });

        // Background color transition
        gsap.to("#bg", { backgroundColor: bgColors[id] || "#ffffff", duration: 0.6, ease: "power2.out" });

        // Update sound button color scheme
        setSoundBtnDark(darkBtnSections.has(id));

        // Section-specific enter animations
        switch (id) {
          case "section-hero":
            gsap.to("#icon-teal", { opacity: 0, duration: 0.3, ease: "power2.in" });
            break;

          case "section-pain":
            gsap.to(["#glass-card", "#icon-teal"], { opacity: 1, duration: 0.5, ease: "power2.out" });
            gsap.fromTo("#pain-blob", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
            gsap.fromTo("#pain-text-1", { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out", delay: 0.1 });
            gsap.fromTo("#pain-text-2", { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out", delay: 0.25 });
            gsap.fromTo("#pain-text-3", { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.out", delay: 0.4 });
            setTimeout(() => sfxClick(), 350);
            setTimeout(() => sfxClick(), 600);
            break;

          case "section-calc":
            gsap.to("#glass-card", { opacity: 0, duration: 0.3, ease: "power2.in" });
            gsap.fromTo("#calc-panel", { opacity: 0, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, clipPath: "inset(0 0 0 0%)", duration: 0.8, ease: "power4.out" });
            gsap.fromTo("#calc-heading", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power4.out", delay: 0.15 });
            gsap.fromTo("#calc-amount", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.25 });
            gsap.fromTo("#calc-glass", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 });
            gsap.fromTo("#calc-fifty", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.35 });
            gsap.fromTo("#calc-fees", { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out", delay: 0.4 });
            gsap.fromTo("#calc-notads", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power4.out", delay: 0.5 });
            setTimeout(() => sfxClick(), 300);
            setTimeout(() => sfxClick(), 550);
            break;

          case "section-sol":
            gsap.to(["#blob-coral", "#blob-mint"], { opacity: 1, duration: 0.8, ease: "power2.out" });
            gsap.to("#icon-teal", { opacity: 1, duration: 0.5, ease: "power2.out" });
            gsap.fromTo("#sol-text-1", { opacity: 0, x: -30, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power4.out" });
            gsap.fromTo("#sol-text-2", { opacity: 0, x: 30, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.7, ease: "power4.out", delay: 0.15 });
            gsap.fromTo("#sol-text-3", { opacity: 0, y: 15, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power4.out", delay: 0.3 });
            setTimeout(() => sfxClick(), 300);
            setTimeout(() => sfxClick(), 550);
            break;

          case "section-no":
            gsap.fromTo("#no-text", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power4.out" });
            gsap.fromTo("#no-item-1", { opacity: 0, x: 25, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.5, ease: "power4.out", delay: 0.1 });
            gsap.fromTo("#no-item-2", { opacity: 0, x: 25, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.5, ease: "power4.out", delay: 0.22 });
            gsap.fromTo("#no-item-3", { opacity: 0, x: 25, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.5, ease: "power4.out", delay: 0.34 });
            gsap.fromTo("#no-item-4", { opacity: 0, x: 25, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.5, ease: "power4.out", delay: 0.46 });
            gsap.fromTo("#no-dot", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.58 });
            setTimeout(() => sfxClick(), 250);
            setTimeout(() => sfxClick(), 500);
            break;

          case "section-how":
            gsap.fromTo("#how-step-1", { opacity: 0, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power4.out" });
            gsap.fromTo("#how-step-2", { opacity: 0, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power4.out", delay: 0.12 });
            gsap.fromTo("#how-step-3", { opacity: 0, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power4.out", delay: 0.24 });
            gsap.fromTo("#how-mentic", { opacity: 0, x: 35, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.7, ease: "power4.out", delay: 0.35 });
            gsap.fromTo("#how-rest", { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power4.out", delay: 0.45 });
            setTimeout(() => sfxClick(), 250);
            setTimeout(() => sfxClick(), 500);
            break;

          case "section-val":
            gsap.fromTo("#val-one", { opacity: 0, x: -25, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out" });
            gsap.fromTo("#val-every", { opacity: 0, x: -20, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out", delay: 0.15 });
            gsap.fromTo("#val-all", { opacity: 0, x: -15, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out", delay: 0.3 });
            setTimeout(() => sfxClick(), 300);
            setTimeout(() => sfxClick(), 550);
            break;

          case "section-cta":
            gsap.fromTo("#cta-icon", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
            gsap.fromTo("#cta-sign", { opacity: 0, x: -25, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power4.out", delay: 0.08 });
            gsap.fromTo("#cta-up", { opacity: 0, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power4.out", delay: 0.16 });
            gsap.fromTo("#cta-now", { opacity: 0, x: 20, clipPath: "inset(0 0 0 100%)" }, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)", duration: 0.5, ease: "power4.out", delay: 0.24 });
            gsap.fromTo("#cta-alpha", { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.4, ease: "power4.out", delay: 0.34 });
            gsap.fromTo("#cta-button", { opacity: 0, y: 10, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.42 });
            setTimeout(() => sfxClick(), 300);
            break;
        }
      }

      /* ── Per-section exit: fade content out quickly ── */
      function exitSection(id: string) {
        const layer = layerMap[id];
        if (!layer) return;
        gsap.to(layer, { opacity: 0, duration: 0.3, ease: "power2.in" });

        // Section-specific cleanup
        if (id === "section-pain") {
          gsap.to("#glass-card", { opacity: 0, duration: 0.3, ease: "power2.in" });
        }
        if (id === "section-sol" || id === "section-no" || id === "section-how" || id === "section-val") {
          // blobs stay visible across white sections
        }
        if (id === "section-calc") {
          gsap.to("#glass-card", { opacity: 0, duration: 0.2, ease: "power2.in" });
        }
      }

      /* ── ScrollTrigger for each section: enter/exit ── */
      sections.forEach((section) => {
        const id = section.id;

        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => enterSection(id),
          onEnterBack: () => enterSection(id),
          onLeave: () => exitSection(id),
          onLeaveBack: () => exitSection(id),
        });
      });

      /* ── Blobs: show when entering white sections, hide when leaving ── */
      ScrollTrigger.create({
        trigger: "#section-sol",
        start: "top 60%",
        onEnter: () => gsap.to(["#blob-coral", "#blob-mint"], { opacity: 1, duration: 0.8, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(["#blob-coral", "#blob-mint"], { opacity: 0, duration: 0.4, ease: "power2.in" }),
      });

    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  /* ── Audio engine: ambient + SFX ── */
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode; fadeUntil: number } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swooshPlayedRef = useRef(false);
  const soundMutedRef = useRef(true);

  // Keep ref in sync with state
  useEffect(() => { soundMutedRef.current = soundMuted; }, [soundMuted]);

  // SFX functions — plain functions using refs, no closure issues
  function sfxClick() {
    try {
      // Haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(8);
      if (soundMutedRef.current) return;

      const a = audioRef.current;
      if (!a || a.ctx.state !== "running") return;
      const ctx = a.ctx;
      const t = ctx.currentTime;

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.064, t);
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
      ringGain.gain.setValueAtTime(0.032, t);
      ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      ring.connect(ringGain).connect(ctx.destination);
      ring.start(t);
      ring.stop(t + 0.08);
    } catch (e) { /* silent */ }
  }

  function sfxSwoosh() {
    try {
      if (soundMutedRef.current) return;
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
      sg.gain.value = 0.02;
      src.connect(bp).connect(sg).connect(ctx.destination);
      src.start(t);
      src.stop(t + dur);
    } catch (e) { /* silent */ }
  }

  // Soft tonal hover sound — gentle rising tone for button interactions
  function sfxHover() {
    try {
      if (soundMutedRef.current) return;
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
      g.gain.setValueAtTime(0.024, t);
      g.gain.linearRampToValueAtTime(0.04, t + dur * 0.3);
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
      if (soundMutedRef.current) return;
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
      g.gain.setValueAtTime(0.048, t);
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
      tg.gain.setValueAtTime(0.04, t);
      tg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      thump.connect(tg).connect(ctx.destination);
      thump.start(t);
      thump.stop(t + 0.06);
    } catch (e) { /* silent */ }
  }

  // Subtle mechanical key-press sound for typing in inputs
  function sfxType() {
    try {
      if (soundMutedRef.current) return;
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
      g.gain.setValueAtTime(0.064, t); // louder
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(t);
      src.stop(t + dur);
    } catch (e) { /* silent */ }
  }

  useEffect(() => {
    const BASE_VOL = 0.096;
    const SCROLL_VOL = 0.20;

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
        g.gain.value = 0.24;
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
      padGain.gain.value = 0.144;
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
      shimG.gain.value = 0.04;
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
      ng.gain.value = 0.04;
      noise.connect(nf).connect(ng).connect(master);
      noise.start();

      audioRef.current = { ctx, gain: master, fadeUntil: ctx.currentTime + 4 };
      master.gain.setTargetAtTime(soundMutedRef.current ? 0 : BASE_VOL, ctx.currentTime, 1.0);
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
      if (!a || a.ctx.state !== "running" || soundMutedRef.current) return;
      if (a.ctx.currentTime < a.fadeUntil) return;
      a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
      a.gain.gain.setTargetAtTime(SCROLL_VOL, a.ctx.currentTime, 0.12);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const a2 = audioRef.current;
        if (!a2 || a2.ctx.state !== "running" || soundMutedRef.current) return;
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
      curX = mouseX;
      curY = mouseY;
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

  /* ── Sync html + mobile-bg + theme-color with #bg on mobile (fixes iOS Safari safe-area stripes) ── */
  useEffect(() => {
    if (!isMobile) return;
    const bg = document.getElementById("bg");
    const mbg = mobileBgRef.current;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!bg) return;
    let lastColor = "";
    const sync = () => {
      const c = bg.style.backgroundColor;
      if (c && c !== lastColor) {
        lastColor = c;
        document.documentElement.style.backgroundColor = c;
        document.body.style.backgroundColor = c;
        if (mbg) mbg.style.backgroundColor = c;
        if (themeMeta) themeMeta.setAttribute("content", c);
      }
    };
    gsap.ticker.add(sync);
    return () => {
      gsap.ticker.remove(sync);
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
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
      {/* ── Mobile: extra background layer OUTSIDE viewport to cover iOS safe areas ── */}
      {m && <div ref={mobileBgRef} style={{ position: "fixed", inset: "-100vh -100vw", zIndex: -1, backgroundColor: "#ffe5e5", pointerEvents: "none" }} />}

      <div ref={wrapperRef} style={{ position: "relative", overflowX: "clip" }}>
        <div ref={viewportRef} style={{ position: "relative", width: "100vw" }}>

          {/* ── Background — fixed so it covers behind iOS browser chrome ── */}
          <div id="bg" style={{ position: "fixed", inset: m ? "-50vh -25vw" : "-5vh -5vw", backgroundColor: "#ffe5e5", zIndex: 0 }} />

          {/* ── Persistent teal icon ── */}
          <button
            id="icon-teal"
            onClick={() => {
              sfxPress();
              // Smooth scroll to top
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              position: "fixed",
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
              position: "fixed",
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


          {/* ── Gradient blobs ── */}
          <div id="blob-coral" className="gradient-blob gradient-blob-coral" style={{ width: m ? "100vw" : "80vw", height: m ? "100vw" : "80vw", left: "-30%", top: "-20%", opacity: 0, zIndex: 1 }} />
          <div id="blob-mint" className="gradient-blob gradient-blob-mint" style={{ width: m ? "90vw" : "70vw", height: m ? "90vw" : "70vw", right: "-20%", bottom: "-25%", left: "auto", top: "auto", opacity: 0, zIndex: 1 }} />

          {/* ═══ HERO SECTION ═══ */}
          <div id="section-hero" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
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
          </div>

          {/* ═══ PAIN SECTION ═══ */}
          <div id="section-pain" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="pain-layer" style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 0 }}>
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
          </div>

          {/* ═══ CALC SECTION ═══ */}
          <div id="section-calc" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="calc-layer" style={{ position: "absolute", inset: 0, zIndex: 6, opacity: 0 }}>
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
            <div id="calc-glass" style={{
              position: "absolute",
              top: m ? MY(15) : Y(20), left: m ? MX(16) : X(24),
              width: m ? MW(362) : W(1443), height: m ? MH(822) : H(919),
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: m ? "10.012px" : "17.872px",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)",
              zIndex: 2, opacity: 0,
            }} />
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
          </div>

          {/* ═══ SOLUTION SECTION ═══ */}
          <div id="section-sol" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="sol-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
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
          </div>

          {/* ═══ NO SECTION ═══ */}
          <div id="section-no" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="no-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
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
          </div>

          {/* ═══ HOW SECTION ═══ */}
          <div id="section-how" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="how-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
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
          </div>

          {/* ═══ VALUE SECTION ═══ */}
          <div id="section-val" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="val-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
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
          </div>

          {/* ═══ CTA SECTION ═══ */}
          <div id="section-cta" style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
          <div id="cta-layer" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0 }}>
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
          </div>

        </div>
      </div>

      {/* ═══ SIGNUP LAYER — outside wrapper to avoid overflow:hidden clipping ═══ */}
      <div ref={signupLayerRef} id="signup-layer" style={{ position: "fixed", inset: 0, zIndex: 200, opacity: 0, pointerEvents: "none" }}>
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

      {/* ── Sound toggle button — color adapts to section background ── */}
      {loaded && (() => {
        const dk = soundBtnDark;
        const iconColor = dk ? "#003c46" : "white";
        const bgBase = dk ? "rgba(0,60,70,0.10)" : "rgba(255,255,255,0.12)";
        const bgHover = dk ? "rgba(0,60,70,0.18)" : "rgba(255,255,255,0.22)";
        const borderBase = dk ? "rgba(0,60,70,0.22)" : "rgba(255,255,255,0.25)";
        const borderHover = dk ? "rgba(0,60,70,0.35)" : "rgba(255,255,255,0.4)";
        return (
        <button
          onClick={toggleSound}
          onMouseEnter={() => sfxHover()}
          aria-label={soundMuted ? "Unmute sound" : "Mute sound"}
          style={{
            position: "fixed",
            bottom: m ? 18 : 28,
            left: m ? 18 : 28,
            width: m ? 42 : 46,
            height: m ? 42 : 46,
            borderRadius: "50%",
            background: bgBase,
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1.5px solid ${borderBase}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            zIndex: 100,
            transition: "all 300ms ease",
            boxShadow: dk ? "0 2px 12px rgba(0,0,0,0.06)" : "0 2px 12px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = bgHover; e.currentTarget.style.borderColor = borderHover; e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = bgBase; e.currentTarget.style.borderColor = borderBase; e.currentTarget.style.transform = "scale(1)"; }}
        >
          {soundMuted ? (
            <svg width={m ? 18 : 20} height={m ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width={m ? 18 : 20} height={m ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        );
      })()}

      {/* ── Loading screen ── */}
      <div ref={loaderRef} style={{
        position: "fixed", inset: m ? "-5vh -5vw" : 0, zIndex: 200, background: "#ff6b5c",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <span style={{
          fontSize: m ? "28vw" : "14vw",
          fontWeight: 200,
          color: "white",
          fontFamily: "'Nunito Sans', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}>
          {loadPct}%
        </span>
      </div>
    </>
  );
}

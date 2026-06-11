"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { trackContact } from "@/lib/pixel";

const SUPPORT_EMAIL = "support@mentic.io";

/* The homepage owns the site's sound system. The footer broadcasts a DOM
   event so the homepage can play its hover/press sounds; every other page
   simply ignores it. */
function sfx(kind: "hover" | "press") {
  try {
    window.dispatchEvent(new CustomEvent("mentic-sfx", { detail: kind }));
  } catch {
    /* noop */
  }
}

export default function SiteFooter() {
  const [emailCopied, setEmailCopied] = useState(false);
  /* The homepage renders its own custom cursor (and hides the native one
     globally); every other page restores the native cursor on its content,
     so the footer must do the same there. */
  const isHomepage = usePathname() === "/";

  const copyEmail = async () => {
    sfx("press");
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
    } catch {
      // Fallback for browsers without clipboard API access
      const ta = document.createElement("textarea");
      ta.value = SUPPORT_EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    trackContact({ content_name: "Email copy (footer)", method: "email_copy" });
    setTimeout(() => setEmailCopied(false), 1800);
  };

  return (
    <footer
      id="site-footer"
      className={`${isHomepage ? "" : "use-native-cursor "}relative z-[5] w-full bg-dark-teal text-[#f2f2f0] font-sans px-[clamp(24px,8vw,96px)] pt-[clamp(48px,6vw,88px)] pb-[clamp(28px,3vw,40px)]`}
    >
      <div className="mx-auto max-w-[1400px] flex flex-col items-start gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        {/* Left column: wordmark + tagline + email */}
        <div className="flex flex-col gap-[18px]">
          <div className="font-qurova text-[clamp(38px,5vw,60px)] leading-none text-mint">
            mentic
          </div>
          <div className="text-[clamp(13px,1.1vw,16px)] font-light tracking-[0.01em] text-[rgba(242,242,240,0.7)]">
            The Autonomous AI Advertising Agent.
          </div>
          <button
            type="button"
            onMouseEnter={() => sfx("hover")}
            onClick={copyEmail}
            aria-label="Copy support email address to clipboard"
            className={`mt-1.5 inline-flex w-fit items-center gap-2 border-none bg-transparent p-0 font-[inherit] text-base lg:text-lg font-medium transition-colors duration-200 ${
              emailCopied ? "text-mint" : "text-[#f2f2f0] hover:text-mint"
            }`}
          >
            {emailCopied ? (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            {emailCopied ? "Copied to clipboard" : SUPPORT_EMAIL}
          </button>
        </div>

        {/* Right column: socials */}
        <div className="flex flex-col items-start gap-3.5 lg:items-end">
          <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-[rgba(242,242,240,0.55)]">
            Follow
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/mentic.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onMouseEnter={() => sfx("hover")}
              className="flex text-mint opacity-85 transition-[opacity,transform] duration-200 hover:opacity-100 hover:scale-[1.12]"
            >
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/mentic-io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onMouseEnter={() => sfx("hover")}
              className="flex text-mint opacity-85 transition-[opacity,transform] duration-200 hover:opacity-100 hover:scale-[1.12]"
            >
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://x.com/Mentic_io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              onMouseEnter={() => sfx("hover")}
              className="flex text-mint opacity-85 transition-[opacity,transform] duration-200 hover:opacity-100 hover:scale-[1.12]"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom row: launch + legal */}
      <div className="mx-auto mt-10 lg:mt-14 max-w-[1400px] border-t border-[rgba(242,242,240,0.1)] pt-5 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center text-xs font-light tracking-[0.02em] text-[rgba(242,242,240,0.55)]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Launched 21 May 2026
          </span>
          <span>Alpha: onboarding pilot users now.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            onMouseEnter={() => sfx("hover")}
            className="text-inherit no-underline transition-colors duration-200 hover:text-[#f2f2f0]"
          >
            Privacy
          </a>
          <a
            href="/terms"
            onMouseEnter={() => sfx("hover")}
            className="text-inherit no-underline transition-colors duration-200 hover:text-[#f2f2f0]"
          >
            Terms
          </a>
          <span>© {new Date().getFullYear()} Mentic Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

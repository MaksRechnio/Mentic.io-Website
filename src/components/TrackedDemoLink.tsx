"use client";

import type { CSSProperties, ReactNode } from "react";
import { trackSchedule } from "@/lib/pixel";

/* Calendly anchor with built-in Meta Pixel Schedule tracking. Use anywhere
   the same "Book a demo" CTA is rendered from a server component so the
   server tree stays server while the click handler runs on the client. */

const CALENDLY =
  "https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user";

export default function TrackedDemoLink({
  source,
  contentName,
  className,
  style,
  children,
}: {
  /** Short identifier for where on the site the click came from. */
  source: string;
  /** Human-readable label used in the Pixel `content_name` param. */
  contentName?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => trackSchedule({ content_name: contentName ?? `Book a demo — ${source}`, source })}
    >
      {children}
    </a>
  );
}

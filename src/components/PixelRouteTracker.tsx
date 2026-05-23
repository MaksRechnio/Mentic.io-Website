"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackPageView } from "@/lib/pixel";

/* ─────────────────────────────────────────────────────────────
   Fires fbq('track', 'PageView') on every client-side navigation.

   Why this is needed: app/layout.tsx runs the pixel init + one PageView
   on first paint, but Next App Router never re-executes the layout on
   client-side navigation. Without this component, /product, /pricing,
   /news etc. never fire a PageView and the Meta dashboard
   under-reports session depth and time-on-site dramatically.

   `useSearchParams` requires a Suspense boundary, so the actual
   tracker logic is split into an inner component.
   ─────────────────────────────────────────────────────────── */

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /* Skip the very first render: layout.tsx already fired the initial
     PageView, and useEffect would otherwise double-count it. */
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export default function PixelRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}

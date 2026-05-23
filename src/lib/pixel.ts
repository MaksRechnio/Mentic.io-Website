/* Meta Pixel helper. The pixel itself is initialised in app/layout.tsx
   (id 1828929531115858). Every helper here is a no-op if fbq isn't on
   window yet — safe to call from any client component / handler. */

type FbqParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: FbqParams) => void;
  }
}

function call(action: string, event: string, params?: FbqParams) {
  if (typeof window === "undefined") return;
  try { window.fbq?.(action, event, params); } catch { /* noop */ }
}

/* ── Standard events ─────────────────────────────────────────── */

/** PageView. Fires automatically on first paint via layout.tsx; the route
    tracker (PixelRouteTracker) fires this on every client-side navigation
    so SPA route changes aren't invisible to Meta. */
export function trackPageView() {
  call("track", "PageView");
}

/** Lead — qualified interest. Use for form submits and trial claims. */
export function trackLead(params?: FbqParams) {
  call("track", "Lead", params);
}

/** CompleteRegistration — a real sign-up was submitted (form success). */
export function trackCompleteRegistration(params?: FbqParams) {
  call("track", "CompleteRegistration", params);
}

/** InitiateCheckout — a user is leaving for the signup app or starting
    the sign-up flow. Pairs with Lead at the same touchpoint. */
export function trackInitiateCheckout(params?: FbqParams) {
  call("track", "InitiateCheckout", params);
}

/** Schedule — a demo booking link was clicked (Calendly). */
export function trackSchedule(params?: FbqParams) {
  call("track", "Schedule", params);
}

/** Contact — user copied the support email or otherwise reached out. */
export function trackContact(params?: FbqParams) {
  call("track", "Contact", params);
}

/** ViewContent — meaningful long-form content was viewed (product page,
    pricing page). */
export function trackViewContent(params?: FbqParams) {
  call("track", "ViewContent", params);
}

/** Custom event escape hatch for anything that doesn't map cleanly to a
    Meta standard event (e.g. menu opens, scroll depth, video play). */
export function trackCustom(eventName: string, params?: FbqParams) {
  call("trackCustom", eventName, params);
}

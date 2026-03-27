# Scroll Animation Reference — itsoffbrand.com

> Reference for Mentic.io landing page scroll animations. Based on analysis of itsoffbrand.com (Off+Brand creative agency).

---

## 1. Smooth Scroll (Lenis)

```js
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
  smoothWheel: true,
  lerp: 0.1,  // lower = smoother/slower (0.1 = buttery, 0.5 = snappy)
})
```

- `lerp: 0.1` is the key variable — controls how quickly scroll position catches up to target
- `duration: 1.2` — interpolation duration in seconds
- Exponential ease-out easing — fast start, gradual settle

---

## 2. Transition Speed Tiers

| Tier | Duration | Use Case |
|------|----------|----------|
| Fast | `200ms` | Hover states, micro-interactions |
| Medium | `400ms` | UI state changes, small reveals |
| Smooth | `600ms` | Scroll-triggered element transitions |
| Slow | `1200ms` | Major section transitions, hero elements |

---

## 3. Easing Curves

```css
/* Standard — most hover states */
transition-timing-function: ease;

/* Smooth breathing — pulse, looping animations */
animation-timing-function: ease-in-out;

/* Premium scroll feel — the signature curve (easeOutQuart) */
transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
```

The cubic-bezier `(0.165, 0.84, 0.44, 1)` is essentially **easeOutQuart** — fast entrance, very gentle settle. This gives the "premium" feel to scroll-triggered animations.

---

## 4. CSS Variables

```css
--perspective: 4000px;       /* depth of 3D grid — higher = subtler parallax */
--grid-inner-scale: 1;       /* base scale of grid items, animated via JS */
--grid-item-ratio: 1.5;      /* aspect ratio of grid cards */
--vh: calc(1vh);              /* true viewport height (recalculated on resize) */
```

---

## 5. Transform Scale Progression

```css
transform: scale(0.55);   /* far from viewport — starting state */
transform: scale(0.8);    /* approaching viewport */
transform: scale(1);      /* in view — natural size */
transform: scale(1.1);    /* hover / focus — subtle zoom */
```

---

## 6. 3D Grid Parallax

```css
.grid-container {
  perspective: 4000px;
  transform-style: preserve-3d;
}

.grid-item {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);  /* GPU layer promotion */
}
```

Grid items shift on different Z-planes as you scroll, creating depth. `perspective: 4000px` keeps the effect subtle (lower values = more dramatic).

---

## 7. Keyframe Animations

```css
/* Gradient orb — fades in and out over 5s */
@keyframes loopGradient {
  0%   { opacity: 0; }
  50%  { opacity: 1; }
  100% { opacity: 0; }
}

/* Scroll indicator pulse — breathes every 4s */
@keyframes pulse {
  0%   { transform: scale3d(1, 0, 1); }
  50%  { transform: scale3d(1, 1, 1); opacity: 1; }
  100% { transform: scale3d(1, 0, 1); }
}
```

---

## 8. Scroll Trigger Data Attributes

| Attribute | Purpose |
|---|---|
| `[stagger-scroll]` | Triggers staggered text reveal on scroll into view |
| `[stagger-text]` | Marks text for character/word splitting |
| `[split-text]` | Text splitting for per-character animation |
| `[grid-anim]` | Triggers 3D grid parallax animation |
| `[data-start="hidden"]` | Element starts invisible, animates in on scroll |

---

## 9. Performance Optimizations

```css
will-change: opacity, transform;    /* pre-promotes to GPU */
transform: translateZ(0);           /* force compositing layer */
backface-visibility: hidden;        /* avoid repaints on 3D transforms */
overflow: clip;                     /* cheaper than overflow: hidden */
```

---

## 10. Implementation Plan for Next.js

To replicate this in a Next.js project:

1. **Lenis** (`@studio-freight/lenis`) — smooth scroll with `lerp: 0.1`, `duration: 1.2`
2. **Framer Motion** or **GSAP ScrollTrigger** — scroll-triggered animations (replacing Webflow's system)
3. **4-tier transition speed** system (200/400/600/1200ms) as CSS variables or Tailwind config
4. **easeOutQuart** `cubic-bezier(0.165, 0.84, 0.44, 1)` as the signature easing
5. **3D perspective grid** with `perspective: 4000px` + `preserve-3d`
6. **Text splitting + stagger** for headline reveals (e.g. Framer Motion's `staggerChildren`)
7. **`will-change` + `translateZ(0)`** on all animated elements for GPU acceleration

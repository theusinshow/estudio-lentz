// src/motion/ParallaxImage.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({
  src, alt = "", className = "", amount = 14,
}: { src: string; alt?: string; className?: string; amount?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      // Fix 3: own scale via GSAP so transform is unified (avoids CSS `scale` Safari <17.4 bug)
      gsap.fromTo(ref.current!, { yPercent: -amount / 2, scale: 1.18 }, {
        yPercent: amount / 2, scale: 1.18, ease: "none",
        scrollTrigger: { trigger: ref.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced, amount]);

  // For reduced-motion, apply static transform so the buffer still exists (no edge gap)
  const reducedStyle = reduced ? { transform: "scale(1.18)" } : undefined;

  return <img ref={ref} src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} style={reducedStyle} />;
}

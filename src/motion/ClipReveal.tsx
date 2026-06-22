// src/motion/ClipReveal.tsx
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function ClipReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current!, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, [reduced]);
  return <div ref={ref} className={className} style={{ clipPath: reduced ? "none" : "inset(0 100% 0 0)" }}>{children}</div>;
}

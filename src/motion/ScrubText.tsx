// src/motion/ScrubText.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current!.querySelectorAll(".w"), {
        opacity: 1, stagger: 0.05, ease: "none",
        scrollTrigger: { trigger: ref.current!, start: "top 75%", end: "bottom 70%", scrub: 1 },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="w" style={{ opacity: reduced ? 1 : 0.16 }}>{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </p>
  );
}

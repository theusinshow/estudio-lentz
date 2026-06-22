// src/motion/RevealText.tsx
import { useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({
  as: Tag = "h2", lines, className = "", delay = 0,
}: { as?: ElementType; lines: string[]; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const inner = ref.current.querySelectorAll<HTMLElement>(".rt-inner");
    const ctx = gsap.context(() => {
      gsap.from(inner, {
        yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.09, delay,
        scrollTrigger: { trigger: ref.current!, start: "top 85%" },
      });
    }, ref.current!);
    return () => ctx.revert();
  }, [reduced, delay, lines.join("")]);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="rt-inner block" dangerouslySetInnerHTML={{ __html: l }} />
        </span>
      ))}
    </Tag>
  );
}

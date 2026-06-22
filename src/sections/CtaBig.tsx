// src/sections/CtaBig.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function CtaBig() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { scale: 0.8, opacity: 0.4 }, {
        scale: 1, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ref.current!, start: "top 85%", end: "center center", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section className="flex min-h-[80vh] items-center justify-center py-40 text-center">
      <div className="wrap">
        <h2 ref={ref} className="font-display text-[clamp(48px,12vw,180px)] font-black uppercase leading-[0.86] tracking-tight">
          Vamos construir<br />o <span className="text-acc">seu</span>
        </h2>
        <a href="mailto:contato@estudiolentz.com.br" className="mt-9 inline-block rounded-full border border-fg px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-acc hover:bg-acc">contato@estudiolentz.com.br</a>
      </div>
    </section>
  );
}

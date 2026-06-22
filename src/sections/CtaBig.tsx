// src/sections/CtaBig.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "../motion/RevealText";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { WHATSAPP_URL, MAILTO } from "../content/contact";

gsap.registerPlugin(ScrollTrigger);

export default function CtaBig() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll(".cta-fade"), {
        y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ref.current!, start: "top 72%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-28 md:py-40">
      <div className="wrap">
        <RevealText
          as="h2"
          className="font-display text-[clamp(52px,12vw,168px)] font-black uppercase leading-[0.86] tracking-tight"
          lines={["Do terreno", 'ao <span class="text-acc">partido</span>']}
        />
        <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p className="cta-fade max-w-[44ch] text-lg leading-relaxed text-fg/80">
            Conte o que você quer construir. Devolvemos um pensamento, não um render.
          </p>
          <div className="cta-fade flex flex-col items-start gap-4 sm:flex-row sm:items-center md:flex-col md:items-end lg:flex-row lg:items-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full bg-acc px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-fg"
            >
              Falar no WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href={MAILTO}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-mut underline-offset-4 transition-colors hover:text-fg hover:underline"
            >
              ou por e-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

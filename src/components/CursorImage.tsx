// src/components/CursorImage.tsx
import { useEffect, useRef } from "react";

export default function CursorImage({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  // Fix 8: keep active in a ref so the rAF loop can read it without closure staleness
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const loop = () => {
      const p = pos.current;
      p.cx += (p.tx - p.cx) * 0.13; p.cy += (p.ty - p.cy) * 0.13;
      // Fix 8: skip the DOM write when not active to avoid unnecessary style churn
      if (activeRef.current && ref.current) {
        ref.current.style.transform = `translate(${p.cx}px, ${p.cy}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[60] h-[240px] w-[330px] overflow-hidden transition-opacity duration-300"
      style={{ opacity: active ? 1 : 0 }} aria-hidden>
      {src && <img src={src} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}

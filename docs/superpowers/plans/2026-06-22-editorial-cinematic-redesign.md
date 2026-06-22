# Estúdio Lentz v2 — Editorial Cinematic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Estúdio Lentz site as a dark, cinematic, typography-led architecture portfolio with heavy GSAP scroll motion and premium hover interactions, replacing the abandoned 2D-plan version.

**Architecture:** Vite + React SPA, multi-page via react-router. A persistent Layout (fixed Header + Footer) wraps routed pages. Lenis drives smooth scroll, synced to GSAP ScrollTrigger which animates each element directly (no global progress store). Reusable motion primitives (RevealText, ParallaxImage, ScrubText, ClipReveal, CursorImage) are composed into Home sections and the Projetos pages. `prefers-reduced-motion` disables Lenis + all scroll animation and shows content statically.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind, GSAP + ScrollTrigger, Lenis, react-router-dom, Framer Motion (route/menu transitions), Zustand (menu state).

## Global Constraints

- Palette tokens (verbatim): `--bg:#0c0c0b`, `--fg:#f1ede6`, `--mut:#8f8b82`, `--acc:#fb3640`, `--line:rgba(241,237,230,.14)`.
- Fonts: Archivo (900 display), Space Mono (mono labels), Inter (body). Never hardcode colors — use Tailwind tokens / CSS vars; in JS use `cssVar()`.
- TypeScript strict, no unjustified `any`. Components PascalCase, hooks `useCamelCase`.
- Code/commits in English; site copy in Portuguese.
- `prefers-reduced-motion: reduce` MUST disable Lenis and all GSAP scroll animation; content stays fully visible.
- Verification per task: `npm run build` (tsc + vite) and `npm run lint` MUST pass; behavioral checks via Playwright against `npm run dev` (localhost:5173).
- It is a fictitious demo: invent coherent PT content; images from curated Unsplash.

---

## File Structure

```
src/
├── main.tsx                      # mount + import styles
├── App.tsx                       # BrowserRouter + routes + Layout
├── routes/
│   ├── Layout.tsx                # Header + Outlet + Footer + Lenis + ScrollToTop
│   ├── Home.tsx
│   ├── Projetos.tsx
│   ├── ProjetoDetalhe.tsx
│   └── Contato.tsx
├── sections/                     # Home sections
│   ├── Hero.tsx
│   ├── Statement.tsx
│   ├── FeaturedProjects.tsx
│   ├── Approach.tsx
│   ├── Testimonials.tsx
│   └── CtaBig.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx           # hover B (home grid)
│   ├── ProjectListRow.tsx        # hover A row
│   └── CursorImage.tsx           # floating image following cursor
├── motion/
│   ├── RevealText.tsx            # line mask reveal
│   ├── ParallaxImage.tsx
│   ├── ScrubText.tsx             # word-by-word scrub reveal
│   └── ClipReveal.tsx            # clip-path inset reveal wrapper
├── hooks/
│   ├── useLenis.ts
│   ├── useReducedMotion.ts
│   └── useIsDesktop.ts
├── content/data/projects.ts      # expanded project data
├── store/useUiStore.ts           # mobile menu open state
├── utils/{math.ts,cssVar.ts}     # keep
└── styles/{tokens.css,index.css} # dark palette
```

**Removed:** `src/plan/*`, `src/hooks/useScrollBridge.ts`, `src/hooks/useLowPerf.ts`, `src/hooks/useScrollActive.ts` (if present), `src/ui/ScrollDebug.tsx`, `src/store/useScrollStore.ts`, `src/content/ContentLayer.tsx`, `src/ui/{TechLabel,ScrollHint,Nav}.tsx`. (three/R3F already removed in a prior step — confirm none remain in package.json.)

---

### Task 1: Reset to dark shell — deps, tokens, fonts, router skeleton

**Files:**
- Delete: `src/plan/` (whole dir), `src/hooks/useScrollBridge.ts`, `src/hooks/useLowPerf.ts`, `src/store/useScrollStore.ts`, `src/content/ContentLayer.tsx`, `src/ui/Nav.tsx`, `src/ui/ScrollHint.tsx`, `src/ui/TechLabel.tsx`, `src/ui/ScrollDebug.tsx`
- Modify: `src/styles/tokens.css`, `src/styles/index.css`, `tailwind.config.js`, `index.html`, `src/App.tsx`, `src/main.tsx`
- Create: `src/routes/Layout.tsx`, `src/routes/Home.tsx`, `src/routes/Projetos.tsx`, `src/routes/ProjetoDetalhe.tsx`, `src/routes/Contato.tsx`

**Interfaces:**
- Produces: routes `/`, `/projetos`, `/projetos/:slug`, `/contato`; `Layout` with `<Outlet/>`.

- [ ] **Step 1: Install deps**

```bash
npm install lenis react-router-dom
```

- [ ] **Step 2: Remove dead code**

```bash
rm -rf src/plan
rm -f src/hooks/useScrollBridge.ts src/hooks/useLowPerf.ts src/store/useScrollStore.ts \
      src/content/ContentLayer.tsx src/ui/Nav.tsx src/ui/ScrollHint.tsx src/ui/TechLabel.tsx src/ui/ScrollDebug.tsx
```

- [ ] **Step 3: Dark tokens** — overwrite `src/styles/tokens.css`

```css
/* Design tokens — editorial cinemático (tema escuro). Fonte de verdade das cores. */
:root {
  --bg: #0c0c0b;        /* preto cinema */
  --fg: #f1ede6;        /* off-white */
  --mut: #8f8b82;       /* texto secundário */
  --acc: #fb3640;       /* vermelho técnico — único acento */
  --line: rgba(241, 237, 230, 0.14);
}
```

- [ ] **Step 4: Base styles** — overwrite `src/styles/index.css`

```css
@import "./tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { -webkit-font-smoothing: antialiased; }
  body { @apply bg-bg text-fg font-sans; overflow-x: hidden; }
  ::selection { background: var(--acc); color: var(--bg); }
}
/* Lenis */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }
```

- [ ] **Step 5: Tailwind tokens** — overwrite `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        mut: "var(--mut)",
        acc: "var(--acc)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Fonts + theme** — in `index.html`, replace the Google Fonts `<link>` with Archivo weights and set theme-color dark. Ensure this `<link>` is in `<head>`:

```html
<meta name="theme-color" content="#0c0c0b" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 7: Route stubs** — create each route returning a labeled placeholder

```tsx
// src/routes/Home.tsx
export default function Home() {
  return <div className="pt-[68px]"><section className="wrap py-40"><h1 className="font-display text-6xl uppercase">Home</h1></section></div>;
}
```

```tsx
// src/routes/Projetos.tsx
export default function Projetos() {
  return <div className="pt-[68px]"><section className="wrap py-40"><h1 className="font-display text-6xl uppercase">Projetos</h1></section></div>;
}
```

```tsx
// src/routes/ProjetoDetalhe.tsx
import { useParams } from "react-router-dom";
export default function ProjetoDetalhe() {
  const { slug } = useParams();
  return <div className="pt-[68px]"><section className="wrap py-40"><h1 className="font-display text-6xl uppercase">{slug}</h1></section></div>;
}
```

```tsx
// src/routes/Contato.tsx
export default function Contato() {
  return <div className="pt-[68px]"><section className="wrap py-40"><h1 className="font-display text-6xl uppercase">Contato</h1></section></div>;
}
```

- [ ] **Step 8: Layout** — create `src/routes/Layout.tsx` (Header/Footer added in Task 5; stub now)

```tsx
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-line bg-bg/60 backdrop-blur">
        <div className="wrap flex h-full items-center justify-between">
          <span className="font-display font-extrabold uppercase tracking-tight">Estúdio Lentz</span>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-line py-10">
        <div className="wrap font-mono text-xs uppercase tracking-widest text-mut">©2026 Estúdio Lentz</div>
      </footer>
    </>
  );
}
```

- [ ] **Step 9: App router** — overwrite `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout";
import Home from "./routes/Home";
import Projetos from "./routes/Projetos";
import ProjetoDetalhe from "./routes/ProjetoDetalhe";
import Contato from "./routes/Contato";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:slug" element={<ProjetoDetalhe />} />
          <Route path="contato" element={<Contato />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 10: `.wrap` utility** — add to `src/styles/index.css` under `@layer components`

```css
@layer components {
  .wrap { @apply mx-auto w-full max-w-[1380px] px-6 md:px-10; }
}
```

- [ ] **Step 11: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both pass, no errors. (Fix any leftover imports of deleted files.)

- [ ] **Step 12: Verify routes render**

Run `npm run dev`; with Playwright, visit `/`, `/projetos`, `/projetos/casa-patio`, `/contato`; assert each shows its placeholder `h1` and the fixed header. No console errors.

- [ ] **Step 13: Commit**

```bash
git add -A && git commit -m "feat: reset to dark router shell, drop 2D-plan version"
```

---

### Task 2: Smooth scroll (Lenis) + reduced-motion + ScrollTrigger wiring

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useIsDesktop.ts`, `src/hooks/useLenis.ts`
- Modify: `src/routes/Layout.tsx`

**Interfaces:**
- Produces: `useReducedMotion(): boolean`, `useIsDesktop(): boolean`, `useLenis(enabled: boolean): void`. ScrollTrigger registered globally.

- [ ] **Step 1: useReducedMotion**

```ts
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: useIsDesktop** (gates cursor-image / heavy effects)

```ts
// src/hooks/useIsDesktop.ts
import { useEffect, useState } from "react";

export function useIsDesktop(minWidth = 1024): boolean {
  const q = `(min-width:${minWidth}px) and (pointer:fine)`;
  const [ok, setOk] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setOk(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return ok;
}
```

- [ ] **Step 3: useLenis** — sync Lenis to GSAP ticker + ScrollTrigger

```ts
// src/hooks/useLenis.ts
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000); // gsap ticker = seconds, lenis = ms
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
```

- [ ] **Step 4: Wire into Layout** — modify `src/routes/Layout.tsx` to call hooks + scroll-to-top on route change

```tsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Layout() {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  useLenis(!reduced);

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <>
      {/* header from Task 1 stub stays for now */}
      <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-line bg-bg/60 backdrop-blur">
        <div className="wrap flex h-full items-center justify-between">
          <span className="font-display font-extrabold uppercase tracking-tight">Estúdio Lentz</span>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-line py-10">
        <div className="wrap font-mono text-xs uppercase tracking-widest text-mut">©2026 Estúdio Lentz</div>
      </footer>
    </>
  );
}
```

- [ ] **Step 5: Verify** — `npm run build && npm run lint` pass. `npm run dev`: scrolling feels smoothed (Lenis adds `class="lenis"` to `<html>`); Playwright asserts `document.documentElement.classList.contains('lenis')` is true normally and, under `reduced_motion:"reduce"` context, false. No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: lenis smooth scroll + reduced-motion + scrolltrigger wiring"
```

---

### Task 3: Project data + image set

**Files:**
- Modify: `src/content/data/projects.ts`

**Interfaces:**
- Produces:
  `interface Project { slug:string; name:string; year:number; local:string; area:string; type:string; blurb:string; cover:string; gallery:string[]; description:string; }`
  `export const PROJECTS: Project[]`

- [ ] **Step 1: Expand data** — overwrite `src/content/data/projects.ts`

```ts
export interface Project {
  slug: string;
  name: string;
  year: number;
  local: string;
  area: string;
  type: string;
  blurb: string;       // short, for cards/list
  cover: string;
  gallery: string[];
  description: string; // long, for detail page
}

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const PROJECTS: Project[] = [
  {
    slug: "casa-patio", name: "Casa Pátio", year: 2025, local: "Lagoa da Conceição — SC",
    area: "248 m²", type: "Residência",
    blurb: "Um pátio central organiza a casa: luz e ventilação cruzada para todos os ambientes.",
    cover: u("photo-1600585154340-be6161a56a0c"),
    gallery: [u("photo-1600585154340-be6161a56a0c"), u("photo-1600607687939-ce8a6c25118c"), u("photo-1600566753190-17f0baa2a6c3")],
    description: "Concreto aparente e madeira em torno de um vazio central. O pátio traz luz natural ao miolo do programa e cria ventilação cruzada permanente — a casa respira sem depender de fachada.",
  },
  {
    slug: "galpao-cru", name: "Galpão Cru", year: 2024, local: "Biguaçu — SC",
    area: "1.120 m²", type: "Retrofit",
    blurb: "Reconversão de um galpão dos anos 80 em estúdios criativos.",
    cover: u("photo-1497366811353-6870744d04b2"),
    gallery: [u("photo-1497366811353-6870744d04b2"), u("photo-1524758631624-e2822e304c36"), u("photo-1503387762-592deb58ef4e")],
    description: "A estrutura existente foi exposta e celebrada; o novo entra em aço e vidro, sem mimetizar o antigo. O contraste entre a casca bruta e os volumes inseridos organiza os estúdios criativos.",
  },
  {
    slug: "edificio-lamina", name: "Edifício Lâmina", year: 2026, local: "Centro, Florianópolis — SC",
    area: "3.400 m²", type: "Comercial",
    blurb: "Uma lâmina estreita orientada para o sol e a baía, com brises de concreto.",
    cover: u("photo-1486406146926-c627a92ad1ab"),
    gallery: [u("photo-1486406146926-c627a92ad1ab"), u("photo-1454165804606-c3d57bc86b40"), u("photo-1469474968028-56623f02e42e")],
    description: "Brises de concreto pré-moldado dão ritmo à fachada e controlam o ganho térmico. A lâmina estreita garante luz natural e ventilação a todas as lajes corporativas, com vista para a baía.",
  },
  {
    slug: "refugio-mata", name: "Refúgio Mata", year: 2023, local: "Rancho Queimado — SC",
    area: "96 m²", type: "Casa de campo",
    blurb: "Implantação leve sobre pilotis na mata atlântica.",
    cover: u("photo-1518780664697-55e3ad937233"),
    gallery: [u("photo-1518780664697-55e3ad937233"), u("photo-1449844908441-8829872d2607"), u("photo-1416331108676-a22ccb276e35")],
    description: "Volume único de madeira sobre pilotis que toca o mínimo no terreno. A face norte se abre por completo para a paisagem; a mata atravessa por baixo da casa sem ser interrompida.",
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
```

- [ ] **Step 2: Verify** — `npm run build` passes. `node -e "import('./...')"` not needed; type-check covers it.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: expand project data with covers, gallery, descriptions"
```

---

### Task 4: Motion primitives

**Files:**
- Create: `src/motion/RevealText.tsx`, `src/motion/ParallaxImage.tsx`, `src/motion/ScrubText.tsx`, `src/motion/ClipReveal.tsx`

**Interfaces:**
- Produces:
  - `RevealText({ as?, lines: string[], className?, delay? })` — each line masked, slides up on enter.
  - `ParallaxImage({ src, alt?, className?, amount? })` — `<img>` translated on scroll.
  - `ScrubText({ text, className? })` — words fade 0.16→1 on scrub.
  - `ClipReveal({ children, className? })` — wraps content, reveals via clip-path on enter.
- Consumes: `useReducedMotion`.

- [ ] **Step 1: RevealText**

```tsx
// src/motion/RevealText.tsx
import { useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function RevealText({
  as: Tag = "h2", lines, className = "", delay = 0,
}: { as?: ElementType; lines: string[]; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const inner = ref.current.querySelectorAll<HTMLElement>(".rt-inner");
    const ctx = gsap.context(() => {
      gsap.from(inner, {
        yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.09, delay,
        scrollTrigger: { trigger: ref.current!, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced, delay]);
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
```

- [ ] **Step 2: ParallaxImage**

```tsx
// src/motion/ParallaxImage.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function ParallaxImage({
  src, alt = "", className = "", amount = 14,
}: { src: string; alt?: string; className?: string; amount?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { yPercent: -amount / 2 }, {
        yPercent: amount / 2, ease: "none",
        scrollTrigger: { trigger: ref.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [reduced, amount]);
  return <img ref={ref} src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} style={{ scale: "1.18" }} />;
}
```

- [ ] **Step 3: ScrubText**

```tsx
// src/motion/ScrubText.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
```

- [ ] **Step 4: ClipReveal**

```tsx
// src/motion/ClipReveal.tsx
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
```

- [ ] **Step 5: Verify** — `npm run build && npm run lint` pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: gsap motion primitives (reveal/parallax/scrub/clip)"
```

---

### Task 5: Header + Footer (full)

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/store/useUiStore.ts`
- Modify: `src/routes/Layout.tsx`

**Interfaces:**
- Consumes: react-router `Link`/`NavLink`.
- Produces: `<Header/>`, `<Footer/>`, `useUiStore` with `{ menuOpen, setMenuOpen }`.

- [ ] **Step 1: UI store**

```ts
// src/store/useUiStore.ts
import { create } from "zustand";
interface UiState { menuOpen: boolean; setMenuOpen: (v: boolean) => void; }
export const useUiStore = create<UiState>((set) => ({ menuOpen: false, setMenuOpen: (v) => set({ menuOpen: v }) }));
```

- [ ] **Step 2: Header** — fixed, blur, nav + CTA + mobile toggle

```tsx
// src/components/Header.tsx
import { Link, NavLink } from "react-router-dom";
import { useUiStore } from "../store/useUiStore";

const LINKS = [
  { to: "/projetos", label: "Projetos" },
  { to: "/contato", label: "Contato" },
];

export default function Header() {
  const { menuOpen, setMenuOpen } = useUiStore();
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-line bg-bg/55 backdrop-blur">
      <div className="wrap flex h-full items-center justify-between">
        <Link to="/" className="font-display text-[15px] font-extrabold uppercase tracking-tight">Estúdio Lentz</Link>
        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.18em] md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "text-fg" : "text-mut transition-colors hover:text-fg")}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/contato" className="hidden rounded-full border border-fg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-fg hover:text-bg md:inline-block">Iniciar projeto</Link>
        <button className="font-mono text-[11px] uppercase tracking-widest md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? "Fechar" : "Menu"}</button>
      </div>
      {menuOpen && (
        <div className="border-b border-line bg-bg px-6 py-6 md:hidden">
          {[...LINKS, { to: "/", label: "Início" }].map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2 font-display text-3xl uppercase">{l.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Footer**

```tsx
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
        <span>©2026 Estúdio Lentz</span>
        <span className="flex gap-5">
          <a href="#" className="transition-colors hover:text-fg">Instagram</a>
          <a href="#" className="transition-colors hover:text-fg">LinkedIn</a>
          <a href="#" className="transition-colors hover:text-fg">Behance</a>
        </span>
        <span>Coded by M</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Use in Layout** — replace stub header/footer in `src/routes/Layout.tsx` with `<Header />` and `<Footer />` (import them; keep the Lenis/scroll-to-top logic from Task 2).

- [ ] **Step 5: Verify** — build+lint pass. Playwright: header fixed across routes, nav links navigate, mobile (<768) shows Menu toggle that opens/closes. No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: header (nav + mobile menu) and footer"
```

---

### Task 6: Home — Hero section

**Files:**
- Create: `src/sections/Hero.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:**
- Consumes: `RevealText`, `ParallaxImage`, `PROJECTS[0].cover` (or a dedicated hero image).
- Produces: `<Hero/>`.

- [ ] **Step 1: Hero**

```tsx
// src/sections/Hero.tsx
import RevealText from "../motion/RevealText";
import ParallaxImage from "../motion/ParallaxImage";

const HERO_IMG = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=80&auto=format&fit=crop";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0">
        <ParallaxImage src={HERO_IMG} amount={16} className="opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/45 via-bg/25 to-bg" />
      </div>
      <div className="wrap relative z-10 pb-14">
        <div className="mb-6 flex gap-5 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span>Arquitetura</span><span>Florianópolis — SC</span><span>Desde 2018</span>
        </div>
        <RevealText as="h1" className="font-display text-[clamp(56px,11vw,160px)] font-black uppercase leading-[0.86] tracking-tight"
          lines={["Construir", 'é <span class="text-acc">pensar</span>']} />
        <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[440px] text-lg leading-relaxed text-fg/85">Projetamos de dentro para fora — estrutura, luz e material em linguagem direta. A obra é a consequência de um pensamento claro.</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mut">↓ Role para ver</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in Home** — overwrite `src/routes/Home.tsx`

```tsx
import Hero from "../sections/Hero";
export default function Home() {
  return <Hero />;
}
```

- [ ] **Step 3: Verify** — build+lint pass. Playwright at `/`: hero fills viewport, headline visible after load, no overlap, no console errors. Screenshot for visual sanity.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home hero with mask reveal + parallax"
```

---

### Task 7: Home — Statement section

**Files:**
- Create: `src/sections/Statement.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:** Consumes `ScrubText`. Produces `<Statement/>`.

- [ ] **Step 1: Statement**

```tsx
// src/sections/Statement.tsx
import ScrubText from "../motion/ScrubText";

export default function Statement() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="h-px w-9 bg-acc" />Estúdio
        </div>
        <ScrubText
          className="max-w-[18ch] font-display text-[clamp(28px,5vw,72px)] font-medium uppercase leading-[1.05] tracking-tight"
          text="Tratamos concreto, luz e vazio como matéria-prima do pensamento."
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount** — add `<Statement />` after `<Hero />` in `Home.tsx`.

- [ ] **Step 3: Verify** — build+lint; Playwright: scrolling into the section brightens the words (sample first word opacity > last word opacity mid-scroll). No errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home statement with scrub word reveal"
```

---

### Task 8: Home — FeaturedProjects grid + ProjectCard (hover B)

**Files:**
- Create: `src/components/ProjectCard.tsx`, `src/sections/FeaturedProjects.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:**
- Consumes: `Project`, `PROJECTS`, react-router `Link`, `ClipReveal`.
- Produces: `ProjectCard({ project })`, `<FeaturedProjects/>`.

- [ ] **Step 1: ProjectCard (hover B)**

```tsx
// src/components/ProjectCard.tsx
import { Link } from "react-router-dom";
import type { Project } from "../content/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projetos/${project.slug}`} className="group relative block aspect-[16/11] overflow-hidden">
      <img src={project.cover} alt={project.name} loading="lazy"
        className="h-full w-full object-cover brightness-[0.8] grayscale-[0.4] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.07] group-hover:grayscale-0 group-hover:brightness-100" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-bg/10 to-bg/70 p-6">
        <h3 className="translate-y-9 font-display text-[clamp(26px,3vw,44px)] font-black uppercase leading-none tracking-tight transition-transform duration-500 ease-out group-hover:translate-y-0">{project.name}</h3>
        <div className="mt-3.5 flex translate-y-4 items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span>{project.local} · {project.area}</span>
          <span className="rounded-full border border-fg px-3 py-1.5">Ver projeto →</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: FeaturedProjects**

```tsx
// src/sections/FeaturedProjects.tsx
import { PROJECTS } from "../content/data/projects";
import ProjectCard from "../components/ProjectCard";
import ClipReveal from "../motion/ClipReveal";

export default function FeaturedProjects() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="h-px w-9 bg-acc" />Projetos selecionados
        </div>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {PROJECTS.map((p) => (
            <ClipReveal key={p.slug}><ProjectCard project={p} /></ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount** — add `<FeaturedProjects />` after `<Statement />`.

- [ ] **Step 4: Verify** — build+lint; Playwright: 4 cards, hovering a card raises title + shows "Ver projeto →"; clicking navigates to `/projetos/:slug`. No errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: home featured projects grid with hover-reveal cards"
```

---

### Task 9: Home — Approach section

**Files:**
- Create: `src/sections/Approach.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:** Produces `<Approach/>`.

- [ ] **Step 1: Approach**

```tsx
// src/sections/Approach.tsx
const STEPS = [
  { n: "01", t: "Lógica", d: "Todo projeto começa por um partido claro: estrutura e implantação antes da forma." },
  { n: "02", t: "Matéria", d: "Concreto, madeira e vidro em estado bruto — sem ornamento, com intenção." },
  { n: "03", t: "Luz", d: "A luz natural é desenhada: orientação, vazios e aberturas como projeto." },
  { n: "04", t: "Habitar", d: "O espaço só termina quando é vivido. Entregamos obra, não render." },
];

export default function Approach() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="h-px w-9 bg-acc" />Abordagem
        </div>
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex min-h-[230px] flex-col justify-between bg-bg p-7 pb-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-acc">{s.n}</span>
              <div>
                <h4 className="font-display text-xl font-extrabold uppercase tracking-tight">{s.t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-mut">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount** — add `<Approach />` after `<FeaturedProjects />`.
- [ ] **Step 3: Verify** — build+lint; Playwright: 4 steps render in a row (desktop), stack on mobile. No errors.
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home approach section"
```

---

### Task 10: Home — Testimonials carousel

**Files:**
- Create: `src/sections/Testimonials.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:** Produces `<Testimonials/>` (manual prev/next, no autoplay — resolves open question).

- [ ] **Step 1: Testimonials**

```tsx
// src/sections/Testimonials.tsx
import { useState } from "react";

const ITEMS = [
  { q: "Transformaram um terreno difícil na casa que a gente não sabia que queria.", by: "Marina A.", role: "Casa Pátio", ph: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80&auto=format&fit=crop" },
  { q: "Rigor técnico e sensibilidade na mesma medida. Raro.", by: "Eduardo M.", role: "Galpão Cru", ph: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop" },
  { q: "Entenderam a empresa antes de desenhar uma linha.", by: "Clara V.", role: "Edifício Lâmina", ph: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80&auto=format&fit=crop" },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const it = ITEMS[i];
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="flex items-center gap-3"><span className="h-px w-9 bg-acc" />Depoimentos</span>
          <span className="flex items-center gap-4">
            <button aria-label="Anterior" onClick={() => setI((i - 1 + ITEMS.length) % ITEMS.length)} className="transition-colors hover:text-fg">←</button>
            <span>{String(i + 1).padStart(2, "0")} / {String(ITEMS.length).padStart(2, "0")}</span>
            <button aria-label="Próximo" onClick={() => setI((i + 1) % ITEMS.length)} className="transition-colors hover:text-fg">→</button>
          </span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-8">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-full"><img src={it.ph} alt="" className="h-full w-full object-cover" /></div>
          <div>
            <blockquote className="max-w-[20ch] font-display text-[clamp(22px,2.8vw,36px)] font-medium leading-[1.25] tracking-tight">"{it.q}"</blockquote>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">{it.by} · Cliente, {it.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount** — add `<Testimonials />` after `<Approach />`.
- [ ] **Step 3: Verify** — build+lint; Playwright: clicking → changes quote + indicator. No errors.
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home testimonials carousel"
```

---

### Task 11: Home — CtaBig + assemble

**Files:**
- Create: `src/sections/CtaBig.tsx`
- Modify: `src/routes/Home.tsx`

**Interfaces:** Consumes `RevealText`. Produces `<CtaBig/>`.

- [ ] **Step 1: CtaBig**

```tsx
// src/sections/CtaBig.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
```

- [ ] **Step 2: Assemble Home** — final `src/routes/Home.tsx`

```tsx
import Hero from "../sections/Hero";
import Statement from "../sections/Statement";
import FeaturedProjects from "../sections/FeaturedProjects";
import Approach from "../sections/Approach";
import Testimonials from "../sections/Testimonials";
import CtaBig from "../sections/CtaBig";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <FeaturedProjects />
      <Approach />
      <Testimonials />
      <CtaBig />
    </>
  );
}
```

- [ ] **Step 3: Verify** — build+lint; Playwright: full-scroll the home, all 6 sections present in order, no overlap, no console errors; screenshot top→bottom.
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home cta + full assembly"
```

---

### Task 12: Projetos list + CursorImage + ProjectListRow (hover A)

**Files:**
- Create: `src/components/CursorImage.tsx`, `src/components/ProjectListRow.tsx`
- Modify: `src/routes/Projetos.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `useIsDesktop`, react-router `Link`.
- Produces: `CursorImage({ src, active })` (fixed, follows cursor via rAF lerp), `ProjectListRow({ project, onEnter, onLeave })`.

- [ ] **Step 1: CursorImage**

```tsx
// src/components/CursorImage.tsx
import { useEffect, useRef } from "react";

export default function CursorImage({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const loop = () => {
      const p = pos.current;
      p.cx += (p.tx - p.cx) * 0.13; p.cy += (p.ty - p.cy) * 0.13;
      if (ref.current) ref.current.style.transform = `translate(${p.cx}px, ${p.cy}px) translate(-50%,-50%)`;
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
```

- [ ] **Step 2: ProjectListRow**

```tsx
// src/components/ProjectListRow.tsx
import { Link } from "react-router-dom";
import type { Project } from "../content/data/projects";

export default function ProjectListRow({
  project, onEnter, onLeave,
}: { project: Project; onEnter: () => void; onLeave: () => void }) {
  return (
    <Link to={`/projetos/${project.slug}`} onMouseEnter={onEnter} onMouseLeave={onLeave}
      className="group relative flex items-baseline justify-between gap-5 border-b border-line py-7 pl-1.5 transition-[padding] duration-300 hover:pl-7">
      <span className="pointer-events-none absolute left-[-4px] top-1/2 -translate-y-1/2 translate-x-[-10px] text-2xl text-acc opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
      <span className="font-display text-[clamp(30px,5.5vw,72px)] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-300 group-hover:text-acc">{project.name}</span>
      <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-mut transition-colors duration-300 group-hover:text-fg">{project.type} · {project.year}</span>
    </Link>
  );
}
```

- [ ] **Step 3: Projetos route**

```tsx
// src/routes/Projetos.tsx
import { useState } from "react";
import { PROJECTS } from "../content/data/projects";
import ProjectListRow from "../components/ProjectListRow";
import CursorImage from "../components/CursorImage";
import { useIsDesktop } from "../hooks/useIsDesktop";

export default function Projetos() {
  const desktop = useIsDesktop();
  const [hover, setHover] = useState<string | null>(null);
  const active = PROJECTS.find((p) => p.slug === hover);
  return (
    <div className="pt-[68px]">
      <section className="py-24">
        <div className="wrap">
          <div className="mb-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
            <span className="h-px w-9 bg-acc" />Projetos
          </div>
          <div className="border-t border-line">
            {PROJECTS.map((p) => (
              <ProjectListRow key={p.slug} project={p}
                onEnter={() => desktop && setHover(p.slug)} onLeave={() => setHover(null)} />
            ))}
          </div>
        </div>
      </section>
      {desktop && <CursorImage src={active?.cover ?? ""} active={!!active} />}
    </div>
  );
}
```

- [ ] **Step 4: Verify** — build+lint; Playwright (desktop viewport, pointer fine): hovering a row turns name red + reveals arrow; a floating image appears and follows the cursor. On a mobile viewport, the cursor image does NOT mount. Clicking a row navigates. No errors.
- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: projetos list with cursor-follow image (hover A)"
```

---

### Task 13: Projeto detalhe

**Files:**
- Modify: `src/routes/ProjetoDetalhe.tsx`

**Interfaces:** Consumes `getProject`, `ClipReveal`, `RevealText`, react-router `useParams`/`Link`/`Navigate`.

- [ ] **Step 1: Detail route**

```tsx
// src/routes/ProjetoDetalhe.tsx
import { useParams, Link, Navigate } from "react-router-dom";
import { PROJECTS, getProject } from "../content/data/projects";
import ClipReveal from "../motion/ClipReveal";
import RevealText from "../motion/RevealText";

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  if (!project) return <Navigate to="/projetos" replace />;
  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="pt-[68px]">
      <section className="py-20">
        <div className="wrap">
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">{project.type} · {project.year}</div>
          <RevealText as="h1" className="font-display text-[clamp(44px,9vw,140px)] font-black uppercase leading-[0.86] tracking-tight" lines={[project.name]} />
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mut md:grid-cols-4">
            <div><div className="text-fg">Local</div>{project.local}</div>
            <div><div className="text-fg">Área</div>{project.area}</div>
            <div><div className="text-fg">Tipo</div>{project.type}</div>
            <div><div className="text-fg">Ano</div>{project.year}</div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap grid gap-5">
          {project.gallery.map((src, i) => (
            <ClipReveal key={i} className="aspect-[16/10] overflow-hidden">
              <img src={src} alt={`${project.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </ClipReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-24">
        <div className="wrap max-w-[60ch] text-lg leading-relaxed text-fg/85">{project.description}</div>
      </section>

      <section className="border-t border-line py-20">
        <div className="wrap flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Próximo projeto</span>
          <Link to={`/projetos/${next.slug}`} className="font-display text-[clamp(28px,5vw,64px)] font-black uppercase tracking-tight transition-colors hover:text-acc">{next.name} →</Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — build+lint; Playwright: visit `/projetos/casa-patio` → title, ficha (4 fields), gallery images reveal on scroll, description, "próximo projeto" link navigates to next; unknown slug redirects to `/projetos`. No errors.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: project detail page (hero, gallery, ficha, next)"
```

---

### Task 14: Contato

**Files:**
- Modify: `src/routes/Contato.tsx`

**Interfaces:** Consumes `RevealText`.

- [ ] **Step 1: Contato route**

```tsx
// src/routes/Contato.tsx
import RevealText from "../motion/RevealText";

export default function Contato() {
  return (
    <div className="pt-[68px]">
      <section className="flex min-h-[80vh] flex-col justify-center py-24">
        <div className="wrap">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut"><span className="h-px w-9 bg-acc" />Contato</div>
          <RevealText as="h1" className="font-display text-[clamp(40px,8vw,120px)] font-black uppercase leading-[0.88] tracking-tight" lines={["Vamos construir", 'o <span class="text-acc">seu</span>']} />
          <div className="mt-10 flex flex-col gap-3">
            <a href="mailto:contato@estudiolentz.com.br" className="font-mono text-lg uppercase tracking-wide text-acc underline-offset-8 hover:underline">contato@estudiolentz.com.br</a>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Florianópolis — SC · Atendimento em todo o Brasil</p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — build+lint; Playwright: `/contato` renders headline + email link (`href^="mailto:"`). No errors.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: contato page"
```

---

### Task 15: A11y / perf / SEO / docs + final verification

**Files:**
- Modify: `index.html` (meta/OG), `CLAUDE.md`, `public/sitemap.xml` (keep), `.eslintrc.cjs` (no change expected)
- Create: none

**Interfaces:** none.

- [ ] **Step 1: SEO/meta** — in `index.html` ensure: title "Estúdio Lentz — Arquitetura em Florianópolis", description, OG (`og:title/description/type/url`), `twitter:card`, `theme-color #0c0c0b`, canonical. (Most already present from earlier; update theme-color + any stale copy.)

- [ ] **Step 2: Reduced-motion audit** — verify every motion component early-returns when `useReducedMotion()` is true and renders final state (Hero text visible, ScrubText words opacity 1, ClipReveal `clip-path:none`, ParallaxImage static, CtaBig full scale). Fix any that animate-in from hidden without a reduced fallback.

- [ ] **Step 3: Update CLAUDE.md** — replace the "PLANTA TÉCNICA 2D" section with the editorial-cinematic direction: stack (router + Lenis + GSAP, no SVG-plan), golden rules (multi-page, GSAP-per-element motion, reduced-motion fallback, dark tokens), and the new folder map (routes/sections/motion/components). Keep commands.

- [ ] **Step 4: Final build + lint**

Run: `npm run build && npm run lint`
Expected: both pass.

- [ ] **Step 5: Full Playwright verification**

Against `npm run dev`:
- Desktop (1440×900): home full-scroll — 6 sections, hero reveal, statement scrub, cards hover, no console errors; navigate to /projetos (cursor image follows), open a project (gallery), /contato.
- Reduced-motion context: `html` has no `lenis` class; all content visible at progress 0; no animation required to read.
- Mobile (390×844): no cursor image; sections stack; menu toggle works.
Capture screenshots for the record; assert zero `pageerror`/console `error`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: a11y/perf/seo pass + update CLAUDE.md to editorial-cinematic direction"
```

---

## Self-Review

**Spec coverage:** §2 art direction → Task 1 (tokens/fonts). §3 IA/routes → Task 1 (router). §4 home sections → Tasks 6–11. §5 projetos list + detail → Tasks 12–13. §6 motion → Tasks 2,4 + per-section. §7 hovers → Task 8 (B), Task 12 (A). §8 stack/deps → Task 1. §9 folders → all. §10 data/images → Task 3. §11 a11y/perf → Task 15 + reduced-motion in every primitive. §12 removal → Task 1. §14 open decisions: testimonials autoplay → resolved manual (Task 10); pin+horizontal → resolved (home grid, projetos list — no horizontal pin needed); Lenis mobile → on (Lenis handles touch; cursor-image gated by `useIsDesktop`). All covered.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to". Every code step has full code.

**Type consistency:** `Project` fields used consistently (cover/gallery/description added in Task 3, consumed in 8/12/13). `getProject` defined Task 3, used Task 13. `useReducedMotion`/`useIsDesktop`/`useLenis` signatures consistent across tasks. Motion primitives' props match their usages.

> Note: this is a visual/motion frontend; "tests" are build typecheck + ESLint + Playwright behavioral/visual checks (no unit-test runner in the project), per Global Constraints.

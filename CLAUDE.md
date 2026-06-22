# CLAUDE.md

Contexto persistente do projeto. Leia este arquivo inteiro antes de qualquer tarefa.

---

## O que é

Site do **Estúdio Lentz**, escritório de arquitetura em Florianópolis. Direção atual:
**editorial-cinemático** — portfólio escuro e tipográfico com animações de scroll pesadas via
GSAP. Múltiplas páginas: Home, /projetos, /projetos/:slug, /contato. Navegação tradicional
com header fixo; sem canvas, sem SVG animado, sem WebGL.

Estética: dark cinema — concreto, tipografia display em Archivo 900, labels em Space Mono,
vermelho técnico como único acento.

## Stack (não trocar sem avisar)

- Vite + React 18 + TypeScript
- react-router-dom (BrowserRouter, multi-page)
- GSAP + ScrollTrigger (animação por elemento — sem store global de progress)
- Lenis (smooth scroll, sincronizado ao ticker do GSAP)
- Framer Motion (transições de rota e menu)
- Zustand (estado do menu mobile)
- Tailwind CSS (tokens via CSS vars)
- Deploy: Vercel

**Removido / não usar:** Three.js, React Three Fiber, SVG planta baixa (`src/plan/`),
`useScrollStore`, `useScrollBridge`, `useLowPerf`, `ContentLayer`.

## REGRAS DE OURO (não negociar)

1. **Páginas roteadas, header fixo.** Não há canvas/SVG fixo no fundo. O layout é
   `<Header fixed> + <Outlet> + <Footer>` via react-router. Cada rota é uma página normal.
2. **GSAP por elemento.** Cada primitivo de motion (`RevealText`, `ParallaxImage`,
   `ScrubText`, `ClipReveal`, `CtaBig`) cria seu próprio `gsap.context` + `ScrollTrigger`
   no `useLayoutEffect` e limpa via `ctx.revert()`. Não há store global de progresso.
3. **`prefers-reduced-motion: reduce` desabilita Lenis e toda animação GSAP.** Cada
   primitivo checa `useReducedMotion()` e retorna early — o conteúdo é exibido no estado
   final (visível, sem clip, sem yPercent). Nenhum elemento fica escondido em modo reduzido.
4. **Tokens de cor escuros, nunca hardcode.** Usar as CSS vars: `--bg:#0c0c0b`,
   `--fg:#f1ede6`, `--mut:#8f8b82`, `--acc:#fb3640`, `--line:rgba(241,237,230,.14)`.
   Em Tailwind: `bg-bg`, `text-fg`, `text-mut`, `text-acc`, `border-line`.
5. **Conteúdo = DOM real.** Textos, casos e contato em HTML real (SEO + a11y).
   `CursorImage` é `aria-hidden` e montado apenas quando `useIsDesktop()` é verdadeiro.
6. **Mobile / low-perf:** `CursorImage` só monta em desktop (`pointer: fine`). Lenis
   funciona em mobile mas `CursorImage` e efeitos pesados de cursor são bloqueados por
   `useIsDesktop`.

## Arquitetura de pastas (atual)

```
src/
├── main.tsx
├── App.tsx                         # BrowserRouter + rotas + Layout
├── routes/
│   ├── Layout.tsx                  # Header + Outlet + Footer + Lenis + ScrollToTop
│   ├── Home.tsx
│   ├── Projetos.tsx
│   ├── ProjetoDetalhe.tsx
│   └── Contato.tsx
├── sections/                       # seções da Home
│   ├── Hero.tsx
│   ├── Statement.tsx
│   ├── FeaturedProjects.tsx
│   ├── Approach.tsx
│   ├── Testimonials.tsx
│   └── CtaBig.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx             # hover B (grid home)
│   ├── ProjectListRow.tsx          # hover A (lista projetos)
│   └── CursorImage.tsx             # imagem flutuante que segue cursor
├── motion/
│   ├── RevealText.tsx              # máscara de linha, slide-up no scroll
│   ├── ParallaxImage.tsx           # yPercent scrub
│   ├── ScrubText.tsx              # palavras reveladas por scrub
│   └── ClipReveal.tsx              # clip-path inset reveal
├── hooks/
│   ├── useLenis.ts
│   ├── useReducedMotion.ts
│   └── useIsDesktop.ts
├── store/useUiStore.ts             # estado do menu mobile
├── content/data/projects.ts        # dados dos projetos (Project interface + PROJECTS[])
├── utils/{math.ts,cssVar.ts}
└── styles/{tokens.css,index.css}   # paleta escura + .wrap utility
```

## Comandos

```bash
npm install       # instala dependências
npm run dev       # vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build (typecheck + build de produção)
npm run preview   # preview do build de produção
npm run lint      # eslint
```

## Convenções

- TypeScript estrito. Sem `any` sem justificativa.
- Componentes em PascalCase, hooks em `useCamelCase`, utils em camelCase.
- Comentário só onde a intenção não é óbvia.
- Idioma do código/commits: inglês. Conteúdo do site e copy: português.

## Mapa dos docs

> Os docs abaixo descrevem versões anteriores (3D e 2D-planta). Estão mantidos como
> referência histórica. A fonte de verdade atual é este CLAUDE.md e o plano de
> implementação em `docs/superpowers/plans/2026-06-22-editorial-cinematic-redesign.md`.

| Arquivo | Conteúdo |
|---|---|
| `docs/ARCHITECTURE.md` | Decisões estruturais (versões anteriores) |
| `docs/SCROLL_MECHANICS.md` | Ponte GSAP→store (histórico) |
| `docs/ROADMAP.md` | Fases (histórico) |
| `docs/DESIGN_SYSTEM.md` | Tokens de cor, tipografia, labels técnicos |
| `docs/PERFORMANCE.md` | Performance, mobile, fallback, acessibilidade |

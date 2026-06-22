> ⚠️ **Histórico (versão 3D).** Estas 8 fases descrevem a construção 3D original (já concluída).
> O projeto depois pivotou para uma **planta técnica 2D em SVG** — ver `CLAUDE.md`. Mantido como
> registro.

# Roadmap — implementação por fases

Implementar e validar **uma fase por vez**. Cada fase tem critério de aceite — confirme que
passa antes de seguir. Não pular pro 3D antes da ponte de scroll funcionar.

---

## Fase 0 — Esqueleto

Setup do projeto e da casca HTML.

- Vite + React + TS + Tailwind + Zustand + GSAP + three + @react-three/fiber + @react-three/drei
- Estrutura de pastas (já criada — ver árvore no repositório)
- `src/styles/tokens.css` com os tokens do DESIGN_SYSTEM
- `src/content/ContentLayer.tsx`: camada HTML scrollável com `id="content-layer"`, altura
  ~600vh, e seções placeholder (Hero, Manifesto, Portfolio, Contato)
- Configurar fontes (DESIGN_SYSTEM)

**Aceite:** `npm run dev` sobe, a página tem ~600vh de scroll, seções placeholder visíveis,
tokens aplicados.

---

## Fase 1 — Ponte de scroll

- `src/store/useScrollStore.ts`
- `src/hooks/useScrollBridge.ts` (GSAP ScrollTrigger → store)
- Componente de debug: um número fixo no canto mostrando `progress` 0.000 → 1.000

**Aceite:** scrollar a página atualiza o número de 0 a 1 suavemente. Cleanup funciona (sem
warning de StrictMode). **Não seguir sem isso validado.**

---

## Fase 2 — Canvas vazio

- `src/scene/Experience.tsx`: `<Canvas>` `position: fixed`, fundo, `dpr={[1,1.5]}`
- Câmera + luz básica
- Um cubo de teste cujo `scale.y` segue o `progress` (via `getState()` + `damp`)

**Aceite:** o cubo cresce/encolhe conforme o scroll. Confirma a ponte store → R3F.

---

## Fase 3 — Footprint & Ato 0 (Terreno)

- `src/scene/floorplan.ts`: o `FOOTPRINT` (fonte de verdade — paredes, lajes, pilares)
- `src/scene/acts.ts`: janelas dos atos
- `src/scene/components/Floorplan2D.tsx`: linhas técnicas da planta se desenhando no Ato 0
  (drei `<Line>`, cotas, grid de chão)

**Aceite:** ao iniciar o scroll, a planta baixa 2D se desenha sobre o grid.

---

## Fase 4 — Estrutura & paredes (Atos 1–2)

- `src/scene/components/Structure.tsx`: pilares e lajes (usar `<Instances>` do drei)
- `src/scene/components/Walls.tsx`: extrusão procedural das paredes a partir do MESMO
  `FOOTPRINT`. `scale.y` animado pela janela do ato WALLS

**Aceite:** scrollando, a estrutura sobe primeiro, depois as paredes extrudam. Tudo derivado
do footprint único.

---

## Fase 5 — Materiais & luz (Atos 3–4)

- `src/scene/components/Materials.tsx`: revelar texturas/materiais via opacidade 0→1
  (concreto, vidro, madeira)
- `src/scene/components/Lighting.tsx`: luzes cuja intensidade/cor é dirigida pelo progress;
  sombras nascendo no Ato LIGHT

**Aceite:** materiais aparecem progressivamente e a luz preenche a cena no trecho certo.

---

## Fase 6 — Câmera & Ato 5 (Habitado)

- `src/scene/cameraPath.ts`: spline (CatmullRom) percorrendo a obra
- `src/scene/components/CameraRig.tsx`: posição da câmera no path dirigida pelo progress;
  assentamento final no espaço habitado

**Aceite:** a câmera viaja por toda a construção de forma fluida e termina no render final.

---

## Fase 7 — Performance & fallback

- `src/hooks/useLowPerf.ts`: detecta mobile/GPU fraca + `prefers-reduced-motion`
- Modo estático/2D quando low-perf (não montar `<Canvas>`; usar versão SVG/CSS das fases)
- `frameloop="demand"` quando scroll parado; `always` durante scroll
- Lazy load do `Experience.tsx`
- Texturas comprimidas

**Aceite:** mobile não trava; reduced-motion cai no estático; desktop mantém 60fps no scroll.

---

## Fase 8 — Conteúdo real & polish

- Dados reais em `src/content/data/projects.ts`
- Seções de portfólio, manifesto, contato (formulário tipo carimbo de prancha)
- `src/ui/`: TechLabel, ScrollHint, Nav
- Micro-interações com Framer Motion (na camada HTML)
- SEO: meta tags, OG image, sitemap

**Aceite:** site completo, navegável, com conteúdo real e polido.

---

## Decisões a fechar (não bloqueiam o início)

- Comprimento de scroll por ato (começar 600vh total e ajustar)
- Portfólio dentro do 3D ou seção HTML separada (recomendação: separada)
- Footprint fictício bonito vs. projeto real do escritório

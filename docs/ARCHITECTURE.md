> ⚠️ **DESATUALIZADO (versão 3D).** O projeto pivotou para uma **planta técnica 2D em SVG**
> (sem R3F/Three.js). A regra das duas camadas e a ponte de scroll continuam válidas; o resto
> descreve a antiga cena 3D. Fonte atual: `CLAUDE.md`.

# Estúdio Lentz — site do escritório de arquitetura

> **Conceito:** o site se constrói conforme o usuário scrolla. Começa em planta baixa
> (linhas técnicas 2D), as paredes sobem, materiais entram, a luz preenche, e o espaço
> fica habitado. A metáfora do processo arquitetônico É a navegação.

Este documento é a spec de referência para o Claude Code. Foi escrito para ser lido de cima
pra baixo e implementado em fases (ver seção **Roadmap**).

---

## 1. Stack definitiva

| Camada | Escolha | Por quê |
|---|---|---|
| Build | **Vite + React 18 + TypeScript** | Stack do dev, build rápido, DX boa |
| 3D | **React Three Fiber + drei** | Three.js declarativo, ecossistema maduro |
| Animação de scroll | **GSAP + ScrollTrigger** | Controle preciso de timeline com `scrub` |
| Estado de scroll | **Zustand** | Um único `progress` global lido pelo R3F |
| Estilo | **Tailwind CSS** | Utilitário, combina com a camada de overlay HTML |
| Micro-interações UI | **Framer Motion** | Só na camada HTML (não no canvas) |
| Deploy | **Vercel** | — |

> **Decisão de SSR:** Vite SPA puro. Não há SSR nativo. Por isso a regra de ouro abaixo
> (seção 2) sobre separar conteúdo de experiência — é o que salva SEO e acessibilidade.

---

## 2. Arquitetura de alto nível — DUAS CAMADAS

Esta é a decisão estrutural mais importante do projeto. Não negociar.

```
┌─────────────────────────────────────────────┐
│  CAMADA DE CONTEÚDO (HTML real, scrollável)   │  ← z-index alto, pointer-events nos CTAs
│  textos, títulos, specs técnicas, contato     │     SEO + acessibilidade + screen readers
│  é o que define a ALTURA total da página       │
├─────────────────────────────────────────────┤
│  CAMADA DE EXPERIÊNCIA (Canvas R3F, FIXED)    │  ← position: fixed, fundo, full-screen
│  a "obra" que se constrói. NÃO scrolla.        │     só reage ao progresso do scroll
│  pointer-events: none (exceto interações 3D)   │
└─────────────────────────────────────────────┘
```

**Como funciona:**
1. O HTML scrollável (camada de conteúdo) é alto o suficiente pra criar X "telas" de scroll.
2. O `<Canvas>` fica `fixed` no fundo, ocupando a viewport inteira, e **nunca** se mexe.
3. O scroll do HTML alimenta o ScrollTrigger, que escreve um único valor `progress` (0 → 1)
   no store Zustand.
4. Os componentes 3D leem `progress` dentro do `useFrame` e interpolam suas props
   (altura de parede, opacidade de material, intensidade de luz, posição de câmera).

Resultado: textos críticos vivem em DOM real (Google lê, leitor de tela lê), e a experiência
3D é uma camada de fundo controlada. Mobile pode desligar o canvas sem quebrar o conteúdo.

---

## 3. O coração — mecânica scroll → build

### 3.1 Store global (Zustand)

```ts
// src/store/useScrollStore.ts
interface ScrollState {
  progress: number;        // 0 → 1, progresso total da página
  act: number;             // ato atual (0-5), derivado do progress
  isLowPerf: boolean;      // flag de fallback (mobile / GPU fraca)
  setProgress: (p: number) => void;
}
```

### 3.2 Ponte GSAP → store

Um único ScrollTrigger com `scrub` na página inteira. Ele NÃO anima nada do Three.js
diretamente — só atualiza o `progress`. Isso desacopla a animação do render 3D e evita
brigas entre o loop do GSAP e o loop do R3F.

```ts
// src/hooks/useScrollBridge.ts
gsap.to(proxy, {
  value: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "#content-layer",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,            // suaviza; 1s de catch-up
    onUpdate: (self) => useScrollStore.getState().setProgress(self.progress),
  },
});
```

### 3.3 Leitura no R3F

Os componentes 3D NUNCA fazem `useState` do progresso (causaria re-render por frame).
Leem o store via ref dentro do `useFrame` e mexem direto nos objetos:

```ts
useFrame(() => {
  const p = useScrollStore.getState().progress;
  const wallHeight = remap(p, 0.15, 0.35, 0, 1); // ato das paredes
  wallRef.current.scale.y = THREE.MathUtils.damp(
    wallRef.current.scale.y, wallHeight, 4, delta
  );
});
```

> Função `remap(value, inMin, inMax, outMin, outMax)` com clamp é o utilitário mais usado
> do projeto inteiro. Coloca em `src/utils/math.ts`.

---

## 4. Os 6 atos da construção

Cada ato é um trecho do `progress`. Defina como constantes para ajustar fácil.

| Ato | Progress | O que acontece na cena | Conteúdo HTML sincronizado |
|---|---|---|---|
| **0 — Terreno** | 0.00–0.12 | Grid de chão + planta baixa 2D se desenha (linhas técnicas, cotas) | Hero: título cru + tagline |
| **1 — Estrutura** | 0.12–0.30 | Pilares e lajes sobem do chão. Wireframe ainda visível | "Todo projeto começa pela lógica" |
| **2 — Vedação** | 0.30–0.50 | Paredes extrudam pra cima a partir do footprint | Manifesto / abordagem do escritório |
| **3 — Materiais** | 0.50–0.68 | Texturas entram: concreto, vidro, madeira (opacidade 0→1) | Início do portfólio |
| **4 — Luz** | 0.68–0.85 | Iluminação preenche, sombras nascem, ambiente ganha cor | Cases em destaque |
| **5 — Habitado** | 0.85–1.00 | Câmera assenta no render final. Espaço pronto e vivo | CTA contato / "vamos construir o seu" |

> A câmera viaja ao longo de TODOS os atos numa trajetória única (spline/CatmullRom),
> com `progress` controlando a posição no path. Define os pontos do caminho em
> `src/scene/cameraPath.ts`.

---

## 5. Geometria — abordagem PROCEDURAL (importante)

**Não use um modelo glTF pesado de uma casa pronta.** Para o conceito "planta vira espaço",
o caminho elegante E leve é gerar a geometria a partir de um footprint 2D definido em dados:

```ts
// src/scene/floorplan.ts
export const FOOTPRINT = {
  walls: [
    { start: [0, 0], end: [10, 0], height: 3, thickness: 0.2 },
    { start: [10, 0], end: [10, 8], height: 3, thickness: 0.2 },
    // ...
  ],
  slabs: [{ points: [[0,0],[10,0],[10,8],[0,8]] }],
  columns: [{ pos: [0,0] }, { pos: [10,0] }, /* ... */],
};
```

Vantagens:
- A mesma estrutura de dados desenha a **planta 2D (Ato 0)** E extruda as **paredes 3D (Ato 2)**.
  Uma fonte de verdade → a "planta literalmente vira espaço".
- Leve: `ExtrudeGeometry` / `BoxGeometry` procedural, sem download de modelo pesado.
- Casa com a estética brutalista/técnica (formas limpas, sem firula).
- Editar o projeto = editar um JSON. Dá pra ter vários footprints depois.

glTF fica reservado pra **detalhes do portfólio** (mobília, peças específicas) com Draco/Meshopt,
carregados sob demanda — nunca no hero.

---

## 6. Estrutura de pastas

```
src/
├── main.tsx
├── App.tsx
├── store/
│   └── useScrollStore.ts
├── hooks/
│   ├── useScrollBridge.ts        # GSAP ScrollTrigger → store
│   ├── useLowPerf.ts             # detecta mobile/GPU fraca
│   └── useAct.ts                 # deriva ato atual do progress
├── scene/
│   ├── Experience.tsx            # <Canvas> + composição da cena
│   ├── floorplan.ts              # FOOTPRINT (fonte de verdade)
│   ├── cameraPath.ts             # spline da câmera
│   ├── components/
│   │   ├── Floorplan2D.tsx       # Ato 0 — linhas técnicas (drei <Line>)
│   │   ├── Structure.tsx         # Ato 1 — pilares/lajes (instanced)
│   │   ├── Walls.tsx             # Ato 2 — extrusão procedural
│   │   ├── Materials.tsx         # Ato 3 — controle de opacidade/texturas
│   │   ├── Lighting.tsx          # Ato 4 — luzes animadas pelo progress
│   │   └── CameraRig.tsx         # câmera ao longo do path
│   └── shaders/                  # se precisar (reveal de material, etc)
├── content/
│   ├── ContentLayer.tsx          # camada HTML scrollável (define altura)
│   ├── sections/                 # Hero, Manifesto, Portfolio, CTA...
│   └── data/projects.ts
├── ui/
│   ├── TechLabel.tsx             # labels tipo prancha (PROJ. 001 / 2026)
│   ├── ScrollHint.tsx
│   └── Nav.tsx
├── utils/
│   └── math.ts                   # remap, clamp, damp helpers
└── styles/
    └── tokens.css                # design tokens (ver seção 8)
```

---

## 7. Estratégia de performance (risco nº1)

Site 3D + scroll mata mobile se feito errado. Regras:

1. **Cena única e persistente.** Nunca destruir/recriar objetos por ato — só animar props
   (scale, opacity, position). Tudo é instanciado uma vez.
2. **Instancing** para repetição (pilares, ripas, qualquer coisa que se repete) via
   `<Instances>` do drei.
3. **`useFrame` enxuto.** Leitura via `getState()` (não hook reativo). Zero `setState` por frame.
4. **`frameloop`:** `"always"` durante scroll ativo, `"demand"` quando o usuário para
   (economiza GPU e bateria). Controlável via evento de scroll-idle.
5. **Damp em vez de set direto** (`THREE.MathUtils.damp`) pra suavizar e absorver jank.
6. **DPR limitado:** `<Canvas dpr={[1, 1.5]}>` — não renderizar em 3x em telas retina.
7. **Lazy load do Canvas:** `React.lazy` no `Experience.tsx`, fora do bundle crítico.
8. **Texturas:** comprimidas (KTX2/basis), tamanho modesto. Materiais procedurais quando der.

---

## 8. Mobile & fallback (`useLowPerf`)

Detectar GPU fraca / mobile e degradar com elegância — não esconder, **traduzir**:

- **Desktop / GPU ok:** experiência 3D completa.
- **Mobile / low-perf:** desliga o WebGL e roda a "construção" em **2D/CSS/SVG** — as mesmas
  6 fases, mas com a planta baixa SVG e camadas que aparecem via scroll (Framer Motion +
  IntersectionObserver). Mais leve, mantém o conceito, não trava.
- Detecção: `navigator.hardwareConcurrency`, `deviceMemory`, teste rápido de WebGL, e
  `matchMedia('(prefers-reduced-motion)')` → sempre cai no modo estático.

Como o conteúdo vive em DOM real (seção 2), o fallback é trivial: é só não montar o `<Canvas>`.

---

## 9. SEO & acessibilidade

- Todo texto vendável (manifesto, cases, contato) é HTML real na camada de conteúdo.
- `prefers-reduced-motion` → modo estático obrigatório.
- O canvas recebe `aria-hidden="true"` (é decorativo); a navegação é por links HTML normais.
- Meta tags, OG image, sitemap — padrão.
- Fallback de "âncoras" de scroll: cada ato tem uma section HTML correspondente com `id`,
  então dá pra ter navegação por seção mesmo com a câmera 3D no fundo.

---

## 10. Design tokens & tipografia (direção brutalista-técnica)

```css
/* src/styles/tokens.css */
:root {
  --concrete-900: #1a1a18;   /* quase preto, concreto molhado */
  --concrete-700: #3d3d39;
  --concrete-400: #8a8a82;
  --concrete-100: #e8e6e0;   /* off-white, cimento seco */
  --paper:        #f5f2ed;   /* fundo prancha */
  --accent:       #fb3640;   /* vermelho técnico — cotas, destaques */
  --blueprint:    #2b54ff;   /* opcional: azul de planta (Ato 0) */
}
```

**Tipografia (sugestão — todas no Google Fonts / grátis):**
- **Display (títulos crus):** Archivo Expanded ou Space Grotesk — pesado, condensado.
- **Mono (labels técnicos / specs de prancha):** Space Mono ou JetBrains Mono.
- **Corpo:** Inter ou Satoshi.

Labels técnicos por toda parte reforçam a metáfora: `PROJ. 001 / 2026`, `ESC. 1:100`,
`FLORIANÓPOLIS — SC`, cotas com setas. É o que dá personalidade "prancha de arquiteto".

---

## 11. Roadmap em fases (pro Claude Code executar incremental)

> Implementar e validar uma fase por vez. Não pular pro 3D antes da fundação funcionar.

**Fase 0 — Esqueleto**
Vite + React + TS + Tailwind + Zustand. Estrutura de pastas. Tokens. Camada de conteúdo HTML
com seções fixas e altura definida. Sem 3D ainda.

**Fase 1 — Ponte de scroll**
GSAP + ScrollTrigger. `useScrollBridge` escrevendo `progress` no store. Debug visual: um
número 0→1 fixo na tela que muda com o scroll. Validar antes de tudo.

**Fase 2 — Canvas vazio**
`<Canvas>` fixed no fundo, câmera, luz básica, um cubo de teste que escala com o `progress`.
Validar a ponte store → R3F.

**Fase 3 — Footprint & Ato 0**
`floorplan.ts` + `Floorplan2D` (linhas técnicas se desenhando). A planta aparece no scroll.

**Fase 4 — Estrutura & paredes (Atos 1–2)**
`Structure` (instanced) + `Walls` (extrusão procedural a partir do MESMO footprint). Sobem
com o scroll.

**Fase 5 — Materiais & luz (Atos 3–4)**
`Materials` (reveal de opacidade) + `Lighting` (luzes animadas pelo progress, sombras).

**Fase 6 — Câmera & Ato 5**
`CameraRig` no spline, viajando por todos os atos. Assentamento final no espaço habitado.

**Fase 7 — Performance & fallback**
`useLowPerf`, modo 2D mobile, DPR, frameloop demand, lazy load, reduced-motion.

**Fase 8 — Conteúdo real & polish**
Portfólio, manifesto, contato (formulário tipo carimbo de prancha), nav, micro-interações.

---

## 12. Riscos & decisões em aberto

- **Sincronia GSAP ↔ R3F:** o `scrub` do GSAP e o damp do R3F podem brigar. Decisão: GSAP só
  escreve o `progress` cru; toda suavização acontece no `damp` do R3F. Não suavizar nos dois.
- **Comprimento da página:** quanto scroll cada ato precisa? Começar com ~600vh total e ajustar.
- **Modelo de portfólio:** os cases entram DENTRO da experiência 3D (câmera passeia por eles)
  ou são uma seção HTML separada depois do hero? Recomendação: hero 3D é o "wow", portfólio é
  seção própria (mais fácil de manter e melhor pra SEO). Decidir antes da Fase 8.
- **Footprint real:** usar um projeto fictício bonito ou um projeto real do escritório?

# Estúdio Lentz — Redesign "Editorial Cinemático" (v2)

**Data:** 2026-06-22
**Status:** aprovado no brainstorming, pronto para plano de implementação

## 1. Contexto e objetivo

O site do Estúdio Lentz (escritório de arquitetura fictício/demo) passou por duas direções
descartadas: (a) experiência 3D com paredes subindo — achada "simples"; (b) planta técnica 2D
em SVG — achada "ruim, com elementos sobrepostos/bagunçados". Esta spec define uma **terceira
direção, totalmente nova**, validada por mockups e demos ao vivo no companion de brainstorming.

**Direção:** portfólio **editorial cinemático** — fundo escuro, **tipografia gigante como
protagonista**, fotografia das obras como matéria-prima, e **muito movimento dirigido por
scroll (GSAP)**. Estrutura de UI inspirada em `fluid.glass` (agência Exo Ape). O conceito antigo
"a obra se constrói no scroll" é **abandonado**; o foco agora é apresentar as obras com impacto
e acabamento de estúdio premiado.

**Critério de sucesso:** uma home que dá "wow" imediato (hero + movimento), navegação clara
entre projetos, acabamento de micro-interações nível Awwwards, e que não trave em mobile nem
quebre acessibilidade.

## 2. Direção de arte

**Paleta (atualizar `src/styles/tokens.css`):**
- `--bg: #0c0c0b` (preto cinema) · `--fg: #f1ede6` (off-white) · `--mut: #8f8b82` (texto secundário)
- `--acc: #fb3640` (vermelho técnico — único acento de cor) · `--line: rgba(241,237,230,.14)` (divisórias)
- Tokens antigos de "papel/concrete claro" deixam de ser o tema base (modo escuro é o padrão).

**Tipografia:**
- **Display:** Archivo (peso 900), gigante, uppercase, tracking negativo, line-height ~0.86.
- **Mono:** Space Mono — eyebrows, labels, metadados, nav.
- **Corpo:** Inter.

**Tom:** severo, confiante, espaçado. Cor só no acento. Fotografia em alto contraste.

## 3. Arquitetura de informação

Multi-página com **react-router-dom**:
- `/` — **Home** (vitrine; todas as seções abaixo).
- `/projetos` — **lista** de projetos (lista tipográfica, hover A).
- `/projetos/:slug` — **detalhe** do projeto (galeria + ficha técnica).
- `/contato` — contato.

Header fixo (blur) presente em todas: logo "Estúdio Lentz" + nav (Projetos / Estúdio / Abordagem
/ Contato) + CTA "Iniciar projeto". Footer global: social + legal + crédito "Coded by M".

## 4. Home — seções (ordem)

1. **Hero** full-screen: foto dramática (parallax) + título gigante "CONSTRUIR É **PENSAR**" +
   kicker mono + parágrafo + dica de scroll. Título entra com *mask reveal* no load.
2. **Statement**: frase grande do estúdio (parte destaque / parte muted), com *scrub word reveal*
   (palavras acendem conforme o scroll).
3. **Projetos selecionados**: grid 2×2 de cards (hover B). Link para `/projetos/:slug`.
4. **Abordagem**: 4 passos (Lógica / Matéria / Luz / Habitar) em grid divisório.
5. **Depoimentos**: carrossel (indicador 01/05) com citação + autor + foto.
6. **CTA gigante**: "Vamos construir o **seu**" com escala no scrub + e-mail.
7. **Footer**.

## 5. Página Projetos e detalhe

- `/projetos`: **lista tipográfica** (hover A) — nomes em Archivo gigante; hover deixa o nome
  vermelho + desliza (seta →) e mostra **imagem flutuante seguindo o cursor**. Cada linha:
  nome, tipo, ano. Clique → detalhe.
- `/projetos/:slug`: hero do projeto (título + ficha: local, área, ano, tipo) + **galeria** de
  imagens com clip-reveal/parallax no scroll + texto descritivo + navegação "próximo projeto".

## 6. Linguagem de movimento

**Lib:** GSAP + ScrollTrigger (motion principal) + **Lenis** (smooth scroll). Framer Motion só
para transições de rota/menu.

Catálogo de movimentos (validado no demo):
- **Mask reveal** (hero/headlines): linhas sobem de dentro de máscara `overflow:hidden`.
- **Parallax**: fundo do hero e imagens internas movem em ritmo diferente (`scrub`).
- **Scrub word reveal**: opacidade das palavras 0.16→1 ligada ao progresso.
- **Pin + scroll horizontal**: seção de projetos pode travar e deslizar na horizontal (home ou
  projetos — definir no plano; default: home usa grid, `/projetos` usa lista).
- **Clip reveal**: imagens entram via `clip-path: inset()` + leve scale.
- **CTA scrub scale**: título do CTA escala/aparece amarrado ao scroll.

**Princípio:** ScrollTrigger dirige cada elemento diretamente (não há mais um único `progress`
global como nas versões anteriores). Easing padrão `cubic-bezier(.2,.8,.2,1)` / `power3-4.out`.

## 7. Interações de hover

- **Cards (Home) — B:** imagem `grayscale(.4) brightness(.8)` → cor/zoom; título sobe (`translateY`);
  metadata + botão "Ver projeto →" fazem fade/slide-in.
- **Lista (Projetos) — A:** nome → vermelho + `padding-left` (desliza) + seta; **imagem fixa
  330×240 segue o cursor** com lerp (rAF), trocando o `src` por linha. `pointer-events:none`.

## 8. Stack e dependências

**Manter:** Vite + React 18 + TS + Tailwind + Zustand (estado de menu/UI) + GSAP + Framer Motion.
**Adicionar:** `lenis`, `react-router-dom`.
**Remover (código + deps):** toda a camada `src/plan/` (footprint, acts, planGeometry, PlanScene),
`useScrollBridge` (substituído por ScrollTrigger por-elemento), `ScrollDebug`. three/R3F já foram
removidos em etapa anterior — confirmar ausência.

## 9. Estrutura de pastas (alvo)

```
src/
├── main.tsx, App.tsx (router + Lenis + layout)
├── routes/ Home.tsx, Projetos.tsx, ProjetoDetalhe.tsx, Contato.tsx
├── sections/ Hero, Statement, FeaturedProjects, Approach, Testimonials, CtaBig
├── components/ Header, Footer, ProjectCard, ProjectListRow, CursorImage, RevealText, ParallaxImage
├── hooks/ useLenis, useReducedMotion, useGsapReveal
├── content/data/projects.ts (expandir: imagens, galeria, descrição)
├── store/ (menu/UI state)
├── utils/ math, cssVar
└── styles/ tokens.css (paleta escura) + index.css
```

## 10. Conteúdo e imagens

- Reusar/expandir `projects.ts` (4 projetos já definidos) com: `cover`, `gallery[]`, `description`,
  `local`, `area`, `year`, `type`.
- Imagens: fotografia de arquitetura curada do **Unsplash** (baixadas para `public/projects/` ou
  hotlink com parâmetros de tamanho). É um demo — conteúdo coerente, sem dados reais de cliente.

## 11. Acessibilidade e performance

- `prefers-reduced-motion`: desligar ScrollTrigger/Lenis e revelar tudo estático (hook
  `useReducedMotion`). Hovers viram estados simples.
- Imagens com `loading="lazy"`, `width/height`, tamanhos responsivos; evitar layout shift.
- Mobile: desabilitar scroll horizontal pesado e a imagem-no-cursor (sem ponteiro fino); cair
  para grid/stack. Lenis off em toque se necessário.
- Header com `backdrop-filter` — degradê de fallback.
- Texto vendável em DOM real (SEO); manter meta/OG/sitemap já existentes (ajustar cor do tema).

## 12. O que é removido

`src/plan/*`, `FloorplanStatic`/`PlanScene`, `useScrollBridge`, `ScrollDebug`, e referências 3D
residuais. Docs antigos (`docs/*` da versão 3D) já têm banner de "desatualizado"; após este
redesign, o `CLAUDE.md` deve ser reescrito para a direção editorial cinemática (no plano).

## 13. Fora de escopo (por ora)

- CMS / backend de formulário (contato é `mailto:` + UI; integração real fica fora).
- Internacionalização.
- Página "Estúdio/Sobre" dedicada (dobrada na Home; pode virar página depois).
- Blog/news.

## 14. Decisões em aberto (resolver no plano)

- Onde usar o **pin + horizontal**: só em `/projetos`, ou também na seção de projetos da Home?
  (default: Home = grid 2×2; `/projetos` = lista A).
- Carrossel de depoimentos: autoplay vs. manual.
- Lenis em mobile: ligado ou desligado.

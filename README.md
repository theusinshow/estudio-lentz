# Estúdio Lentz — site do escritório de arquitetura

Site cuja navegação é a própria construção de uma obra: planta baixa → estrutura → paredes
→ materiais → luz → espaço habitado, tudo amarrado ao scroll.

## Stack

Vite · React · TypeScript · React Three Fiber · drei · GSAP/ScrollTrigger · Zustand ·
Tailwind · Framer Motion · Vercel

## Conceito em uma frase

Uma camada de conteúdo HTML scrollável por cima de um canvas 3D fixo. O scroll alimenta um
único valor de progresso (0→1) que dirige a construção da cena.

## Rodando

```bash
npm install
npm run dev
```

## Documentação

Comece por `CLAUDE.md`. A spec completa está em `docs/`:

- `docs/ARCHITECTURE.md` — arquitetura e decisões
- `docs/SCROLL_MECHANICS.md` — mecânica de scroll → build
- `docs/ROADMAP.md` — fases de implementação
- `docs/DESIGN_SYSTEM.md` — design system
- `docs/PERFORMANCE.md` — performance e acessibilidade

## Status

Em desenvolvimento. Implementação por fases — ver `docs/ROADMAP.md`.

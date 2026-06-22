# Fotos dos projetos

Cada projeto tem uma pasta com o mesmo `slug` usado em `src/content/data/projects.ts`.

## O que colocar em cada pasta

Por projeto: **6 imagens** (1 capa + 5 galeria).

```
public/projects/<slug>/
├── cover.jpg   ← capa (cards da home + lista de projetos)
├── 01.jpg      ← galeria 1
├── 02.jpg      ← galeria 2
├── 03.jpg      ← galeria 3
├── 04.jpg      ← galeria 4
└── 05.jpg      ← galeria 5
```

## Pastas (slugs atuais)

- `casa-patio` — Casa Pátio
- `casa-jardim` — Casa Jardim
- `refugio-serra` — Refúgio Serra
- `casa-costa` — Casa Costa
- `casa-ladeira` — Casa Ladeira
- `atelie-lenho` — Ateliê Lenho

> Estúdio e dados fictícios (portfólio demonstrativo). Cada pasta tem `cover.jpg`
> mais `01.jpg`–`05.jpg`, referenciados em `src/content/data/projects.ts`.

## Especificações recomendadas

- **Formato:** `.jpg` (ou `.webp` — me avise pra ajustar o helper `img`).
- **Capa:** proporção ~16:11, lado maior **≥ 1600px**.
- **Galeria:** proporção ~16:10, lado maior **≥ 1600px**.
- **Peso:** otimize para web (idealmente < 400 KB por imagem).
- Cor: o site é dark/cinema — fotos com bom contraste e textura (concreto, madeira,
  luz natural) funcionam melhor.

---
target: estudio-lentz site (todas as rotas, via Playwright)
total_score: 31
p0_count: 1
p1_count: 2
timestamp: 2026-06-22T17-40-32Z
slug: estudio-lentz-site-home-projetos-detalhe-contato
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Slideshow pause/dots good; no feedback on 404 |
| 2 | Match System / Real World | 4 | Clear PT-BR, architecture register, WhatsApp-first |
| 3 | User Control and Freedom | 3 | Pausable hero, Esc closes menu; no recovery from bad URL |
| 4 | Consistency and Standards | 4 | Tight, consistent type/label/accent system |
| 5 | Error Prevention | 2 | Unknown URLs fall through to a blank screen |
| 6 | Recognition Rather Than Recall | 4 | Labeled nav, active states, skip link |
| 7 | Flexibility and Efficiency | 3 | Focus trap + skip link; Lenis adds no shortcut |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely strong editorial-cinematic craft |
| 9 | Error Recovery | 1 | 404 = pure black, no message, no way back |
| 10 | Help and Documentation | 3 | Minimal needs met; contact clear |
| **Total** | | **31/40** | **Strong, with two shipping-blockers** |

## Anti-Patterns Verdict

**LLM assessment:** This does **not** read as AI slop. The Archivo 900 display type at clamp sizes, Space Mono technical labels, single red accent on near-black, and the editorial project list are committed, opinionated choices. No identical card grids, no hero-metric template, no gradient text, no glassmorphism. The /projetos list in particular is confident and memorable.

**Deterministic scan:** The bundled `detect.mjs` failed to load ("bundled detector not found") after a real attempt, so the automated markup scan is unavailable for this run. Findings below come from source review plus live browser interaction (Playwright driving Chromium against the dev server).

**Browser evidence:** Drove all four routes plus a fabricated 404, at 1440px and 390px, with a reduced-motion pass. No live overlay injection was used; evidence is screenshots + DOM measurement. One console error observed (a 404 on a page resource, likely favicon/asset).

## Overall Impression

The visual language is the win here, this is a portfolio that looks designed, not generated. But two defects break the experience for real users: the **mobile menu is unusable** and **unknown URLs render a blank black page**. Both are invisible in a quick desktop happy-path demo and both are severe. Fix those before anything cosmetic.

## What's Working

- **Editorial type system.** The /projetos list (CASA PÁTIO, CASA JARDIM…) at full display scale with right-aligned mono metadata is the strongest screen. It commits.
- **Restrained color discipline.** Near-black `#0c0c0b`, warm off-white, one technical red. The accent only appears where it earns attention (PENSAR, AQUI, active nav). Textbook committed-restrained palette.
- **Accessibility groundwork is real.** Skip link, focus trap in the drawer, Escape-to-close, `aria-modal`, reduced-motion honored (measured: 0 elements hidden at opacity<0.05 in reduce mode). This is above the bar for a portfolio.

## Priority Issues

### [P0] Mobile menu drawer collapses to a 72px strip; hero text bleeds through
- **Why it matters:** On a 390px viewport the drawer measures `{w:390, h:72}` against 776px of available height. The opaque `bg-bg` covers only a thin band, so "CONSTRUIR E PENSAR" and the hero copy show through and overlap the INÍCIO/PROJETOS/CONTATO links, rendering primary mobile navigation unreadable. Mobile is the majority of this audience.
- **Root cause:** The drawer is `position: fixed; inset-0; top-[68px]` but it is a child of `<header>`, which has `backdrop-blur` (`backdrop-filter: blur(8px)`). A backdrop-filtered ancestor becomes the containing block for fixed descendants, so `inset-0` resolves to the 68px header box, not the viewport. Verified via `getBoundingClientRect`.
- **Fix:** Render the drawer outside the backdrop-filtered header (portal it to `body` or hoist it to `Layout`), or drop `backdrop-blur` from the header, or give the drawer an explicit `h-[100dvh]`/`top-0` that doesn't depend on the broken containing block. Hoisting out of the header is cleanest.
- **Suggested command:** `/impeccable adapt`

### [P1] Unknown URLs render a blank black page (no catch-all route, no 404)
- **Why it matters:** `App.tsx` defines `/`, `/projetos`, `/projetos/:slug`, `/contato` and no `path="*"`. Any typo, stale link, or shared bad URL drops the user onto an empty `<Outlet/>`, pure black, no message, no nav, no way back. Heuristic 9 (Error Recovery) scores a 1 entirely on this.
- **Fix:** Add a `<Route path="*" element={<NotFound/>}/>` inside the Layout route so the header/footer persist. Give it a display-scale "404 / PÁGINA NÃO ENCONTRADA" headline in the existing type system and a link back to /projetos. (Note: invalid `/projetos/:slug` already redirects to /projetos correctly, so only the top-level catch-all is missing.)
- **Suggested command:** `/impeccable harden`

### [P1] Every page shares one `<title>`; project detail pages have no SEO/meta
- **Why it matters:** All routes report `Estúdio Lentz — Arquitetura em Florianópolis`, including `/projetos/casa-patio`. `ProjetoDetalhe` sets no `document.title` and there's no per-route meta/OG. For a portfolio whose distribution is search and link-sharing, every project shares identical title/preview, which kills shareability and crawl differentiation. This is also an a11y issue (screen-reader users rely on title to know where they are).
- **Fix:** Set a per-route title (a small `useDocumentTitle` hook or `react-helmet-async`): `"Casa Pátio — Estúdio Lentz"`, plus OG image = the project hero. Apply to all four routes.
- **Suggested command:** `/impeccable harden`

### [P2] Placeholder data is still live
- **Why it matters:** WhatsApp shows `+55 48 0000-0000` (link target `554800000000`), the footer reads `CAU/BR 000000-0` and `PROJETO FICTÍCIO · PORTFÓLIO DEMONSTRATIVO`. Fine as a demo, but the WhatsApp CTA is the primary conversion path and currently dials nothing. A prospective client who taps it loses trust instantly.
- **Fix:** Replace contact constants in `src/content/contact.ts` with real values before launch, or gate the demo footnote behind an env flag.
- **Suggested command:** `/impeccable clarify`

### [P2] Project detail pages feel sparse for a case study
- **Why it matters:** A detail page is hero title + metadata row + gallery + one paragraph + next-project link. For the page meant to sell the work, there's no concept narrative, no process, no plan/section drawing, no client/role/credits. It reads like a stub, not a case.
- **Fix:** Add a short structured case (brief → approach → outcome), or at minimum a pull-quote and a second body block. Vary the gallery rhythm (full-bleed vs inset) instead of uniform 16:10 stacks.
- **Suggested command:** `/impeccable layout`

## Persona Red Flags

**Marina (prospective client, browsing on her phone):** Taps "Menu" and gets overlapping, unreadable text instead of navigation. If she persists to Contato and taps "Falar no WhatsApp," it dials `0000-0000`. Two of her three paths to contact are broken on mobile. High abandonment.

**Jordan (first-timer, arrives via a shared deep link):** If the shared link is stale or mistyped, she sees a black void with no header and no explanation, and leaves assuming the site is down. If the link works, the browser tab and any link-unfurl preview say only "Estúdio Lentz — Arquitetura em Florianópolis" with no project context.

**Crawler / social unfurl bot:** Every URL returns the same title and (absent OG tags) the same preview. Six distinct projects collapse into one indistinguishable share card.

## Minor Observations

- Contato page: the WhatsApp pill and email sit at `gap-4` with `whitespace-nowrap`; on desktop they read as cramped and the Space Mono `@` glyph is easy to misread. Add breathing room or stack until `md`.
- One console 404 on a page resource (likely favicon/asset). Track it down; console errors on a polished site read as unfinished.
- Home full-page renders mostly black before scroll because reveals start hidden. Acceptable by design intent (reduced-motion shows everything), but the large inter-section voids at `py-20`+ could tighten for rhythm.

## Questions to Consider

- The mobile menu bug hid behind a desktop-first build. What else only breaks at 390px that a desktop demo never reveals?
- If a project detail page is where work gets sold, what would the most confident version include that the current stub omits?
- Should the 404 be an apology, or an opportunity, a curated "lost? see the work" moment in the same editorial voice?

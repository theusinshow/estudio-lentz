---
target: estudio-lentz site (pos-fix, via Playwright)
total_score: 37
p0_count: 0
p1_count: 0
timestamp: 2026-06-22T18-08-36Z
slug: estudio-lentz-site-home-projetos-detalhe-contato
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Slideshow controls, active nav, 404 now informs |
| 2 | Match System / Real World | 4 | Clear PT-BR, architecture register, WhatsApp-first |
| 3 | User Control and Freedom | 4 | Working drawer, Esc, pausable hero, 404 recovery |
| 4 | Consistency and Standards | 4 | Tight type/label/accent system; footer breaks at one band |
| 5 | Error Prevention | 3 | Footer overflows horizontally at 768-900px |
| 6 | Recognition Rather Than Recall | 4 | Labeled nav, active states, skip link |
| 7 | Flexibility and Efficiency | 3 | Focus trap, skip link, per-route titles |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely strong editorial-cinematic craft |
| 9 | Error Recovery | 4 | 404 page with two paths back, in brand voice |
| 10 | Help and Documentation | 3 | Minimal needs met; contact clear |
| **Total** | | **37/40** | **Strong; one responsive bug + minor a11y left** |

## Anti-Patterns Verdict

**LLM assessment:** Still not AI slop, and now stronger. The previous run's two shipping-blockers (broken mobile menu, blank 404) are gone, verified live. The new project-detail rhythm (lead image, intro, two-up, pull-quote, concept, full image, credits, next) reads like a real case study rather than a stub. The 404 ("ENDEREÇO SEM OBRA") carries personality instead of apologizing generically. Committed-restrained palette holds: near-black, warm off-white, one technical red.

**Deterministic scan:** `detect.mjs` again failed to load ("bundled detector not found") after a real attempt; automated markup scan unavailable. Findings below are source review + live browser interaction (Playwright/Chromium against the dev server), swept at 1440px, 768px, and 390px.

**Browser evidence:** All four routes plus the 404, with full-page screenshots at three widths and a horizontal-overflow probe. **Console errors: 0** (favicon 404 resolved). No live overlay injection; evidence is screenshots + DOM measurement.

## Overall Impression

This went from "great-looking but two things break real users" to "polished, with one genuine responsive bug and a couple of cosmetic nits." The detail pages are now the second-strongest screen after /projetos. The single must-fix is the footer overflowing the viewport in the tablet band; everything else is refinement.

## What's Working

- **Project detail pages, rebuilt.** The varied rhythm (full-bleed lead, 2-up pair, display pull-quote, inset credits image) gives each project a narrative arc. The pull-quote in display weight is a real peak moment.
- **Recovery is now on-brand.** The 404 keeps the header/footer, states the problem plainly, and offers "Ver os projetos" + "Voltar ao início." Error states are where most portfolios go generic; this one didn't.
- **Mobile is solid end to end.** Home, list, detail, and contact all hold at 390px with no horizontal overflow, and the drawer is opaque and usable.

## Priority Issues

### [P2] Footer overflows the viewport horizontally at 768-900px (global, every page)
- **Why it matters:** Measured 55px of horizontal scroll at 768px on every page. The Social column is `md:col-span-2` (~120px wide) but the "Instagram @estudio.lentz ↗" link is `inline-flex` (non-wrapping, ~170px), so it punches past the page edge. A horizontal scrollbar on a polished site reads as broken, and it hits exactly the iPad-portrait / split-screen band.
- **Fix:** Let the social link wrap (`flex-wrap` on the anchor, or drop the inline handle to its own line under the label), or widen the Social column at `md` (e.g. give it `md:col-span-3` and rebalance the 12-col grid). Re-test the 768-900px band after.
- **Suggested command:** `/impeccable adapt`

### [P3] Credits labels fall below AA contrast
- **Why it matters:** The detail-page ficha técnica uses `text-mut/70` for the role labels ("Projeto", "Equipe"...). That blends to roughly 3.3:1 on the near-black background, under the 4.5:1 AA threshold for this 11px text. Introduced with the new credits block.
- **Fix:** Use full `text-mut` (~5.6:1) for the labels, or lift the value. Keep the visual hierarchy via the existing `text-fg` on the value line.
- **Suggested command:** `/impeccable adapt` (or fold into polish)

### [P3] Contato: the "@" in the email reads as a lowercase "a"
- **Why it matters:** "CONTATO@ESTUDIOLENTZ.COM.BR" in uppercase Space Mono renders the `@` small enough to skim as "CONTATOaESTUDIO". The `sm:gap-8` spacing fix landed (no more crowding against the pill), but the glyph ambiguity remains on the primary contact line.
- **Fix:** Lowercase the email (mono lowercase keeps the `@` legible), or render it non-uppercase, or separate the local-part and domain visually.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Marina (prospective client, iPad in portrait):** Lands in the 768px band and sees a horizontal scrollbar from the footer overflow, her first "is this finished?" doubt. Otherwise her path is now clean: working menu, readable contact, a detail page that actually sells the work.

**Jordan (first-timer via a stale link):** Now lands on a real 404 with the studio's voice and two ways forward instead of a black void. Recovered.

**Screen-reader user (on a project page):** Per-route titles now announce "Casa Pátio, Estúdio Lentz" correctly. The only snag: the credits role labels are low-contrast for low-vision users reading visually.

## Minor Observations

- Detail page: the intro (`description`) and the concept block are both left-aligned max-width text blocks with similar treatment; consider differentiating one (lead-in size, or offset) so they don't read as two identical paragraphs.
- Placeholder data (WhatsApp 0000-0000, CAU/BR 000000-0, "projeto fictício") remains by design; not scored. The WhatsApp CTA still dials nothing, the one thing to swap before any real launch.
- og:image is the same Casa Pátio cover sitewide except on detail pages; fine, but a dedicated social card for Home/Contato would sharpen sharing.

## Questions to Consider

- The footer bug only appears in a 130px-wide viewport band. What's the project's stance on tablet, a tested target, or "best effort between mobile and desktop"?
- Now that detail pages carry a narrative, should /projetos hint at it, a one-line blurb per row on hover, or keep the list pure and silent?
- The 404 found a voice. Where else could that voice show up, an empty search, a coming-soon project, the WhatsApp confirmation?

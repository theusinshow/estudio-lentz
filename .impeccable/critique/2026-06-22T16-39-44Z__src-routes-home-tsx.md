---
target: Home (src/routes/Home.tsx)
total_score: 27
p0_count: 1
p1_count: 1
timestamp: 2026-06-22T16-39-44Z
slug: src-routes-home-tsx
---
# Crítica de Design — Home (Estúdio Lentz)

Target: `src/routes/Home.tsx` (+ seções/componentes). Register: brand / portfólio.
Independência das avaliações: A rodou isolada em sub-agente; B **degradada** (detector empacotado indisponível, sem browser) → varredura manual determinística.

## Design Health Score (Nielsen, 0–4)

| # | Heurística | Nota | Issue-chave |
|---|-----------|-------|-------------|
| 1 | Visibilidade do estado | 3 | Carrossel tem dots/tablist, mas autoplay 5.5s sem indicador de progresso nem pausa. |
| 2 | Sistema ↔ mundo real | 3 | Voz boa; jargão de arquitetura ok p/ público; labels "01 Estúdio" crípticos isolados. |
| 3 | Controle e liberdade | 2 | Autoplay do hero sem pause/play; sem pausa no hover. Risco WCAG 2.2.2. |
| 4 | Consistência e padrões | 3 | Muito consistente — quase a ponto de monotonia. |
| 5 | Prevenção de erro | 3 | Superfície baixa; CTA `mailto:` pode falhar silenciosamente. |
| 6 | Reconhecer vs lembrar | 3 | Nav clara; índice 01–04 sugere sistema de capítulos inexistente. |
| 7 | Flexibilidade/eficiência | 2 | 6 slides em autoplay; canal dominante (WhatsApp) só no footer. |
| 8 | Estética e minimalismo | 3 | Forte e coerente; perde por sameness, não por excesso. |
| 9 | Recuperação de erro | 2 | `mailto:` sem fallback; placeholder de WhatsApp/CAU se vazar p/ prod. |
| 10 | Ajuda e documentação | 3 | Autoexplicativo; "↓ Role para ver" é boa affordance. |
| **Total** | | **27/40** | **Sólido, acima da média; não excelente.** |

## Veredito de Anti-Padrões

**Parece IA? Parcial — "sim, mas competente".**

**Avaliação LLM (A):** o esqueleto é o template editorial-IA canônico (Hero c/ kicker → Statement de 1 frase → grid de cards → Abordagem em 4 passos → depoimentos → CTA gigante). Toda seção abre com `border-t border-line` + `py-32` + `SectionLabel` numerado. O índice 01–04 é o maior *tell*: promete um sistema paginado que não é navegável. Salva a peça: copy específica com voz ("Devolvemos um pensamento, não um render"), a11y de motion real, disciplina cromática de 1 acento.

**Varredura determinística manual (detector indisponível):**
- Side-stripe borders: nenhum. Gradient text: nenhum. Hero-metric template: nenhum. Modal-first: drawer mobile é apropriado.
- **Glassmorphism:** a placa do Hero (`bg-bg/70 backdrop-blur-md`) é o caso-limite; mitigada (sem borda/raio, tinta pesada, proposital p/ contraste) — aceitável, mas é o gesto de hero mais batido.
- **Card grid idêntico:** `FeaturedProjects` 2×2 de cards iguais sem hierarquia — confirma o achado de sameness.
- **Em dashes na copy (regra de cópia):** presentes em prosa (ex.: Approach "em estado bruto — sem ornamento, com intenção") e em locais ("— SC"). O label de local é convenção de identidade; o em dash em prosa pode virar vírgula/dois-pontos.
- **Consistência de dados:** `Hero` usa as 6 capas (`PROJECTS`), não as `featured` — provável descuido.

**Overlays visuais:** indisponíveis (sem injeção de browser). Sinal de fallback usado: revisão manual.

## Impressão geral
Execução técnica e de copy acima da média; composição genérica. Maior oportunidade isolada: **inverter o caminho de conversão** (hoje o CTA-herói é `mailto:`, alto atrito; o WhatsApp, canal dominante no BR, está escondido no footer).

## O que está funcionando
1. **A11y de motion real** — `useReducedMotion` em RevealText/Hero/CtaBig retornando ao estado final; skip-link; `aria-live` nos depoimentos; foco visível global. Acima do padrão de mercado.
2. **Copy com voz** — "render" como inimigo recorrente cria coerência temática e posicionamento real.
3. **Disciplina cromática** — um único acento `#fb3640` usado com parcimônia; é o que faz o "dark cinema" funcionar.

## Issues prioritários

**[P0] CTA principal é `mailto:` cru.** "Agendar uma conversa" (CtaBig), "Iniciar projeto" (Header) e contatos do footer abrem `mailto:`. No mercado BR (mobile, sem cliente de email), clicar e nada acontecer = conversão perdida no pico de intenção. **Fix:** CTA primário → WhatsApp (`wa.me`) ou `/contato` (form); email como secundário. Garantir troca do placeholder `554800000000` antes do deploy. *Comando:* clarify / craft.

**[P1] Autoplay do Hero sem pausa (WCAG 2.2.2).** Troca a cada 5.5s via `setInterval`, sem pause/play, sem pausa no hover/focus; 6 slides agravam. Respeita reduced-motion (bom), mas não cobre quem não setou a preferência. **Fix:** pausar no hover/focus-within, botão play/pause, reduzir a 3 capas curadas. *Comando:* animate / adapt.

**[P2] Sameness estrutural.** Todas as seções = `border-t + py-32 + label numerado`; nenhuma quebra de grid, nada full-bleed, nenhuma variação de escala. Causa principal do "parece IA" e do platô emocional. **Fix:** dar a um projeto featured tratamento herói (largura dupla/full-bleed); alternar densidade; Statement virar seção com imagem em vez de só tipografia. *Comando:* bolder / layout.

**[P3] Prova social frágil.** Depoimentos com retratos de stock do Unsplash; footer expõe "Projeto fictício". Stock em depoimentos mina credibilidade. **Fix:** depoimentos sem rosto (monograma de iniciais + nome + projeto), mais elegante e honesto. *Comando:* craft / distill.

## Red flags de persona

**Cliente de arquitetura, mobile (Floripa):** toca "Agendar uma conversa" → `mailto:` → tela em branco sem email configurado; espera WhatsApp (só no footer). Hero troca a foto sob o subtítulo enquanto ele lê; 6 dots de ~8px difíceis no polegar.

**Recrutador/par avaliando o portfólio:** reconhece o template editorial-IA pelo índice 01–04 + sequência de seções; desconta pelos retratos de stock; mas valoriza o código de motion/a11y se abrir o devtools.

**Usuário de teclado/leitor de tela:** acima da média (skip-link, aria-live, tablist, foco visível). Mas o drawer mobile é `role=dialog aria-modal` **sem focus trap** e sem mover foco pra dentro ao abrir (Header) — pode-se tabular atrás do overlay; foco não retorna ao botão ao fechar.

## Observações menores
- `SLIDES` usa todas as 6 capas, não as `featured`.
- Statement em `font-medium` enquanto Hero/CTA em `font-black` — quebra sutil de hierarquia.
- `ProjectCard` esconde local·área atrás de hover no desktop — info útil escondida atrás de interação.
- Vermelho `#fb3640` sobre `#0c0c0b` em texto pequeno mono: **verificar contraste** (limítrofe p/ 4.5:1).
- "Coded by M" colado em "Projeto fictício" no footer mistura crédito com disclaimer.
- `min-h-[88svh]` (svh) no hero é escolha madura.

## Perguntas a considerar
1. Se o índice 01–04 promete capítulos, por que não é navegável (scroll-spy sticky) — ou some?
2. Hero e CTA dizem o mesmo ("pensar"/"partido"). E se o Statement carregasse **prova** (obra full-bleed + legenda técnica) em vez de outro aforismo?
3. Por que o canal de maior conversão (WhatsApp) está no footer e o de maior atrito (`mailto:`) é o herói?
4. Onde está o **único gesto memorável**? Que seção sacrificar para dar a UMA escala dramática?
5. Seis capas em autoplay tratam o hero como slideshow de stock. E se fosse UMA obra-assinatura fixa, com movimento só de parallax/clip?

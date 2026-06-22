export interface Project {
  slug: string;
  name: string;
  year: number;
  local: string;
  area: string;
  type: string;
  blurb: string;       // curto, para cards/lista
  cover: string;
  gallery: string[];   // 5 imagens (página de detalhe)
  description: string; // longo, para a página de detalhe (briefing / partido)
  concept: string;     // segundo bloco: processo / materialidade
  quote: string;       // citação de destaque (pull-quote)
  credits: { role: string; name: string }[]; // ficha técnica (fictícia)
  featured?: boolean;  // aparece na Home (seção "Projetos selecionados")
  tone?: "light" | "dark"; // tom predominante da capa (claro/escuro). Metadado de curadoria;
  //  o Hero hoje usa uma placa tintada com contraste fixo, então este campo não troca mais
  //  a cor do texto — fica como referência para futuros tratamentos.
}

// Caminho das fotos locais em /public/projects/<slug>/{cover,01..05}.jpg
const img = (slug: string, file: string) => `/projects/${slug}/${file}.jpg`;
const gallery = (slug: string) => ["01", "02", "03", "04", "05"].map((n) => img(slug, n));

export const PROJECTS: Project[] = [
  {
    slug: "casa-patio", name: "Casa Pátio", year: 2023, local: "Santo Amaro da Imperatriz — SC",
    area: "264 m²", type: "Residência", featured: true, tone: "dark",
    blurb: "Tijolo e concreto em torno de um pátio central que ventila e ilumina a casa inteira.",
    cover: img("casa-patio", "cover"), gallery: gallery("casa-patio"),
    description: "Paredes de tijolo aparente e estrutura de concreto se organizam ao redor de um vazio central. O pátio cruza luz e ar por todos os ambientes, e a cobertura metálica, com as tesouras à vista, deixa o sistema construtivo legível de dentro.",
    concept: "O partido nasceu de uma restrição: lote profundo, fundo cego, sol só de um lado. O pátio resolve os três problemas de uma vez, puxando luz para o centro e organizando a circulação ao redor do vazio. Cada material foi mantido cru — tijolo, concreto, metal — para que a casa se explique sozinha.",
    quote: "O vazio no meio da casa é o cômodo mais importante: é por ele que tudo respira.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, A. Prado" },
      { role: "Estrutura", name: "Concretto Engenharia" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
  {
    slug: "casa-jardim", name: "Casa Jardim", year: 2024, local: "Jurerê — Florianópolis, SC",
    area: "420 m²", type: "Residência", tone: "light",
    blurb: "Volume horizontal de beirais longos abrindo para o jardim e a piscina.",
    cover: img("casa-jardim", "cover"), gallery: gallery("casa-jardim"),
    description: "Reboco claro, madeira e pedra compõem uma casa de planos horizontais e beirais profundos. Os brises de madeira filtram o sol forte e a vida se desloca para fora, entre o estar, a varanda coberta e o espelho d'água.",
    concept: "O clima de Jurerê pedia sombra antes de tudo. Os beirais longos foram dimensionados pela geometria do sol de verão, e os brises móveis deixam o morador ajustar a luz hora a hora. A casa é baixa de propósito: some no jardim em vez de competir com ele.",
    quote: "Uma casa de praia não precisa de paredes. Precisa de sombra, brisa e um chão que continua lá fora.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, C. Bittencourt" },
      { role: "Paisagismo", name: "Raiz Paisagismo" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
  {
    slug: "refugio-serra", name: "Refúgio Serra", year: 2022, local: "Urubici — SC",
    area: "138 m²", type: "Casa de campo", featured: true, tone: "dark",
    blurb: "Volume de madeira queimada implantado na encosta fria da serra.",
    cover: img("refugio-serra", "cover"), gallery: gallery("refugio-serra"),
    description: "Revestida em madeira escurecida, a casa se encaixa no declive e enfrenta o frio com poucos vãos, generosos e bem orientados. Por dentro, concreto e pinho claro guardam o calor; a sauna fecha o programa voltada para a paisagem de neve.",
    concept: "Em Urubici o inimigo é o vento gelado, então a casa vira as costas para o sul e abre tudo para o vale ao norte. A madeira queimada protege e envelhece junto com a serra. A massa de concreto interna funciona como acumulador: pega o sol do dia e devolve calor à noite.",
    quote: "No frio, cada janela é uma decisão de engenharia, não de estilo.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, R. Hoffmann" },
      { role: "Estrutura", name: "Madeira & Forma" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
  {
    slug: "casa-costa", name: "Casa Costa", year: 2025, local: "Costa da Lagoa — Florianópolis, SC",
    area: "212 m²", type: "Residência", tone: "light",
    blurb: "Casa suspensa em chapa metálica, pousada de leve sobre a encosta.",
    cover: img("casa-costa", "cover"), gallery: gallery("casa-costa"),
    description: "Uma estrutura metálica sobre pilotis levanta a casa da mata e devolve o terreno à vegetação. O revestimento em chapa ondulada reflete a luz do mar; os grandes panos de vidro e o forro de madeira voltam o interior inteiro para a paisagem.",
    concept: "A Costa da Lagoa é mata atlântica preservada, então a regra foi tocar o chão o mínimo possível. A casa pousa em quatro pontos e flutua sobre a vegetação, que segue crescendo por baixo. A chapa metálica é leve de transportar a pé pela trilha — o único acesso ao terreno.",
    quote: "Não desmatamos para construir. Levantamos a casa e deixamos o chão onde estava.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, A. Prado" },
      { role: "Estrutura", name: "Metal Vão Livre" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
  {
    slug: "casa-ladeira", name: "Casa Ladeira", year: 2024, local: "Centro — Florianópolis, SC",
    area: "184 m²", type: "Residência", featured: true, tone: "dark",
    blurb: "Três níveis de concreto que escalam um terreno estreito em ladeira.",
    cover: img("casa-ladeira", "cover"), gallery: gallery("casa-ladeira"),
    description: "Num lote íngreme e apertado, a casa empilha três faixas de concreto que acompanham a rua. Os vãos envidraçados acendem ao entardecer, e o pé-direito duplo, com forro de madeira em leque, organiza o interior em torno da luz.",
    concept: "O terreno em ladeira do Centro virava defeito em quase todo projeto. Aqui ele virou estrutura: cada nível meio-pavimento acima do outro segue a inclinação da rua, e a escada deixa de ser obstáculo para virar a espinha da casa. O concreto aparente assume a ladeira em vez de disfarçá-la.",
    quote: "O terreno difícil já era o projeto. A gente só precisou parar de brigar com ele.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, C. Bittencourt" },
      { role: "Estrutura", name: "Concretto Engenharia" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
  {
    slug: "atelie-lenho", name: "Ateliê Lenho", year: 2026, local: "São José — SC",
    area: "96 m²", type: "Cultural", featured: true, tone: "dark",
    blurb: "Pavilhão de madeira com treliça radial sob um fechamento translúcido.",
    cover: img("atelie-lenho", "cover"), gallery: gallery("atelie-lenho"),
    description: "Uma treliça de madeira se abre em leque a partir de um pilar central e sustenta toda a cobertura. O fechamento em policarbonato difunde a luz de dia e acende a empena à noite, transformando o pavilhão num lampião de madeira.",
    concept: "O programa cultural pedia um vão grande e barato. A treliça radial em madeira resolve os dois: um único pilar central abre toda a planta livre, e o policarbonato translúcido troca a parede cega por luz difusa o dia inteiro. À noite, o pavilhão inverte e ilumina a praça.",
    quote: "Queríamos um galpão que à noite virasse lampião. A estrutura é a própria luminária.",
    credits: [
      { role: "Projeto", name: "Estúdio Lentz" },
      { role: "Equipe", name: "M. Lentz, R. Hoffmann" },
      { role: "Estrutura", name: "Madeira & Forma" },
      { role: "Fotografia", name: "Acervo do estúdio" },
    ],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

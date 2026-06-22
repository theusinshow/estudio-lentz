export interface Project {
  slug: string;
  name: string;
  year: number;
  local: string;
  area: string;
  type: string;
  blurb: string;       // short, for cards/list
  cover: string;
  gallery: string[];
  description: string; // long, for detail page
}

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const PROJECTS: Project[] = [
  {
    slug: "casa-patio", name: "Casa Pátio", year: 2025, local: "Lagoa da Conceição — SC",
    area: "248 m²", type: "Residência",
    blurb: "Um pátio central organiza a casa: luz e ventilação cruzada para todos os ambientes.",
    cover: u("photo-1600585154340-be6161a56a0c"),
    gallery: [u("photo-1600585154340-be6161a56a0c"), u("photo-1600607687939-ce8a6c25118c"), u("photo-1600566753190-17f0baa2a6c3")],
    description: "Concreto aparente e madeira em torno de um vazio central. O pátio traz luz natural ao miolo do programa e cria ventilação cruzada permanente — a casa respira sem depender de fachada.",
  },
  {
    slug: "galpao-cru", name: "Galpão Cru", year: 2024, local: "Biguaçu — SC",
    area: "1.120 m²", type: "Retrofit",
    blurb: "Reconversão de um galpão dos anos 80 em estúdios criativos.",
    cover: u("photo-1497366811353-6870744d04b2"),
    gallery: [u("photo-1497366811353-6870744d04b2"), u("photo-1524758631624-e2822e304c36"), u("photo-1503387762-592deb58ef4e")],
    description: "A estrutura existente foi exposta e celebrada; o novo entra em aço e vidro, sem mimetizar o antigo. O contraste entre a casca bruta e os volumes inseridos organiza os estúdios criativos.",
  },
  {
    slug: "edificio-lamina", name: "Edifício Lâmina", year: 2026, local: "Centro, Florianópolis — SC",
    area: "3.400 m²", type: "Comercial",
    blurb: "Uma lâmina estreita orientada para o sol e a baía, com brises de concreto.",
    cover: u("photo-1486406146926-c627a92ad1ab"),
    gallery: [u("photo-1486406146926-c627a92ad1ab"), u("photo-1454165804606-c3d57bc86b40"), u("photo-1469474968028-56623f02e42e")],
    description: "Brises de concreto pré-moldado dão ritmo à fachada e controlam o ganho térmico. A lâmina estreita garante luz natural e ventilação a todas as lajes corporativas, com vista para a baía.",
  },
  {
    slug: "refugio-mata", name: "Refúgio Mata", year: 2023, local: "Rancho Queimado — SC",
    area: "96 m²", type: "Casa de campo",
    blurb: "Implantação leve sobre pilotis na mata atlântica.",
    cover: u("photo-1518780664697-55e3ad937233"),
    gallery: [u("photo-1518780664697-55e3ad937233"), u("photo-1449844908441-8829872d2607"), u("photo-1416331108676-a22ccb276e35")],
    description: "Volume único de madeira sobre pilotis que toca o mínimo no terreno. A face norte se abre por completo para a paisagem; a mata atravessa por baixo da casa sem ser interrompida.",
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

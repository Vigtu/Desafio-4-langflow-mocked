import { ColorAnalysis } from '@/api/types';

const USE_MOCK = true; // Defina como false para usar a API real

const mockAnalysis: ColorAnalysis = {
  colorPaletteNeutras: [
    { name: "Marrom Quente", hex: "#955628" },
    { name: "Bege Dourado", hex: "#D3B17D" },
    { name: "Marrom Escuro", hex: "#4A2A1F" },
    { name: "Bege Claro", hex: "#D8C3A5" }
  ],
  colorPaletteBasicas: [
    { name: "Coral", hex: "#E2725B" },
    { name: "Verde Oliva", hex: "#6B8E23" },
    { name: "Verde Petróleo", hex: "#006B6B" },
    { name: "Vinho", hex: "#722F37" }
  ],
  colorPaletteDestaque: [
    { name: "Laranja", hex: "#FF7518" },
    { name: "Amarelo Ouro", hex: "#FFC20E" },
    { name: "Verde Esmeralda", hex: "#50C878" },
    { name: "Coral Vivo", hex: "#FF7F50" }
  ],
  season: "Outono",
  seasonSubtype: "Quente",
  seasonTone: "Quente",
  seasonIntensity: "Média",
  seasonSummary: "Você foi classificada como Outono Quente devido à harmonia entre seu tom de pele dourado, olhos castanhos quentes e cabelos castanho-escuros com reflexos dourados. Essa combinação cria uma paleta natural quente e rica que se alinha perfeitamente com as características do Outono.",
  generalSummary: "A análise detalhada revela que suas características naturais são melhor complementadas por tons quentes e vibrantes da paleta Outono Quente. Essas cores realçam a beleza natural da sua pele, olhos e cabelo, proporcionando um visual harmonioso e radiante.",
  characteristics: {
    pele: "Complexão média-clara com subtons dourados",
    olhos: "Castanhos com subtom quente",
    cabelo: "Castanho escuro com reflexos castanho-claros"
  },
  recommendations: {
    vestuario: {
      combinacoes_cores: [
        "Marrom-café com caramelo",
        "Verde-oliva com azul-petróleo",
        "Vinho com terracota"
      ],
      estilos_recomendados: [
        "Peças estruturadas",
        "Estampas étnicas ou geométricas",
        "Decotes em V ou quadrados"
      ],
      tecidos_texturas: [
        "Linho",
        "Algodão",
        "Lã"
      ]
    },
    maquiagem: {
      base: "Bege médio com subtom dourado (ex: MAC Studio Fix Fluid NC30)",
      olhos: {
        sombra: [
          "Tons terrosos",
          "Dourados",
          "Bronzes",
          "Verdes-oliva"
        ],
        delineador: "Marrom-escuro ou verde-musgo",
        mascara: "Marrom-escuro ou preto"
      },
      labios: [
        "Coral quente",
        "Pêssego",
        "Terracota",
        "Vermelho-tijolo"
      ],
      blush: "Pêssego quente, coral suave, terracota claro"
    },
    acessorios: {
      metais: [
        "Ouro amarelo",
        "Bronze",
        "Cobre"
      ],
      joias: [
        "Âmbar",
        "Topázio",
        "Citrino",
        "Granada",
        "Turmalina verde"
      ],
      oculos: "N/A",
      bolsas: [
        "N/A"
      ],
      sapatos: [
        "N/A"
      ]
    },
    cabelo: {
      cores_recomendadas: [
        "Castanho-chocolate com reflexos acobreados",
        "Castanho-mel com mechas caramelo"
      ],
      tecnicas_coloracao: [
        "Balayage em tons de caramelo e mel",
        "Mechas finas em tons de cobre"
      ],
      estilos_corte: [
        "Cortes médios com camadas suaves",
        "Franja lateral longa"
      ]
    }
  },
  colorsToAvoid: [
    "Preto puro",
    "Branco gelo",
    "Cinza frio",
    "Rosa-bebê"
  ],
  recommendationsSummary: "Para realçar sua beleza natural, opte por roupas em tons terrosos e vibrantes, como terracota e caramelo. Acessórios em ouro amarelo e pedras como âmbar e topázio complementam seu visual. Na maquiagem, aposte em tons de pêssego e coral para um look harmonioso e radiante. Evite tons frios como preto puro e branco gelo, que podem criar um contraste desfavorável.",
  exampleLooks: [
    {
      ocasiao: "Casual",
      descricao: "Jeans de lavagem média, blusa de seda verde-oliva, jaqueta de couro caramelo, botas de camurça marrom e acessórios em ouro e âmbar."
    },
    {
      ocasiao: "Formal",
      descricao: "Vestido midi azul-petróleo em crepe, sapatos de salto nude, brincos de ouro com topázio e clutch em tom de vinho."
    }
  ],
  makeupRoutine: [
    "1. Aplicar base bege médio com subtom dourado",
    "2. Corretivo levemente mais claro sob os olhos",
    "3. Pó translúcido para selar",
    "4. Sombra dourada na pálpebra móvel, esfumando com marrom-café no côncavo",
    "5. Delineador marrom-escuro rente aos cílios superiores",
    "6. Máscara marrom nos cílios superiores e inferiores",
    "7. Blush pêssego nas maçãs do rosto",
    "8. Batom coral quente",
    "9. Iluminador dourado suave nas têmporas e arco do cupido"
  ],
  combinacoes_cores: []
};

export async function mockAnalyzeImage(imageUrl: string): Promise<ColorAnalysis> {
  if (USE_MOCK) {
    console.log('Usando dados mock para análise de imagem');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalysis);
      }, 1000); // Simula um atraso de 1 segundo
    });
  } else {
    // Importa e chama a função real de análise de imagem
    const { analyzeImage } = await import('@/api/analyzeImage');
    return analyzeImage(imageUrl);
  }
}
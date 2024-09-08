import { mockImagesTryOn } from '@/utils/mockImagesTryOn';
import { ColorAnalysis, APIRecommendation } from '@/api/types';

const USE_MOCK = true;

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

const mockRecommendations = {
  "look_completo": {
    "peca_principal": {
      "nome": "Blusa em Chiffon com Decote V e Texturas",
      "tipo": "Blusa",
      "link": "https://www.lojasrenner.com.br/p/blusa-em-chiffon-com-decote-v-e-texturas/-/A-927676479-br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/927676508/original/12.jpg",
      "preco": 159.9,
      "cor": "Branco Neve",
      "justificativa": "Escolhida por ser feita de um tecido leve e sofisticado, que complementa bem a paleta Outono Quente e oferece um contraste suave."
    },
    "peca_complementar": {
      "nome": "Calça Flare em Alfaiataria com Barra Larga",
      "tipo": "Calça",
      "link": "https://www.lojasrenner.com.br/p/calca-flare-em-alfaiataria-com-barra-larga/-/A-927939494-br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/927939558/large/12.jpg",
      "preco": 179.9,
      "cor": "Marrom",
      "justificativa": "A calça flare em marrom chocolate é uma peça versátil que complementa a blusa, mantendo a harmonia com a paleta Outono Quente."
    },
    "calcado": {
      "nome": "Sapato Scarpin Slingback com Fivelas e Bico Fino",
      "link": "https://www.lojasrenner.com.br/p/sapato-scarpin-slingback-com-fivelas-e-bico-fino/-/A-927872437-br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/927872470/original/5.jpg",
      "preco": 179.9,
      "cor": "Marrom",
      "justificativa": "Escolhido por seu design elegante e cor neutra, que harmoniza com o resto do conjunto e é adequado para diversas ocasiões."
    },
    "acessorio": {
      "nome": "Conjunto 02 Colares Corrente em Diferentes Formatos",
      "link": "https://www.lojasrenner.com.br/p/conjunto-02-colares-corrente-em-diferentes-formatos/-/A-921046281-br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/921046290/original/4.jpg",
      "preco": 49.9,
      "cor": "Dourado",
      "justificativa": "O colar dourado complementa a paleta Outono Quente e adiciona um toque de sofisticação ao look."
    }
  },
  "alternativas": {
    "alternativa_1": {
      "nome": "Blusa Cropped em Tricô Decote Ombro a Ombro e Ponto Diferenciado",
      "tipo": "Blusa",
      "link": "https://www.lojasrenner.com.br/p/blusa-cropped-em-trico-decote-ombro-a-ombro-e-ponto-diferenciado/-/A-927759063-br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/927759135/original/12.jpg",
      "preco": 69.9,
      "cor": "Verde",
      "justificativa": "Escolhida pela textura diferenciada e cor que harmoniza bem com a paleta Outono Quente."
    },
    "alternativa_2": {
      "nome": "Bolsa Pequena em Palha com Bordados e Tàssel na Alça",
      "tipo": "Bolsa",
      "link": "https://www.lojasrenner.com.br/p/bolsa-pequena-em-palha-com-bordados-e-tassel-na-alca/-/A-927054506-COR927054506-CAMEL-AC.br.lr",
      "imagem": "https://img.lojasrenner.com.br/item/927054522/original/5.jpg",
      "preco": 159.9,
      "cor": "Marrom",
      "justificativa": "A bolsa de palha com detalhes em bordado complementa bem o look casual, adicionando textura e cor."
    }
  },
  "visao_geral": "O look criado é harmonioso e versátil, ideal para o perfil Outono Quente. A blusa de chiffon e a calça flare em marrom proporcionam um visual elegante e sofisticado. O scarpin marrom e o colar dourado adicionam sofisticação e completam o conjunto. As alternativas escolhidas oferecem opções de peças com texturas e cores que continuam a enfatizar a paleta natural do usuário.",
  "preco_total": 569.6
};

export async function mockAnalyzeImage(imageUrl: string): Promise<ColorAnalysis> {
  if (USE_MOCK) {
    console.log('Usando dados mock para análise de imagem');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalysis);
      }, 1000);
    });
  } else {
    // Importa e chama a função real de análise de imagem
    const { analyzeImage } = await import('@/api/analyzeImage');
    return analyzeImage(imageUrl);
  }
}

export async function mockGetRecommendations(colorAnalysis: string, userPreferences: string): Promise<any> {
  if (USE_MOCK) {
    console.log('Usando dados mock para recomendações');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecommendations);
      }, 1000);
    });
  } else {
    // Importa e chama a função real de recomendações
    const { getRecommendations } = await import('@/api/recommendationAPI');
    return getRecommendations(colorAnalysis, userPreferences);
  }
}

export async function mockTryOnAPI(userImageUrl: string, productImageUrl: string): Promise<string> {
  console.log('Usando dados mock para Try-On');
  return new Promise((resolve) => {
    setTimeout(() => {
      let gridNumber;
      if (productImageUrl.includes('927676508')) gridNumber = 1; // Blusa em Chiffon
      else if (productImageUrl.includes('927872470')) gridNumber = 2; // Sapato Scarpin
      else if (productImageUrl.includes('921046290')) gridNumber = 3; // Conjunto de Colares
      else if (productImageUrl.includes('927939558')) gridNumber = 4; // Calça Flare
      else if (productImageUrl.includes('927759135')) gridNumber = 5; // Blusa Cropped
      else if (productImageUrl.includes('927054522')) gridNumber = 6; // Bolsa Pequena
      else {
        console.log('Produto não reconhecido');
        resolve('');
        return;
      }

      const matchingImage = mockImagesTryOn.find(item => item.grid === gridNumber);

      if (matchingImage) {
        console.log(`Retornando imagem de try-on para grid ${gridNumber}: ${matchingImage.image}`);
        resolve(matchingImage.image);
      } else {
        console.log(`Nenhuma imagem de try-on encontrada para grid ${gridNumber}`);
        resolve('');
      }
    }, 1000);
  });
}
export interface NamedColor {
  name: string;
  hex: string;
}

export interface ColorAnalysis {
  colorPaletteNeutras: NamedColor[];
  colorPaletteBasicas: NamedColor[];
  colorPaletteDestaque: NamedColor[];
  season: string;
  seasonSubtype: string;
  seasonTone: string;
  seasonIntensity: string;
  seasonSummary: string;
  generalSummary: string;
  recommendationsSummary: string; // Adicionando esta propriedade
  characteristics: {
    pele: string;
    olhos: string;
    cabelo: string;
  };
  recommendations: {
    vestuario: any;
    maquiagem: any;
    acessorios: any;
    cabelo: any;
  };
  colorsToAvoid: string[];
  exampleLooks: Array<{
    ocasiao: string;
    descricao: string;
  }>;
  makeupRoutine: string[];
  combinacoes_cores: Array<{ descricao: string; cores: string[] }>;
}

// Adicionando a interface APIRecommendation
export interface APIRecommendation {
  name: string;
  link: string;
  image: string;
  price: number;
}

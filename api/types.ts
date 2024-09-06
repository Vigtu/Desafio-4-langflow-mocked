export interface ColorAnalysis {
  colorPaletteNeutras: string[];
  colorPaletteBasicas: string[];
  colorPaletteDestaque: string[];
  season: string;
  seasonSubtype: string;
  seasonTone: string;
  seasonIntensity: string;
  seasonSummary: string;
  generalSummary: string;
  justification: string;
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
  recommendationsSummary: string;
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

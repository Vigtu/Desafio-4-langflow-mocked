// api.ts

import axios from 'axios';

const API_KEY = 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU';
const BASE_URL = 'https://langflow.insyncautomation.online/api/v1/run';

// Tipos para as respostas das APIs
type ColorimetricAnalysis = {
  análise_colorimérica: {
    características: {
      pele: {
        tom_base: string;
        subtom: string;
        características_únicas: string;
      };
      cabelo: {
        cor_base: string;
        reflexos: string;
        profundidade: string;
        textura: string;
      };
      olhos: {
        cor_principal: string;
        cores_secundárias: string[];
        padrões: string;
      };
    };
    tom_base: {
      classificação: string;
      justificativa: string;
    };
    estação: {
      classificação: string;
      justificativa: string;
    };
    paleta_recomendada: {
      cores_neutras: Array<{ nome: string; rgb: string; pantone: string }>;
      cores_básicas: Array<{ nome: string; rgb: string; pantone: string }>;
      cores_destaque: Array<{ nome: string; rgb: string; pantone: string }>;
      cores_metalicas: Array<{ nome: string; rgb: string; pantone: string }>;
    };
    recomendações: {
      vestuário: {
        combinações_cores: string[];
        estilos_recomendados: string[];
        tecidos_texturas: string[];
      };
      maquiagem: {
        base: string;
        olhos: {
          sombra: string[];
          delineador: string;
          mascara: string;
        };
        labios: string[];
        blush: string;
      };
      acessórios: {
        metais: string[];
        joias: string[];
        oculos: string;
        bolsas: string[];
        sapatos: string[];
      };
    };
    cores_evitar: string[];
    dicas_guarda_roupa: {
      pecas_chave: string[];
      dicas_combinacao: string[];
    };
  };
};

type ClothingRecommendation = {
  look_completo: {
    peca_principal: {
      nome: string;
      tipo: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
    peca_complementar: {
      nome: string;
      tipo: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
    calcado: {
      nome: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
    acessorio: {
      nome: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
  };
  alternativas: {
    alternativa_1: {
      nome: string;
      tipo: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
    alternativa_2: {
      nome: string;
      tipo: string;
      link: string;
      imagem: string;
      preco: number;
      cor: string;
      justificativa: string;
    };
  };
  visao_geral: string;
  preco_total: number;
};

// Funções para fazer as chamadas de API
export async function getColorimetricAnalysis(imageUrl: string): Promise<ColorimetricAnalysis> {
  const response = await axios.post(
    `${BASE_URL}/2955d2a4-ade2-47b8-84ed-c0df467c598a?stream=false`,
    {
      input_value: imageUrl,
      output_type: 'chat',
      input_type: 'chat',
      tweaks: {
        'ChatOutput-j3wj5': {},
        'ChatInput-QuXBK': {},
        'JSONCleanerComponent-M9Ei3': {},
        'QwenVLComponent-9GmMr': {}
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }
  );

  return response.data;
}

export async function getClothingRecommendations(colorAnalysis: ColorimetricAnalysis, quizResults: string): Promise<ClothingRecommendation> {
  const response = await axios.post(
    `${BASE_URL}/89684a77-93ed-4f83-bf47-b1d07a975e3b?stream=false`,
    {
      input_value: JSON.stringify({ colorAnalysis, quizResults }),
      output_type: 'chat',
      input_type: 'chat',
      tweaks: {
        'ChatInput-YBZpM': {},
        'Prompt-Koe9C': {},
        'FlowTool-ERizK': {},
        'OpenAIModel-CZ35z': {},
        'ChatOutput-Dmlbu': {},
        'JSONAndMessageSplitter-49TJR': {},
        'WolframAlphaAPI-tnhXB': {},
        'ToolCallingAgent-LYl4S': {},
        'JSONCleanerComponent-96HJQ': {}
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }
  );

  return response.data;
}

export async function getVirtualTryOn(userImageUrl: string, clothingImageUrl: string): Promise<string> {
  const response = await axios.post(
    `${BASE_URL}/fe160115-8128-4a91-a732-8721c1ea41ed?stream=false`,
    {
      input_value: `${userImageUrl},${clothingImageUrl}`,
      output_type: 'chat',
      input_type: 'chat',
      tweaks: {
        'VirtualTryOnComponent-tkBpH': {},
        'ChatInput-X7vDn': {},
        'JSONAndMessageSplitter-6ZOZB': {},
        'ChatOutput-SLec9': {}
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }
  );

  return response.data;
}
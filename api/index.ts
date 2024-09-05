import axios from 'axios'
import { ColorAnalysis, Recommendation, VirtualTryOnResult } from "@/api/types"

export async function uploadImageToBytescale(file: File) {
  const apiKey = 'public_12a1z6L5BQgxbkjEyEUDys4YE79e'
  const accountId = '12a1z6L'
  const uploadUrl = `https://api.bytescale.com/v2/accounts/${accountId}/uploads/binary`

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': file.type,
  }

  try {
    const response = await axios.post(uploadUrl, file, { headers })
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Image upload failed')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function analyzeImage(imageUrl: string): Promise<ColorAnalysis> {
  const url = "https://langflow.insyncautomation.online/api/v1/run/419cc051-ca26-44b6-8416-c85c1bfcd09f?stream=false"
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU'
  }
  const data = {
    "input_value": imageUrl,
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
      // ... (tweaks object)
    }
  }

  try {
    console.log("Enviando requisição para análise com a URL da imagem:", imageUrl);
    const response = await axios.post(url, data, { headers });
    console.log("Resposta recebida da API de análise:", JSON.stringify(response.data, null, 2));

    const { openAIAnalysis, anthropicAnalysis } = extractArtifactMessages(response.data);

    console.log("Análise OpenAI:", openAIAnalysis);
    console.log("Análise Anthropic:", anthropicAnalysis);

    // Parse da análise OpenAI
    const openAIData = JSON.parse(openAIAnalysis);
    const analiseColorimetrica = openAIData.analise_colorimetrica;

    // Extrair características de forma dinâmica
    const characteristics = {
      pele: analiseColorimetrica.caracteristicas.pele || '',
      olhos: analiseColorimetrica.caracteristicas.olhos || '',
      cabelo: analiseColorimetrica.caracteristicas.cabelo || '',
    };

    const colorPaletteNeutras = analiseColorimetrica.paleta_recomendada.cores_neutras.map((cor: any) => cor.rgb_hex);
    const colorPaletteBasicas = analiseColorimetrica.paleta_recomendada.cores_basicas.map((cor: any) => cor.rgb_hex);
    const colorPaletteDestaque = analiseColorimetrica.paleta_recomendada.cores_destaque.map((cor: any) => cor.rgb_hex);
    
    const season = analiseColorimetrica.classificacao.estacao;
    const seasonSubtype = analiseColorimetrica.classificacao.subtipo;
    const seasonTone = analiseColorimetrica.classificacao.tom;
    const seasonIntensity = analiseColorimetrica.classificacao.intensidade;
    
    const seasonSummary = analiseColorimetrica.resumo_classificacao;
    const generalSummary = analiseColorimetrica.resumo_geral;
    const justification = analiseColorimetrica.justificativa;
    
    const recommendations = analiseColorimetrica.recomendacoes;
    const colorsToAvoid = analiseColorimetrica.cores_evitar;
    const recommendationsSummary = analiseColorimetrica.resumo_recomendacoes;
    const exampleLooks = analiseColorimetrica.exemplos_looks;
    const makeupRoutine = analiseColorimetrica.rotina_maquiagem;

    // Criando o objeto ColorAnalysis com os dados extraídos
    const colorAnalysis: ColorAnalysis = {
      colorPaletteNeutras,
      colorPaletteBasicas,
      colorPaletteDestaque,
      season,
      seasonSubtype,
      seasonTone,
      seasonIntensity,
      seasonSummary,
      generalSummary,
      justification,
      characteristics,
      recommendations,
      colorsToAvoid,
      recommendationsSummary,
      exampleLooks,
      makeupRoutine
    };

    console.log("Análise de cor processada:", JSON.stringify(colorAnalysis, null, 2));
    return colorAnalysis;
  } catch (error) {
    console.error("Erro durante a análise:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Detalhes do erro da API:", error.response.data);
    }
    throw error;
  }
}

// Mock API functions
export const mockColorAnalysisAPI = async (imageFile: File): Promise<ColorAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    colorPalette: ['#F5E6D3', '#D4AF37', '#8FBC8F', '#E6D7C3', '#7AA37A'],
    season: 'Outono',
    characteristics: {
      pele: 'Tons quentes',
      olhos: 'Castanhos',
      cabelo: 'Cores ricas'
    },
    tips: 'Abrace cores quentes e ricas como vermelhos profundos...'
  }
}

export const mockRecommendationAPI = async (colorAnalysis: ColorAnalysis, filters: any): Promise<Recommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return [
    { id: 1, name: 'Blusa Elegante', price: 79.99, image: '/placeholder.svg?height=400&width=300&text=Blusa+Elegante' },
    // ... (other recommendations)
  ]
}

export const mockVirtualTryOnAPI = async (userImage: string, clothingImage: string): Promise<VirtualTryOnResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return '/placeholder.svg?height=600&width=400&text=Prova+Virtual'
}

function extractArtifactMessages(jsonResponse: any) {
  try {
    const openAIAnalysis = jsonResponse.outputs[0].outputs[0].artifacts.message
    const anthropicAnalysis = jsonResponse.outputs[0].outputs[1].artifacts.message
    return { openAIAnalysis, anthropicAnalysis }
  } catch (error) {
    console.error("Erro ao acessar as mensagens no caminho especificado:", error)
    return { openAIAnalysis: null, anthropicAnalysis: null }
  }
}

function extractCharacteristics(anthropicData: string): string {
  // Extrair características do texto da análise Anthropic
  const match = anthropicData.match(/Paleta de Cores Ideal:([\s\S]*?)b\. Tons de Maquiagem Recomendados:/);
  return match ? match[1].trim() : "Características não encontradas";
}

function extractTips(anthropicData: string): string {
  // Extrair dicas do texto da análise Anthropic
  const match = anthropicData.match(/Exemplos Concretos:([\s\S]*?)Rotina de Maquiagem:/);
  return match ? match[1].trim() : "Dicas não encontradas";
}

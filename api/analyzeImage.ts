import axios from 'axios';
import { ColorAnalysis } from '@/api/types';

interface AnalysisResult {
  openAIAnalysis: any;
  anthropicAnalysis: any;
}

function extractArtifactMessages(jsonResponse: any): AnalysisResult {
  console.log('Extraindo mensagens dos artefatos...');
  try {
    const openAIAnalysis = jsonResponse.outputs[0].outputs[0].artifacts.message;
    const anthropicAnalysis = jsonResponse.outputs[0].outputs[1].artifacts.message;
    console.log('Mensagens extraídas com sucesso');
    return { openAIAnalysis, anthropicAnalysis };
  } catch (error) {
    console.error("Erro ao acessar as mensagens no caminho especificado:", error);
    return { openAIAnalysis: null, anthropicAnalysis: null };
  }
}

export async function analyzeImage(imageUrl: string): Promise<ColorAnalysis> {
  console.log('Iniciando análise da imagem...');
  const url = "https://langflow.insyncautomation.online/api/v1/run/419cc051-ca26-44b6-8416-c85c1bfcd09f?stream=false";
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU'
  };
  const data = {
    "input_value": imageUrl,
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
      "ChatInput-ytMXX": {},
      "QwenVLComponent-AvYLy": {},
      "OpenAIModel-ADS45": {},
      "QwenVLComponent-yDcju": {},
      "QwenVLComponent-b6U5A": {},
      "QwenVLComponent-RXUin": {},
      "Prompt-3wRDM": {},
      "AnthropicModel-3WAaq": {},
      "ChatOutput-ZUTdZ": {},
      "ChatOutput-2HvHF": {}
    }
  };

  try {
    console.log("Enviando requisição para análise com a URL da imagem:", imageUrl);
    const response = await axios.post(url, data, { headers });
    console.log("Resposta recebida da API de análise");

    const { openAIAnalysis, anthropicAnalysis } = extractArtifactMessages(response.data);

    console.log("Análise OpenAI:", openAIAnalysis);
    console.log("Análise Anthropic:", anthropicAnalysis);

    // Parse das análises (assumindo que são strings JSON)
    const openAIData = JSON.parse(openAIAnalysis);
    const anthropicData = JSON.parse(anthropicAnalysis);

    // Criando o objeto ColorAnalysis com os dados das análises
    const colorAnalysis: ColorAnalysis = {
      colorPaletteNeutras: openAIData.analise_colorimetrica.paleta_recomendada.cores_neutras.map((cor: any) => cor.rgb_hex),
      colorPaletteBasicas: openAIData.analise_colorimetrica.paleta_recomendada.cores_basicas.map((cor: any) => cor.rgb_hex),
      colorPaletteDestaque: openAIData.analise_colorimetrica.paleta_recomendada.cores_destaque.map((cor: any) => cor.rgb_hex),
      season: openAIData.analise_colorimetrica.classificacao.estacao,
      seasonSubtype: openAIData.analise_colorimetrica.classificacao.subtipo,
      seasonTone: openAIData.analise_colorimetrica.classificacao.tom,
      seasonIntensity: openAIData.analise_colorimetrica.classificacao.intensidade,
      seasonSummary: openAIData.analise_colorimetrica.resumo_classificacao,
      generalSummary: openAIData.analise_colorimetrica.resumo_geral,
      justification: openAIData.analise_colorimetrica.justificativa,
      characteristics: {
        pele: anthropicData.Análise_Detalhada.a['Paleta de cores ideal'].pele,
        olhos: anthropicData.Análise_Detalhada.a['Paleta de cores ideal'].olhos,
        cabelo: anthropicData.Análise_Detalhada.a['Paleta de cores ideal'].cabelo,
      },
      recommendations: {
        vestuario: openAIData.analise_colorimetrica.recomendacoes.vestuario,
        maquiagem: openAIData.analise_colorimetrica.recomendacoes.maquiagem,
        acessorios: openAIData.analise_colorimetrica.recomendacoes.acessorios,
        cabelo: openAIData.analise_colorimetrica.recomendacoes.cabelo,
      },
      colorsToAvoid: openAIData.analise_colorimetrica.cores_evitar,
      recommendationsSummary: openAIData.analise_colorimetrica.resumo_recomendacoes,
      exampleLooks: openAIData.analise_colorimetrica.exemplos_looks,
      makeupRoutine: openAIData.analise_colorimetrica.rotina_maquiagem,
    };

    return colorAnalysis;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Falha na requisição HTTP para análise:", error.message);
      if (error.response) {
        console.error("Conteúdo da resposta de erro:", error.response.data);
      }
    } else {
      console.error("Erro inesperado durante a análise:", error);
    }
    throw error;
  }
}
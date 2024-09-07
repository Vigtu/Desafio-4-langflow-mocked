import axios from 'axios'
import { ColorAnalysis } from "@/api/types"

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
      // ... (mantenha os tweaks existentes)
    }
  };

  try {
    console.log("Enviando requisição para análise com a URL da imagem:", imageUrl);
    const response = await axios.post(url, data, { headers });
    console.log("Resposta recebida da API de análise:", JSON.stringify(response.data, null, 2));

    const apiResponse = extractArtifactMessages(response.data);

    if (!apiResponse || !apiResponse.outputs || !apiResponse.outputs[0] || !apiResponse.outputs[0].outputs) {
      throw new Error("Resposta da API inválida ou incompleta");
    }

    const analysisText = apiResponse.outputs[0].outputs[0].results.message.data.text;
    console.log("Texto da análise:", analysisText);

    const analysisData = JSON.parse(analysisText);

    if (!analysisData.analise_colorimetrica) {
      throw new Error("Dados de análise colorimétrica não encontrados na resposta");
    }

    const analiseColorimetrica = analysisData.analise_colorimetrica;

    // Construa o objeto ColorAnalysis com os dados da análise
    const colorAnalysis: ColorAnalysis = {
      colorPaletteNeutras: analiseColorimetrica.paleta_recomendada.cores_neutras.map((cor: any) => ({
        name: cor.nome,
        hex: cor.rgb_hex
      })),
      colorPaletteBasicas: analiseColorimetrica.paleta_recomendada.cores_basicas.map((cor: any) => ({
        name: cor.nome,
        hex: cor.rgb_hex
      })),
      colorPaletteDestaque: analiseColorimetrica.paleta_recomendada.cores_destaque.map((cor: any) => ({
        name: cor.nome,
        hex: cor.rgb_hex
      })),
      season: analiseColorimetrica.classificacao.estacao,
      seasonSubtype: analiseColorimetrica.classificacao.subtipo,
      seasonTone: analiseColorimetrica.classificacao.tom,
      seasonIntensity: analiseColorimetrica.classificacao.intensidade,
      seasonSummary: analiseColorimetrica.resumo_classificacao,
      generalSummary: analiseColorimetrica.resumo_geral,
      characteristics: analiseColorimetrica.caracteristicas,
      recommendations: analiseColorimetrica.recomendacoes,
      colorsToAvoid: analiseColorimetrica.cores_evitar,
      recommendationsSummary: analiseColorimetrica.resumo_recomendacoes,
      exampleLooks: analiseColorimetrica.exemplos_looks,
      makeupRoutine: analiseColorimetrica.rotina_maquiagem,
      combinacoes_cores: analiseColorimetrica.combinacoes_cores || []
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

function extractArtifactMessages(jsonResponse: any) {
  try {
    console.log("Resposta completa da API:", JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
  } catch (error) {
    console.error("Erro ao processar a resposta da API:", error);
    return null;
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

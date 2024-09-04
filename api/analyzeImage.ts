import axios from 'axios';

async function sendRequest(url: string, headers: Record<string, string>, data: any): Promise<any> {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Falha na requisição HTTP:", error.message);
      if (error.response) {
        console.error("Conteúdo bruto da resposta:");
        console.error(error.response.data);
      }
    } else {
      console.error("Erro inesperado:", error);
    }
    return null;
  }
}

export async function analyzeImage(imageUrl: string): Promise<string> {
  const url = "https://langflow.insyncautomation.online/api/v1/run/2955d2a4-ade2-47b8-84ed-c0df467c598a?stream=false";
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU'
  };
  const data = {
    "input_value": imageUrl,
    "output_type": "chat",
    "input_type": "chat",
  };

  console.log("Enviando requisição com a URL da imagem:", imageUrl);

  const responseJson = await sendRequest(url, headers, data);

  console.log("Resposta completa da API:", JSON.stringify(responseJson, null, 2));

  if (responseJson) {
    try {
      const artifactMessage = responseJson.outputs[0].outputs[0].artifacts.message;
      console.log("Mensagem extraída:", artifactMessage);
      return artifactMessage;
    } catch (error) {
      console.error("O campo 'artifacts' > 'message' não foi encontrado na resposta.");
      return "Erro ao extrair a mensagem da resposta.";
    }
  } else {
    console.error("Nenhuma resposta JSON válida foi retornada.");
    return "Falha ao obter uma resposta válida da API.";
  }
}
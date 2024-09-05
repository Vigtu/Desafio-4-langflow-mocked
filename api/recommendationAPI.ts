import axios from 'axios';

const API_URL = "https://langflow.insyncautomation.online/api/v1/run/89684a77-93ed-4f83-bf47-b1d07a975e3b?stream=false";
const API_KEY = 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU';

interface ApiResponse {
  outputs: Array<{
    outputs: Array<{
      results: {
        message: {
          data: {
            text: string;
          };
        };
      };
    }>;
  }>;
}

export async function getRecommendations(colorAnalysis: string, userPreferences: string): Promise<any> {
  try {
    // Combina a análise de cores e as preferências do usuário
    const combinedInput = `${colorAnalysis} ${userPreferences}`;

    console.log("Enviando para a API:", combinedInput);

    const response = await axios.post<ApiResponse>(
      API_URL,
      {
        input_value: combinedInput,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "ChatInput-k8TOv": {},
          "Prompt-ytFQh": {},
          "FlowTool-7AEYX": {},
          "OpenAIModel-wcXsZ": {},
          "ChatOutput-1wfIR": {},
          "JSONAndMessageSplitter-dOdAr": {},
          "WolframAlphaAPI-wxFo9": {},
          "ToolCallingAgent-FjfJr": {},
          "JSONCleanerComponent-PxbdR": {}
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      }
    );

    // Extrai o texto filtrado da resposta
    const filteredText = extractFilteredText(response.data);

    console.log("Texto filtrado da API:", JSON.stringify(filteredText, null, 2));

    return filteredText;
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    throw error;
  }
}

function extractFilteredText(apiResponse: ApiResponse): any {
  try {
    const filteredText = apiResponse.outputs[0].outputs[0].results.message.data.text;
    return JSON.parse(filteredText);
  } catch (error) {
    console.error("Erro ao acessar o texto filtrado:", error);
    return null;
  }
}

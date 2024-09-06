import axios from 'axios';

const API_KEY = "sk--qsZcqmQJKio9bx_O0WlQSgly11AA8XfbkZQQNo-sjU";
const API_URL = "https://langflow.insyncautomation.online/api/v1/run/fe160115-8128-4a91-a732-8721c1ea41ed?stream=false";

export async function callTryOnAPI(userImageUrl: string, productImageUrl: string): Promise<string> {
  console.log('Chamando API de Try-On com:', { userImageUrl, productImageUrl });

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  };

  const message = `${userImageUrl} , ${productImageUrl}`;
  console.log('Mensagem para a API:', message);

  const payload = {
    "input_value": message,
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
      "VirtualTryOnComponent-tkBpH": {},
      "ChatInput-X7vDn": {},
      "JSONAndMessageSplitter-6ZOZB": {},
      "ChatOutput-SLec9": {}
    }
  };

  try {
    console.log('Enviando requisição para a API...');
    const response = await axios.post(API_URL, payload, { headers });
    
    console.log('Resposta da API:', response.data);

    if (response.status === 200) {
      const filteredMessage = response.data.outputs[0].outputs[0].results.message.text;
      console.log('Mensagem filtrada:', filteredMessage);
      return filteredMessage;
    } else {
      throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao chamar a API de Try-On:', error);
    throw error;
  }
}
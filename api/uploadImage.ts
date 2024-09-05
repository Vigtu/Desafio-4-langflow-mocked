import axios from 'axios';

export async function uploadImageToBytescale(file: File) {
  const apiKey = 'public_12a1z6L5BQgxbkjEyEUDys4YE79e';
  const accountId = '12a1z6L';
  const uploadUrl = `https://api.bytescale.com/v2/accounts/${accountId}/uploads/binary`;

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': file.type,
  };

  try {
    console.log('Iniciando upload da imagem para Bytescale...');
    const response = await axios.post(uploadUrl, file, { headers });
    
    if (response.status === 200) {
      console.log('Imagem enviada com sucesso. Resposta do Bytescale:', JSON.stringify(response.data, null, 2));
      return response.data;
    } else {
      console.error('Erro ao enviar imagem:', response.status, response.statusText);
      throw new Error('Falha no upload da imagem');
    }
  } catch (error) {
    console.error('Erro durante o upload da imagem:', error);
    throw error;
  }
}
import axios from 'axios';

export async function analyzeImage(imageUrl: string) {
  const url = "https://langflow.insyncautomation.online/api/v1/run/2955d2a4-ade2-47b8-84ed-c0df467c598a?stream=false";
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'sk--qsZcqmQJKio9bx_O0WlQSgly11AA8Xf bkZQQNo-sjU'
  };
  const data = {
    "input_value": imageUrl,
    "output_type": "chat",
    "input_type": "chat",
  };

  try {
    const response = await axios.post(url, data, { headers });
    
    if (response.status === 200 && response.data) {
      try {
        const artifactMessage = response.data.outputs[0].outputs[0].artifacts.message;
        console.log('Image analysis result:', artifactMessage);
        return artifactMessage;
      } catch (error) {
        console.error("The field 'artifacts' > 'message' was not found in the response.");
        return null;
      }
    } else {
      console.error("No valid response was returned.");
      return null;
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
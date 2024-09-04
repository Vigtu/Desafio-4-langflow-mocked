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
    const response = await axios.post(uploadUrl, file, { headers });
    
    if (response.status === 200) {
      console.log('Image uploaded successfully:', response.data);
      return response.data;
    } else {
      console.error('Error uploading image:', response.status, response.statusText);
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
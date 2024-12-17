import axios from 'axios';
import { showAlert } from './alerts';

export const downloadFile = async (fileId) => {
  try {
    const response = await axios({
      url: '/api/files/' + fileId,
      method: 'get',
      responseType: 'blob', // Crucial for binary data
    });

    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = response.headers['content-disposition']
      .split('filename=')[1]
      .trim();
    // Extract filename from header
    link.style.display = 'none'; // Hide the link visually (optional)
    document.body.appendChild(link);

    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Handle errors gracefully (e.g., display an error message to the user)
  }
};

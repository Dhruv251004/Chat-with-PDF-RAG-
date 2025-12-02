const API_BASE_URL = 'http://localhost:5000';

export const createChat = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append('chat_pdf', pdfFile);

    const response = await fetch(`${API_BASE_URL}/api/chat/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/query/${chatId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChatHistory = async (chatId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

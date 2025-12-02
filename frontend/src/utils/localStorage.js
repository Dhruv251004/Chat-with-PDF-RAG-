const CHATS_KEY = 'pdf_chat_sessions';

export const getStoredChats = () => {
  try {
    const chats = localStorage.getItem(CHATS_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveChat = (chatId, title) => {
  try {
    const chats = getStoredChats();
    const newChat = {
      id: chatId,
      title: title,
      createdAt: new Date().toISOString()
    };
    const updatedChats = [newChat, ...chats];
    localStorage.setItem(CHATS_KEY, JSON.stringify(updatedChats));
    return newChat;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
};

export const deleteChat = (chatId) => {
  try {
    const chats = getStoredChats();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    localStorage.setItem(CHATS_KEY, JSON.stringify(updatedChats));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw error;
  }
};

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import UploadArea from './components/UploadArea';
import ChatView from './components/ChatView';
import { getStoredChats, saveChat } from './utils/localStorage';
import { createChat } from './services/api';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedChats = getStoredChats();
    setChats(storedChats);
  }, []);

  const handleUpload = async (file) => {
    setIsUploading(true);

    try {
      const response = await createChat(file);
      const newChat = saveChat(response.chat_id, file.name);

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(response.chat_id);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {selectedChatId ? (
        <ChatView chatId={selectedChatId} />
      ) : (
        <UploadArea onUpload={handleUpload} isUploading={isUploading} />
      )}
    </div>
  );
}

export default App;

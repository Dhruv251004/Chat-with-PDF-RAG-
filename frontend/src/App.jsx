import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import UploadArea from './components/UploadArea';
import ChatView from './components/ChatView';
import { getStoredChats, saveChat } from './utils/localStorage';
import { createChat } from './services/api';
export default function App() {
	const [chats, setChats] = useState([]);
	const [selectedChatId, setSelectedChatId] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Find the currently selected chat object for passing title
	const currentChat = chats.find((chat) => chat.id === selectedChatId);
	const chatTitle = currentChat ? currentChat.title : 'New Chat';

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	// Load chats from localStorage on initial load
	useEffect(() => {
		const storedChats = getStoredChats();
		setChats(storedChats);
		// Automatically select the most recent chat if available
		if (storedChats.length > 0) {
			setSelectedChatId(storedChats[0].id);
		}
	}, []);

	const handleUpload = async (file) => {
		setIsUploading(true);

		try {
			const response = await createChat(file);
			const newChat = saveChat(response.chat_id, file.name);

			// Update chats list and select the new chat
			setChats((prev) => {
				// Ensure no duplicates and keep new chat at the top
				const updatedChats = prev.filter((chat) => chat.id !== newChat.id);
				return [newChat, ...updatedChats];
			});
			setSelectedChatId(response.chat_id);
		} catch (error) {
			console.error('Error uploading PDF:', error);
			alert(
				'Failed to upload PDF. Please check your backend connection and try again.'
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSelectChat = (chatId) => {
		setSelectedChatId(chatId);
	};

	const handleDeleteChat = (chatId) => {
		// Update the local state synchronously
		const remainingChats = chats.filter((chat) => chat.id !== chatId);
		setChats(remainingChats);

		if (selectedChatId === chatId) {
			// After deleting, select the next chat or go to upload area
			if (remainingChats.length > 0) {
				setSelectedChatId(remainingChats[0].id);
			} else {
				setSelectedChatId(null); // Go to Upload Area
			}
		}
	};

	const handleNewChat = () => {
		setSelectedChatId(null); // Clear selected chat to show UploadArea
	};

	return (
		<div className='flex h-screen overflow-hidden font-sans antialiased bg-gray-100'>
			<Sidebar
				chats={chats}
				selectedChatId={selectedChatId}
				onSelectChat={handleSelectChat}
				onDeleteChat={handleDeleteChat}
				onNewChat={handleNewChat}
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			{selectedChatId ? (
				<ChatView
					chatId={selectedChatId}
					key={selectedChatId}
					chatTitle={chatTitle}
					toggleSidebar={toggleSidebar}
				/>
			) : (
				<UploadArea
					onUpload={handleUpload}
					isUploading={isUploading}
				/>
			)}
		</div>
	);
}

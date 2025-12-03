import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessage, getChatHistory } from '../services/api';
import Message from './Message';
import { useCallback } from 'react';
import { Menu } from 'lucide-react';
const ChatView = ({ chatId, chatTitle, toggleSidebar }) => {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	useEffect(() => {
		const loadChatHistory = async () => {
			setMessages([]); // Clear previous chat history while loading new one
			setIsLoading(true);
			try {
				const data = await getChatHistory(chatId);
				setMessages(data.messages || []);
			} catch (error) {
				console.error('Error loading chat history:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (chatId) {
			loadChatHistory();
		}
	}, [chatId]);

	const handleSendMessage = async (e) => {
		e.preventDefault();

		if (!inputValue.trim() || isLoading) {
			return;
		}

		const query = inputValue.trim();
		const userMessage = {
			id: Date.now(),
			sender: 'user',
			content: query,
			created_at: new Date().toISOString(),
		};

		// Optimistic UI update
		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsLoading(true);

		try {
			const response = await sendMessage(chatId, query);

			const aiMessage = {
				id: response.ai_message_id,
				sender: 'assistant',
				content: response.response,
				created_at: new Date().toISOString(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error('Error sending message:', error);
			// Revert optimistic update and show error message
			setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
			alert('Failed to send message. Please check your backend.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		// FIXED: Removed h-screen to resolve scrolling issues caused by flex and fixed footer.
		<div className='flex-1 flex flex-col bg-gray-100 transition-colors duration-300'>
			{/* Chat Header (Responsive) */}
			<div className='lg:hidden p-4 border-b border-gray-300 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10'>
				<button
					onClick={toggleSidebar}
					className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700'
					aria-label='Toggle sidebar'>
					<Menu className='w-6 h-6' />
				</button>
				<h2 className='font-semibold text-lg text-gray-800 truncate max-w-[60%]'>
					{chatTitle}
				</h2>
				<div className='w-6 h-6' /> {/* Placeholder for centering */}
			</div>

			{/* Chat Messages Area */}
			<div className='flex-1 overflow-y-auto p-4 sm:p-6 mb-20'>
				<div className='max-w-3xl mx-auto'>
					{messages.length === 0 && !isLoading ? (
						<div className='text-center text-gray-500 mt-10 sm:mt-20 p-8 border border-dashed border-gray-300 rounded-xl bg-white/50'>
							<h3 className='text-2xl sm:text-3xl font-bold mb-2 text-gray-800'>
								Ready to Chat!
							</h3>
							<p className='text-base sm:text-lg text-gray-600'>
								Ask your first question about this document.
							</p>
						</div>
					) : (
						messages.map((message) => (
							<Message
								key={message.id}
								message={message}
							/>
						))
					)}

					{isLoading && messages.length > 0 && (
						<div className='flex items-center gap-2 text-blue-500 mb-6 justify-start p-2'>
							<Loader2 className='w-5 h-5 animate-spin text-blue-600' />
							<span className='text-sm font-medium text-gray-600'>
								AI is generating response...
							</span>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area (Sticky Footer) */}
			<div className='fixed bottom-0 left-0 lg:left-72 w-full lg:w-[calc(100%-18rem)] border-t border-gray-200 bg-white shadow-2xl z-20'>
				<div className='max-w-4xl mx-auto p-3 sm:p-4'>
					<form
						onSubmit={handleSendMessage}
						className='flex gap-3 sm:gap-4'>
						<input
							type='text'
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder='Type your question here...'
							disabled={isLoading}
							className='flex-1 px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow disabled:bg-gray-100'
							aria-label='Chat input'
						/>
						<button
							type='submit'
							disabled={!inputValue.trim() || isLoading}
							className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-90'
							title='Send Message'>
							<Send className='w-5 h-5' />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default ChatView;

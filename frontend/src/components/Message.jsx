import React from 'react';
import { MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Message = ({ message }) => {
	const isUser = message.sender === 'user';

	// Enhanced Message Bubble Styling
	const messageClasses = isUser
		? 'bg-blue-600 text-white self-end rounded-t-xl rounded-bl-xl shadow-lg shadow-blue-500/20'
		: 'bg-white text-gray-900 self-start rounded-t-xl rounded-br-xl shadow-lg border border-gray-200';

	const avatar = isUser ? (
		<div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md'>
			U
		</div>
	) : (
		<div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center text-white flex-shrink-0 shadow-md'>
			<MessageSquare className='w-4 h-4 text-blue-400' />
		</div>
	);

	return (
		<div
			className={`flex items-start gap-3 mb-6 ${
				isUser ? 'justify-end' : 'justify-start'
			}`}>
			{!isUser && avatar}
			<div
				className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-3 sm:p-4 transition-all duration-300 ${messageClasses}`}>
				<div className='text-xs font-medium mb-1 opacity-70'>
					{isUser ? 'You' : 'AI Assistant'}
				</div>
				{isUser ? (
					<div className='whitespace-pre-wrap font-medium text-sm sm:text-base'>
						{message.content}
					</div>
				) : (
					// Tailwind CSS 'prose' helper for markdown formatting
					<div className='prose prose-sm max-w-none text-sm sm:text-base'>
						<ReactMarkdown>{message.content}</ReactMarkdown>
					</div>
				)}
			</div>
			{isUser && avatar}
		</div>
	);
};
export default Message;

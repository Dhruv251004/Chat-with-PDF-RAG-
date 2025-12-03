import { FileText, Trash2 } from 'lucide-react';
import { deleteChat } from '../utils/localStorage';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { X } from 'lucide-react';

const Sidebar = ({
	chats,
	selectedChatId,
	onSelectChat,
	onDeleteChat,
	onNewChat,
	isSidebarOpen,
	toggleSidebar,
}) => {
	const [confirmingDelete, setConfirmingDelete] = useState(null);

	const handleDelete = (e, chatId) => {
		e.stopPropagation();
		setConfirmingDelete(chatId);
	};

	const confirmDelete = (chatId) => {
		deleteChat(chatId);
		onDeleteChat(chatId);
		setConfirmingDelete(null);
	};

	const cancelDelete = (e) => {
		e.stopPropagation();
		setConfirmingDelete(null);
	};

	return (
		<>
			{/* Overlay for Mobile */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 bg-black/50 lg:hidden z-30 transition-opacity duration-300'
					onClick={toggleSidebar}></div>
			)}

			{/* Sidebar Content */}
			<div
				className={`fixed inset-y-0 left-0 w-64 sm:w-72 bg-gray-800 text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 
                    lg:static lg:translate-x-0 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				{/* Header and New Chat Button */}
				<div className='p-4 border-b border-gray-700 flex flex-col gap-4 sticky top-0 bg-gray-900 shadow-md'>
					<div className='flex justify-between items-center'>
						<h1 className='text-xl sm:text-2xl font-extrabold text-blue-400 tracking-wide'>
							PDF-RAG Chat
						</h1>
						<button
							onClick={toggleSidebar}
							className='lg:hidden p-1 rounded-full hover:bg-gray-700 transition-colors'
							aria-label='Close sidebar'>
							<X className='w-6 h-6 text-gray-400' />
						</button>
					</div>

					<button
						onClick={() => {
							onNewChat();
							toggleSidebar();
						}} // Close sidebar after new chat action
						className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] ring-4 ring-transparent hover:ring-blue-500/50'>
						<PlusCircle className='w-5 h-5' />
						New Document Chat
					</button>
				</div>

				{/* Chat List */}
				<div className='flex-1 overflow-y-auto pt-2'>
					{chats.length === 0 ? (
						<div className='p-4 text-gray-500 text-sm text-center'>
							Upload a document to start your first chat session.
						</div>
					) : (
						<div className='py-2'>
							{chats.map((chat) => (
								<div
									key={chat.id}
									onClick={() => {
										onSelectChat(chat.id);
										toggleSidebar();
									}} // Close sidebar after selection
									className={`group relative px-4 py-3 cursor-pointer transition-all duration-150 border-l-4 ${
										selectedChatId === chat.id
											? 'bg-blue-700/50 border-blue-400 font-semibold'
											: 'hover:bg-gray-700 border-transparent'
									}`}>
									<div className='flex items-center gap-3'>
										<FileText className='w-5 h-5 flex-shrink-0 text-blue-300' />
										<div className='flex-1 min-w-0'>
											<p className='text-sm truncate'>{chat.title}</p>
											<p className='text-xs text-gray-400 mt-0.5'>
												{new Date(chat.createdAt).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'short',
													day: 'numeric',
												})}
											</p>
										</div>

										{confirmingDelete === chat.id ? (
											<div className='flex items-center gap-2 text-xs bg-gray-700 p-1 px-2 rounded-lg shadow-inner'>
												<span className='text-gray-300'>Delete?</span>
												<button
													onClick={(e) => confirmDelete(chat.id)}
													className='font-bold text-green-400 hover:text-green-300'>
													Yes
												</button>
												/
												<button
													onClick={cancelDelete}
													className='font-bold text-red-400 hover:text-red-300'>
													No
												</button>
											</div>
										) : (
											<button
												onClick={(e) => handleDelete(e, chat.id)}
												className={`p-1 rounded transition-opacity hover:bg-gray-600 ${
													selectedChatId === chat.id
														? 'opacity-100'
														: 'opacity-0 group-hover:opacity-100'
												}`}
												title='Delete Chat'>
												<Trash2 className='w-4 h-4 text-gray-400 hover:text-red-400' />
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Sidebar;

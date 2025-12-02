import { FileText, Trash2 } from 'lucide-react';
import { deleteChat } from '../utils/localStorage';

const Sidebar = ({ chats, selectedChatId, onSelectChat, onDeleteChat }) => {
  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
      onDeleteChat(chatId);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Chat with PDF</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-gray-400 text-sm text-center">
            No chats yet. Upload a PDF to start!
          </div>
        ) : (
          <div className="py-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group relative px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedChatId === chat.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

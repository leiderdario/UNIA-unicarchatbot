import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '../types';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    // Format timestamp
    const timestamp = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Bot Avatar (only for bot messages) */}
                {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                        U
                    </div>
                )}

                {/* Message Bubble */}
                <div className="flex flex-col">
                    <div
                        className={`px-4 py-3 shadow-lg transition-all duration-300 ${isUser
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3xl rounded-br-lg'
                                : 'bg-slate-800/80 dark:bg-slate-800/80 backdrop-blur-xl text-gray-100 rounded-3xl rounded-bl-lg border border-slate-700/50'
                            }`}
                    >
                        <div className={`prose ${isUser ? 'prose-invert' : 'prose-invert'} max-w-none text-sm sm:text-base break-words`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

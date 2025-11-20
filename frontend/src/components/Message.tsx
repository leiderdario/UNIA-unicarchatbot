import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '../types';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                    }`}
            >
                <div className={`prose ${isUser ? 'prose-invert' : 'dark:prose-invert'} max-w-none text-sm sm:text-base break-words`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

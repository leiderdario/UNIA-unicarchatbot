import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const hasText = input.trim().length > 0;

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-700/50">
            <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-slate-800/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
                {/* Emoji Button */}
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-slate-700/50 flex-shrink-0"
                    aria-label="Agregar emoji"
                >
                    <Smile className="w-5 h-5" />
                </button>

                {/* Input */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 text-gray-100 placeholder-gray-500 py-2 text-sm sm:text-base"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!hasText || disabled}
                    className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${hasText && !disabled
                            ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:scale-105 shadow-lg shadow-blue-500/25'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    aria-label="Enviar mensaje"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

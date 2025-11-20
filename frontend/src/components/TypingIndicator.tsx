import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-2 mb-4">
            {/* Bot Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                U
            </div>

            {/* Typing Bubble */}
            <div className="bg-slate-800/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg">
                <div className="flex space-x-2 items-center">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

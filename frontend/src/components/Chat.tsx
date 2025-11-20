import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { Message as MessageType } from '../types';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

interface ChatProps {
    messages: MessageType[];
    isLoading: boolean;
    onQuickAction?: (action: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ messages, isLoading, onQuickAction }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const quickActions = [
        {
            id: 'academic',
            label: 'Consulta académica',
            icon: BookOpen,
            gradient: 'from-blue-600 to-cyan-500',
            text: '¿Puedes ayudarme con una consulta académica?'
        },
        {
            id: 'emotional',
            label: 'Apoyo emocional',
            icon: Heart,
            gradient: 'from-pink-600 to-rose-500',
            text: 'Necesito apoyo emocional'
        },
        {
            id: 'study',
            label: 'Consejos de estudio',
            icon: Sparkles,
            gradient: 'from-purple-600 to-violet-500',
            text: '¿Qué consejos de estudio me puedes dar?'
        }
    ];

    const handleQuickAction = (text: string) => {
        if (onQuickAction) {
            onQuickAction(text);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-400 relative z-10">
                    {/* Welcome Message */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25">
                        <span className="text-4xl font-bold text-white">U</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        ¡Hola! Soy UNIA
                    </h2>
                    <p className="text-center max-w-md mb-8 text-gray-300">
                        Tu asistente académico con detección de emociones. Estoy aquí para ayudarte en lo que necesites.
                    </p>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action.text)}
                                    className={`group relative overflow-hidden bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                                            {action.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-12 text-xs text-gray-500 dark:text-gray-600 text-center max-w-2xl px-4">
                        <p>UNIA puede cometer errores. Verifica la información importante.</p>
                    </div>
                </div>
            ) : (
                <div className="relative z-10">
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <TypingIndicator />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};

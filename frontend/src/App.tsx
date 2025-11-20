import { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { MessageInput } from './components/MessageInput';
import { sendMessage } from './services/api';
import { Message } from './types';
import { Sun, Moon, Trash2 } from 'lucide-react';
import logo from './img/logo/logo1.png';

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true); // Default dark mode
    const [currentEmotion, setCurrentEmotion] = useState<string>('😊 Neutral');

    useEffect(() => {
        // Initialize dark mode
        document.documentElement.classList.add('dark');
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleSendMessage = async (content: string) => {
        const newUserMessage: Message = {
            role: 'user',
            content,
            timestamp: new Date()
        };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        // Simulate emotion detection (you can implement real detection later)
        const emotions = ['😊 Positivo', '😐 Neutral', '😔 Negativo', '🤔 Curioso', '😕 Confundido'];
        setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);

        try {
            const context = updatedMessages.slice(-10);
            const data = await sendMessage(content, context);

            const botMessage: Message = {
                role: 'model',
                content: data.response,
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'model',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (text: string) => {
        handleSendMessage(text);
    };

    const clearChat = () => {
        setMessages([]);
        setCurrentEmotion('😊 Neutral');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="flex flex-col h-screen">
                {/* Header */}
                <header className="bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-4 sm:px-6 py-4 z-20 shadow-lg">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="UNIA Logo"
                                    className="w-12 h-12 object-contain rounded-xl shadow-lg"
                                />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                    UNIA
                                </h1>
                                <p className="text-xs text-gray-400 font-medium">
                                    Academia & Emociones
                                </p>
                            </div>
                        </div>

                        {/* Status and Controls */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Online Status */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-green-400 font-medium">En línea</span>
                            </div>

                            {/* Emotion Badge */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <span className="text-sm">{currentEmotion}</span>
                            </div>

                            {/* Clear Chat Button */}
                            <button
                                onClick={clearChat}
                                className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-slate-800/50 hover:scale-105"
                                title="Limpiar conversación"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 rounded-lg hover:bg-slate-800/50 hover:scale-105"
                                title="Cambiar tema"
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <main className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
                    <Chat
                        messages={messages}
                        isLoading={isLoading}
                        onQuickAction={handleQuickAction}
                    />
                    <MessageInput onSend={handleSendMessage} disabled={isLoading} />
                </main>
            </div>
        </div>
    );
}

export default App;

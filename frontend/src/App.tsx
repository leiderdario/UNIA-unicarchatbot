import { useState } from 'react';
import { Chat } from './components/Chat';
import { MessageInput } from './components/MessageInput';
import { sendMessage } from './services/api';
import { Message } from './types';

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleSendMessage = async (content: string) => {
        const newUserMessage: Message = { role: 'user', content };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Send only the last 10 messages for context to keep it lightweight
            const context = updatedMessages.slice(-10);
            const data = await sendMessage(content, context);

            const botMessage: Message = { role: 'model', content: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'model',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.'
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            U
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-800 dark:text-white">UNIA</h1>
                            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearChat}
                            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Limpiar conversación"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Cambiar tema"
                        >
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                {/* Chat Area */}
                <main className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full bg-white dark:bg-gray-900 shadow-xl my-0 sm:my-4 sm:rounded-2xl border border-gray-200 dark:border-gray-800">
                    <Chat messages={messages} isLoading={isLoading} />
                    <MessageInput onSend={handleSendMessage} disabled={isLoading} />
                </main>
            </div>
        </div>
    );
}

export default App;

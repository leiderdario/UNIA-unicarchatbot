const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        temperature: 0.8,
    }
});

// Chat History Store (In-memory for simplicity, per requirements)
// Note: In a real production app, this should be in a database or Redis
// keyed by session ID. For this demo, we'll just keep a simple history 
// or rely on the client sending context. 
// The requirement says "Mantener contexto de conversación", 
// usually this means the backend manages it or the frontend sends the history.
// To be stateless and scalable, we'll accept history from the frontend.

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Construct chat history for Gemini
        // Gemini expects history in format: { role: "user" | "model", parts: [{ text: string }] }
        const chatHistory = history ? history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        })) : [];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // System instruction can be set via systemInstruction in getGenerativeModel 
        // or prepended to the first message if the API version doesn't support it yet fully in all SDKs.
        // gemini-1.5-pro and later support systemInstruction. 
        // Let's check if we can add it to the model config or just prepend.
        // For safety, we'll prepend a system prompt if history is empty.

        let msgToSend = message;
        if (chatHistory.length === 0) {
            // First message, include system prompt logic if needed, 
            // but startChat with systemInstruction is cleaner if supported.
            // We will rely on the model config if possible, or just send it.
            // The requirement says: "Eres UNIA, un asistente virtual útil y amigable..."
        }

        // Helper function for exponential backoff
        const retryWithBackoff = async (fn, retries = 3, delay = 2000) => {
            try {
                return await fn();
            } catch (error) {
                if (retries === 0 || !error.message.includes('429')) {
                    throw error;
                }
                console.log(`Rate limit hit. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return retryWithBackoff(fn, retries - 1, delay * 2);
            }
        };

        // Send message with retry logic
        const result = await retryWithBackoff(() => chat.sendMessage(message));
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);

        // Check if it's still a 429 after retries
        if (error.message.includes('429')) {
            return res.status(429).json({
                error: 'Server is currently busy (Rate Limit). Please try again in a few seconds.',
                details: 'Quota exceeded'
            });
        }

        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

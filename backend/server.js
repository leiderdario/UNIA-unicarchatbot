const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

// Debug: Check if API key is loaded
console.log('=== Environment Variables Debug ===');
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);
console.log('GROQ_API_KEY first 10 chars:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) : 'N/A');
console.log('===================================');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Groq Configuration
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Construct chat history for Groq
        // Groq uses OpenAI-compatible format: { role: "user" | "assistant" | "system", content: string }
        const messages = [];

        // Add system message
        messages.push({
            role: "system",
            content: "Eres UNIA, un asistente virtual útil y amigable de la Universidad. Respondes de manera clara, concisa y profesional."
        });

        // Add conversation history
        if (history && history.length > 0) {
            history.forEach(msg => {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({
            role: "user",
            content: message
        });

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant", // Fast and reliable model
            temperature: 0.8,
            max_tokens: 1000,
            top_p: 1,
            stream: false
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

        res.json({ response: responseText });

    } catch (error) {
        console.error('Error calling Groq API:', error);

        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', provider: 'Groq' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using Groq API with model: llama-3.1-8b-instant`);
});

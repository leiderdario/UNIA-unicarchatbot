import axios from 'axios';
import { Message, ChatResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendMessage = async (message: string, history: Message[]) => {
    const response = await api.post<ChatResponse>('/api/chat', {
        message,
        history,
    });
    return response.data;
};

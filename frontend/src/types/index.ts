export interface Message {
    role: 'user' | 'model';
    content: string;
}

export interface ChatResponse {
    response: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

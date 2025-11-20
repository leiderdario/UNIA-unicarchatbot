export interface Message {
    role: 'user' | 'model';
    content: string;
    emotion?: string;
    timestamp?: Date;
}

export interface ChatResponse {
    response: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    gradient: string;
}

export type EmotionType = 'positive' | 'neutral' | 'negative' | 'curious' | 'confused';

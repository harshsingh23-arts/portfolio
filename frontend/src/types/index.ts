export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
}

export interface Project {
  title: string;
  year: string;
  description: string;
  tech: string[];
  stats?: string;
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  tech: string[];
}
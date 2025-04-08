// src/types/message.types.ts
export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
} 
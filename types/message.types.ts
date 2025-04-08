export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  read: boolean;
} 
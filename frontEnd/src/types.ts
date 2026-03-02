/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  token: string;
  username: string;
  content  : string ; 
  sender: 'me' | 'them';
  email : string ; 
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  fileName?: string;
  type: 'text' | 'system' | 'nudge' | 'image' | 'voice' | 'gift' | 'sticker' | 'gif' | 'pdf';
  timestamp: Date;
  isOpened?: boolean;
  replyTo?: {
    id: string;
    text: string;
    username: string;
    email : string
  };
  reactions?: {
    [key: string]: number; // reaction type -> count
  };
}

export interface UserData {
  email: string;
  username: string;
  token: string;
  avatar: string;
  name?: string;
  password?: string;
}

export interface NewsAttachment {
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  type: 'breaking' | 'regular';
  headline: string;
  text: string;
  publicationTime: Date;
  expirationDate: Date;
  coverImage?: string;
  attachments?: NewsAttachment[];
}

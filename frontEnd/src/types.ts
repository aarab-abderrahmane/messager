/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  username: string;
  sender: 'me' | 'them';
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
    sender: 'me' | 'them';
  };
  reactions?: {
    [key: string]: number; // reaction type -> count
  };
}

export interface UserData {
  email: string;
  avatar: string;
  name?: string;
  password?: string;
}

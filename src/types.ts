/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: 'me' | 'them';
  text?: string;
  imageUrl?: string;
  type: 'text' | 'system' | 'nudge' | 'image' | 'voice' | 'gift';
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
}

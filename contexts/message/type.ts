import { ReactNode } from 'react';

export enum MessageTypes {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning'
}
export interface MessageApi {
  id: string;
  description: ReactNode;
  duration: number | null;
  type: MessageTypes;
}
export type MessageSignature = (description?: MessageApi['description'], duration?: MessageApi['duration'], id?: string) => string;

export interface MessageContextApi {
  messages: MessageApi[];
  remove: (id: string) => void;
  clear: () => void;
  messageError: MessageSignature;
  messageInfo: MessageSignature;
  messageSuccess: MessageSignature;
  messageWarning: MessageSignature;
}

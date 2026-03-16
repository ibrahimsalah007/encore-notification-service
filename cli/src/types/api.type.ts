import type { Channel } from './cli.type';

export type ISODateString = string;

export interface UserResponse {
  id: string;
  name: string;
  createdAt: ISODateString;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  channel: Channel;
  title: string;
  body: string;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  deliveryAttempts: number;
  failureReason: string | null;
  createdAt: ISODateString;
  readAt: ISODateString | null;
  isRead: boolean;
}

export interface CreateNotificationResult {
  notification: NotificationResponse;
}

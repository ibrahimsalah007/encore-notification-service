export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  EMAIL: 'email',
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];

export const DELIVERY_STATUSES = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export type DeliveryStatus =
  (typeof DELIVERY_STATUSES)[keyof typeof DELIVERY_STATUSES];

export interface CreateNotificationRequest {
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
}

export interface ListUserNotificationsRequest {
  userId: string;
  limit?: number;
  page?: number;
}

export interface ListUserNotificationsQuery {
  limit?: number;
  page?: number;
}

export interface MarkNotificationAsReadRequest {
  notificationId: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  delivery_status: DeliveryStatus;
  delivery_attempts: number;
  failure_reason: string | null;
  created_at: Date;
  read_at: Date | null;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  deliveryStatus: DeliveryStatus;
  deliveryAttempts: number;
  failureReason: string | null;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
}

export interface ListNotificationsResponse {
  items: NotificationResponse[];
  total: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
}

export interface CreateNotificationResult {
  notification: NotificationResponse;
}

export interface MarkNotificationAsReadResponse {
  notification: NotificationResponse;
}
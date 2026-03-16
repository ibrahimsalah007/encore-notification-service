import { api } from 'encore.dev/api';
import type {
  CreateNotificationRequest,
  CreateNotificationResult,
  ListNotificationsResponse,
  ListUserNotificationsRequest,
  MarkNotificationAsReadRequest,
  MarkNotificationAsReadResponse,
} from './dto/notification.dto';
import { NotificationService } from './notifications.service';

const notificationService = new NotificationService();

export const createNotification = api(
  { method: 'POST', path: '/notifications', expose: true },
  async (req: CreateNotificationRequest): Promise<CreateNotificationResult> => {
    return notificationService.createNotification(req);
  },
);

export const listUserNotifications = api(
  { method: 'GET', path: '/users/:userId/notifications', expose: true },
  async (params: ListUserNotificationsRequest): Promise<ListNotificationsResponse> => {
    const { userId, limit, page } = params;

    return notificationService.listUserNotifications(userId, { limit, page });
  },
);

export const listUnreadNotifications = api(
  { method: 'GET', path: '/users/:userId/notifications/unread', expose: true },
  async (params: ListUserNotificationsRequest): Promise<ListNotificationsResponse> => {
    const { userId, limit, page } = params;

    return notificationService.listUnreadUserNotifications(userId, {
      limit,
      page,
    });
  },
);

export const markNotificationAsRead = api(
  {
    method: 'PATCH',
    path: '/notifications/:notificationId/read',
    expose: true,
  },
  async (params: MarkNotificationAsReadRequest): Promise<MarkNotificationAsReadResponse> => {
    return notificationService.markNotificationAsRead(params.notificationId);
  },
);

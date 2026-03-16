import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';

import { hasNextPage, normalizeLimit, normalizePage } from '../lib/pagination';
import { UserService } from '../users/user.service';
import { NotificationPresenter } from './presenters/notifications.presenter';
import { NotificationRepository } from './notifications.repository';
import {
  CreateNotificationRequest,
  CreateNotificationResult,
  DELIVERY_STATUSES,
  DeliveryStatus,
  ListNotificationsResponse,
  ListUserNotificationsQuery,
  MarkNotificationAsReadResponse,
  NOTIFICATION_CHANNELS,
  NotificationChannel,
} from './dto/notification.dto';

export class NotificationService {
  logger = log.with({ Context: NotificationService.name });

  constructor(
    private readonly notificationRepository = new NotificationRepository(),
    private readonly userService = new UserService(),
  ) {}

  async createNotification(payload: CreateNotificationRequest): Promise<CreateNotificationResult> {
    const userId = payload.userId?.trim();
    const title = payload.title?.trim();
    const body = payload.body?.trim();

    if (!userId) {
      throw new APIError(ErrCode.InvalidArgument, 'User id is required');
    }

    if (!this.isValidChannel(payload.channel)) {
      throw new APIError(ErrCode.InvalidArgument, 'Invalid notification channel');
    }

    if (!title) {
      throw new APIError(ErrCode.InvalidArgument, 'Notification title is required');
    }

    if (!body) {
      throw new APIError(ErrCode.InvalidArgument, 'Notification body is required');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new APIError(ErrCode.NotFound, 'User not found');
    }

    const createdNotification = await this.notificationRepository.create({
      userId,
      channel: payload.channel,
      title,
      body,
      deliveryStatus: DELIVERY_STATUSES.PENDING,
      deliveryAttempts: 0,
      failureReason: null,
    });

    await this.deliverNotification(createdNotification.id, payload.channel);

    const finalNotification = await this.notificationRepository.findById(createdNotification.id);

    if (!finalNotification) {
      throw new APIError(ErrCode.NotFound, 'Notification not found after creation');
    }

    return {
      notification: NotificationPresenter.toResponse(finalNotification),
    };
  }

  async listUserNotifications(userId: string, query: ListUserNotificationsQuery): Promise<ListNotificationsResponse> {
    const normalizedUserId = userId?.trim();

    if (!normalizedUserId) {
      throw new APIError(ErrCode.InvalidArgument, 'User id is required');
    }

    const user = await this.userService.getUserById(normalizedUserId);

    if (!user) {
      throw new APIError(ErrCode.NotFound, 'User not found');
    }

    const limit = normalizeLimit(query.limit);
    const page = normalizePage(query.page);

    const [rows, total] = await Promise.all([
      this.notificationRepository.listByUser(normalizedUserId, { limit, page }),
      this.notificationRepository.countByUser(normalizedUserId),
    ]);

    return {
      items: NotificationPresenter.toResponseList(rows),
      total,
      limit,
      page,
      hasNextPage: hasNextPage(page, limit, total),
    };
  }

  async listUnreadUserNotifications(userId: string, query: ListUserNotificationsQuery): Promise<ListNotificationsResponse> {
    const normalizedUserId = userId?.trim();

    if (!normalizedUserId) {
      throw new APIError(ErrCode.InvalidArgument, 'User id is required');
    }

    const user = await this.userService.getUserById(normalizedUserId);

    if (!user) {
      throw new APIError(ErrCode.NotFound, 'User not found');
    }

    const limit = normalizeLimit(query.limit);
    const page = normalizePage(query.page);

    const [rows, total] = await Promise.all([
      this.notificationRepository.listUnreadByUser(normalizedUserId, { limit, page }),
      this.notificationRepository.countUnreadByUser(normalizedUserId),
    ]);

    return {
      items: NotificationPresenter.toResponseList(rows),
      total,
      limit,
      page,
      hasNextPage: hasNextPage(page, limit, total),
    };
  }

  async markNotificationAsRead(notificationId: string): Promise<MarkNotificationAsReadResponse> {
    const normalizedNotificationId = notificationId?.trim();

    if (!normalizedNotificationId) {
      throw new APIError(ErrCode.InvalidArgument, 'Notification id is required');
    }

    const notification = await this.notificationRepository.findById(normalizedNotificationId);

    if (!notification) {
      throw new APIError(ErrCode.NotFound, 'Notification not found');
    }

    if (notification.read_at) {
      return {
        notification: NotificationPresenter.toResponse(notification),
      };
    }

    const updatedNotification = await this.notificationRepository.markAsRead(normalizedNotificationId);

    if (!updatedNotification) {
      throw new APIError(ErrCode.NotFound, 'Notification not found while marking as read');
    }

    return {
      notification: NotificationPresenter.toResponse(updatedNotification),
    };
  }

  private async deliverNotification(notificationId: string, channel: NotificationChannel): Promise<void> {
    if (!this.isValidChannel(channel)) {
      throw new APIError(ErrCode.FailedPrecondition, 'Unsupported notification channel');
    }

    let status: DeliveryStatus = DELIVERY_STATUSES.PENDING;

    let failureReason: string | null = null;

    if (channel === NOTIFICATION_CHANNELS.IN_APP) {
      status = DELIVERY_STATUSES.SENT;
    }

    if (channel === NOTIFICATION_CHANNELS.EMAIL) {
      const emailResult = this.simulateEmailDelivery();
      status = emailResult.status;
      failureReason = emailResult.failureReason;
    }
    
    await this.notificationRepository.updateDeliveryStatus(notificationId, status, 1, failureReason);
  }

  private simulateEmailDelivery(): {
    status: (typeof DELIVERY_STATUSES)[keyof typeof DELIVERY_STATUSES];
    failureReason: string | null;
  } {
    const isSuccess = Math.random() >= 0.2;

    this.logger.info(`Simulating email delivery with ${isSuccess ? 'success' : 'failure'}`);

    if (isSuccess) {
      this.logger.info('Simulated email delivery success');

      return {
        status: DELIVERY_STATUSES.SENT,
        failureReason: null,
      };
    }

    this.logger.info('Simulated email delivery failure');

    return {
      status: DELIVERY_STATUSES.FAILED,
      failureReason: 'Simulated email delivery failure',
    };
  }

  private isValidChannel(channel: string): channel is NotificationChannel {
    return Object.values(NOTIFICATION_CHANNELS).includes(channel as NotificationChannel);
  }
}

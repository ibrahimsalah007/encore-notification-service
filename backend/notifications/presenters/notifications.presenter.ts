import type { NotificationResponse, NotificationRow } from '../dto/notification.dto';

export class NotificationPresenter {
  static toResponse(row: NotificationRow): NotificationResponse {
    return {
      id: row.id,
      userId: row.user_id,
      channel: row.channel,
      title: row.title,
      body: row.body,
      deliveryStatus: row.delivery_status,
      deliveryAttempts: row.delivery_attempts,
      failureReason: row.failure_reason,
      createdAt: row.created_at.toISOString(),
      readAt: row.read_at ? row.read_at.toISOString() : null,
      isRead: row.read_at !== null,
    };
  }

  static toResponseList(rows: NotificationRow[]): NotificationResponse[] {
    return rows.map(NotificationPresenter.toResponse);
  }
}
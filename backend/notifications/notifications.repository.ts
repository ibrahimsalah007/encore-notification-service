import type { Knex } from 'knex';
import { db } from '../db';
import type { NotificationRow, NotificationChannel, DeliveryStatus } from './dto/notification.dto';
import { toSqlOffset } from '../lib/pagination';

const TABLES = {
  notifications: 'notifications',
} as const;

export interface CreateNotificationInput {
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  deliveryStatus: DeliveryStatus;
  deliveryAttempts: number;
  failureReason: string | null;
}

export class NotificationRepository {
  constructor(private readonly knex: Knex = db) {}

  async create(input: CreateNotificationInput): Promise<NotificationRow> {
    const [row] = await this.knex<NotificationRow>(TABLES.notifications)
      .insert({
        user_id: input.userId,
        channel: input.channel,
        title: input.title,
        body: input.body,
        delivery_status: input.deliveryStatus,
        delivery_attempts: input.deliveryAttempts,
        failure_reason: input.failureReason,
      })
      .returning([
        'id',
        'user_id',
        'channel',
        'title',
        'body',
        'delivery_status',
        'delivery_attempts',
        'failure_reason',
        'created_at',
        'read_at',
      ]);

    return row;
  }

  async findById(id: string): Promise<NotificationRow | null> {
    const row = await this.knex<NotificationRow>(TABLES.notifications)
      .select([
        'id',
        'user_id',
        'channel',
        'title',
        'body',
        'delivery_status',
        'delivery_attempts',
        'failure_reason',
        'created_at',
        'read_at',
      ])
      .where({ id })
      .first();

    return row ?? null;
  }

  async listByUser(userId: string, pagination: { limit: number; page: number }): Promise<NotificationRow[]> {
    return this.knex<NotificationRow>(TABLES.notifications)
      .select([
        'id',
        'user_id',
        'channel',
        'title',
        'body',
        'delivery_status',
        'delivery_attempts',
        'failure_reason',
        'created_at',
        'read_at',
      ])
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
        .limit(pagination.limit)
        .offset(toSqlOffset(pagination.page, pagination.limit));
  }

      async listUnreadByUser(userId: string, pagination: { limit: number; page: number }): Promise<NotificationRow[]> {
    return this.knex<NotificationRow>(TABLES.notifications)
      .select([
        'id',
        'user_id',
        'channel',
        'title',
        'body',
        'delivery_status',
        'delivery_attempts',
        'failure_reason',
        'created_at',
        'read_at',
      ])
      .where({ user_id: userId })
      .whereNull('read_at')
      .orderBy('created_at', 'desc')
        .limit(pagination.limit)
        .offset(toSqlOffset(pagination.page, pagination.limit));
  }

  async countByUser(userId: string): Promise<number> {
    const result = await this.knex(TABLES.notifications).where({ user_id: userId }).count<{ count: string }[]>({ count: '*' }).first();

    return Number(result?.count ?? 0);
  }

  async countUnreadByUser(userId: string): Promise<number> {
    const result = await this.knex(TABLES.notifications)
      .where({ user_id: userId })
      .whereNull('read_at')
      .count<{ count: string }[]>({ count: '*' })
      .first();

    return Number(result?.count ?? 0);
  }

  async markAsRead(notificationId: string): Promise<NotificationRow | null> {
    const [row] = await this.knex<NotificationRow>(TABLES.notifications)
      .where({ id: notificationId })
      .update({
        read_at: this.knex.fn.now(),
      })
      .returning([
        'id',
        'user_id',
        'channel',
        'title',
        'body',
        'delivery_status',
        'delivery_attempts',
        'failure_reason',
        'created_at',
        'read_at',
      ]);

    return row ?? null;
  }

  async updateDeliveryStatus(
    notificationId: string,
    status: DeliveryStatus,
    attempts: number,
    failureReason: string | null,
  ): Promise<void> {
    await this.knex(TABLES.notifications).where({ id: notificationId }).update({
      delivery_status: status,
      delivery_attempts: attempts,
      failure_reason: failureReason,
    });
  }
}

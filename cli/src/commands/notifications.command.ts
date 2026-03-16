import type { Command } from 'commander';

import { http } from '../lib/http';
import { parseChannel, parsePositiveInt, requireString } from '../lib/validate';
import type { ReadOpts, SendOpts, UserIdOpts } from '../types/cli.type';
import type { CreateNotificationResult, NotificationResponse, PaginatedResponse } from '../types/api.type';

export function registerNotificationCommands(program: Command, getApiUrl: () => string): void {
  program
    .command('send')
    .description('Send a notification')
    .requiredOption('--user-id <id>', 'User ID')
    .requiredOption('--channel <channel>', 'in_app | email')
    .requiredOption('--title <title>', 'Notification title')
    .requiredOption('--body <body>', 'Notification body')
    .action(async (opts: SendOpts) => {
      const apiUrl = getApiUrl();

      const payload = {
        userId: requireString(opts.userId, '--user-id'),
        channel: parseChannel(opts.channel, '--channel'),
        title: requireString(opts.title, '--title'),
        body: requireString(opts.body, '--body'),
      };

      const notify = await http<CreateNotificationResult>(apiUrl, '/notifications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log(JSON.stringify(notify, null, 2));
    });

  program
    .command('list')
    .description('List all notifications for a user')
    .requiredOption('--user-id <id>', 'User ID')
    .option('--page <page>', 'Page number for pagination', '1')
    .option('--limit <limit>', 'Number of items per page', '20')
    .action(async (opts: UserIdOpts) => {
      const apiUrl = getApiUrl();
      const userId = requireString(opts.userId, '--user-id');
      const page = parsePositiveInt(opts.page, '--page');
      const limit = parsePositiveInt(opts.limit, '--limit');

      const query = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();

      const out = await http<PaginatedResponse<NotificationResponse>>(apiUrl, `/users/${userId}/notifications?${query}`, { method: 'GET' });

      console.log(JSON.stringify(out, null, 2));
    });

  program
    .command('unread')
    .description('List unread notifications for a user')
    .requiredOption('--user-id <id>', 'User ID')
    .option('--page <page>', 'Page number for pagination', '1')
    .option('--limit <limit>', 'Number of items per page', '20')
    .action(async (opts: UserIdOpts) => {
      const apiUrl = getApiUrl();
      const userId = requireString(opts.userId, '--user-id');
      const page = parsePositiveInt(opts.page, '--page');
      const limit = parsePositiveInt(opts.limit, '--limit');

      const query = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();

      const out = await http<PaginatedResponse<NotificationResponse>>(apiUrl, `/users/${userId}/notifications/unread?${query}`, {
        method: 'GET',
      });

      console.log(JSON.stringify(out, null, 2));
    });

  program
    .command('read')
    .description('Mark a notification as read')
    .requiredOption('--id <notification-id>', 'Notification ID')
    .action(async (opts: ReadOpts) => {
      const apiUrl = getApiUrl();
      const id = requireString(opts.id, '--id');
      const out = await http<unknown>(apiUrl, `/notifications/${id}/read`, {
        method: 'PATCH',
      });
      console.log(JSON.stringify(out, null, 2));
    });
}

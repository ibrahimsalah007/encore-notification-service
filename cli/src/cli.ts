#!/usr/bin/env bun

import { Command } from 'commander';
import { loadEnv, resolveApiUrl } from './lib/config';
import { registerNotificationCommands } from './commands/notifications.command';
import { usersCommands } from './commands/users.command';



await loadEnv();

const program = new Command();
program
  .name('notify')
  .description('Real-time notification system CLI')
  .option('--api-url <url>', 'Base URL for the backend (or NOTIFY_API_URL)');

function getApiUrl(): string {
  return resolveApiUrl(program.opts().apiUrl);
}

usersCommands(program, getApiUrl);
registerNotificationCommands(program, getApiUrl);

program.parseAsync(Bun.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
});

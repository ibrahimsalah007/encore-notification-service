import type { Command } from 'commander';
import { http } from '../lib/http';
import { parsePositiveInt, requireString } from '../lib/validate';
import type { PaginationOpts, UsersCreateOpts } from '../types/cli.type';
import type { PaginatedResponse, UserResponse } from '../types/api.type';

export function usersCommands(program: Command, getApiUrl: () => string): void {
  program
    .command('users:create')
    .description('Create a user')
    .requiredOption('--name <name>', 'User name')
    .requiredOption('--email <email>', 'User email')
    .action(async (opts: UsersCreateOpts) => {
      const apiUrl = getApiUrl();
      const payload = {
        name: requireString(opts.name, '--name'),
        email: requireString(opts.email, '--email'),
      };

      const user = await http<UserResponse>(apiUrl, '/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log(JSON.stringify(user, null, 2));
    });

  program
    .command('users:list')
    .description('List all users')
    .option('--page <page>', 'Page number for pagination', '1')
    .option('--limit <limit>', 'Number of items per page', '20')
    .action(async (opts: PaginationOpts) => {
      const page = parsePositiveInt(opts.page, '--page');
      const limit = parsePositiveInt(opts.limit, '--limit');

      const apiUrl = getApiUrl();

      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      }).toString();

      const out = await http<PaginatedResponse<UserResponse>>(apiUrl, `/users?${query}`, {
        method: 'GET',
      });
      
      console.log(JSON.stringify(out, null, 2));
    });
}

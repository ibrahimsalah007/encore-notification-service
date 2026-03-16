export type Channel = 'in_app' | 'email';

export type UsersCreateOpts = { name: string; email: string };

export type PaginationOpts = {
  page?: string;
  limit?: string;
};

export type SendOpts = {
  userId: string;
  channel: string;
  title: string;
  body: string;
};

export type UserIdOpts = { userId: string } & PaginationOpts;

export type ReadOpts = { id: string };

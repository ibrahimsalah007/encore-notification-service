import type { Knex } from 'knex';
import { db } from '../db';
import type { CreateUserRequest, UserRow } from './dto/users.dto';
import { toSqlOffset } from '../lib/pagination';

const TABLES = {
  users: 'users',
} as const;

export class UserRepository {
  constructor(private readonly knex: Knex = db) {}

  async create(payload: CreateUserRequest): Promise<UserRow> {
    const [row] = await this.knex<UserRow>(TABLES.users)
      .insert({
        name: payload.name,
        email: payload.email,
      })
      .returning(['id', 'name', 'email', 'created_at']);

    return row;
  }

  async findById(id: string): Promise<UserRow | null> {
    const row = await this.knex<UserRow>(TABLES.users).select(['id', 'name', 'email', 'created_at']).where({ id }).first();

    return row ?? null;
  }

  async list(query: { limit: number; page: number }): Promise<UserRow[]> {
    return this.knex<UserRow>(TABLES.users)
      .select(['id', 'name', 'email', 'created_at'])
      .orderBy('created_at', 'desc')
      .limit(query.limit)
      .offset(toSqlOffset(query.page, query.limit));
  }

  async count(): Promise<number> {
    const result = await this.knex(TABLES.users).count<{ count: string }[]>({ count: '*' }).first();

    return Number(result?.count ?? 0);
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const row = await this.knex<UserRow>(TABLES.users).select(['id', 'name', 'email', 'created_at']).where({ email }).first();
    return row ?? null;
  }
}

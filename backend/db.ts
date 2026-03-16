import { SQLDatabase } from 'encore.dev/storage/sqldb';
import knex, { Knex } from 'knex';

const NotificationServiceDB = new SQLDatabase('notification_service', {
  migrations: './migrations',
});

let dbInstance: Knex | null = null;

export function getDb(): Knex {
  if (!dbInstance) {
    dbInstance = knex({
      client: 'pg',
      connection: NotificationServiceDB.connectionString,
    });
  }

  return dbInstance;
}

export const db = getDb();

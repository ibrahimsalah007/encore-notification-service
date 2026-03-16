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
      connection: {
        connectionString: NotificationServiceDB.connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  return dbInstance;
}

export const db = getDb();

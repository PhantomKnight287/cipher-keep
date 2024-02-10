import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { Pool } from 'pg';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
});

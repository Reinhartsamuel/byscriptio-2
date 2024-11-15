import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// eslint-disable-next-line no-undef
const client = postgres(process.env.POSTGRES_DATABASE_URL, {
    ssl: {
        rejectUnauthorized: false
    },
    // prepare: true
});
const postgresDb = drizzle(client);

export default postgresDb;